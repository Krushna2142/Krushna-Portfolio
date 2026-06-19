'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { skillsApi, skillCategoriesApi } from '@/lib/admin'

const LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert']
const LEVEL_COLORS: Record<string, string> = {
  'Beginner': '#6bcf7f',
  'Intermediate': '#4fc3f7',
  'Advanced': '#ffd93d',
  'Expert': '#ff6b9d',
}

export default function SkillsAdmin() {
  const [skills, setSkills] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [editingSkill, setEditingSkill] = useState<any>(null)
  const [editingCategory, setEditingCategory] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'skills' | 'categories' | 'settings'>('skills')
  const [message, setMessage] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    category: 'Frontend',
    proficiency: 80,
    icon: '',
    color: '#00e5ff',
    level: 'Advanced',
    yearsExperience: 1,
    description: '',
    linkUrl: '',
    featured: false,
    visible: true,
    order: 0,
    marqueeRow: 1,
  })

  const [categoryData, setCategoryData] = useState({
    name: '',
    icon: '⚡',
    color: '#00e5ff',
    description: '',
    visible: true,
    order: 0,
  })

  const [settings, setSettings] = useState({
    skills_layout: 'marquee',
    skills_show_proficiency: true,
    skills_show_level: true,
    skills_show_years: false,
    skills_show_description: false,
    skills_marquee_speed: 30,
    skills_marquee_rows: 3,
    skills_grid_columns: 4,
  })

  const fetchData = async () => {
    try {
      const [skillsRes, categoriesRes] = await Promise.all([
        skillsApi.getAll(),
        skillCategoriesApi.adminGetAll(),
      ])
      setSkills(skillsRes.data.data || [])
      setCategories(categoriesRes.data.data || [])
    } catch (err) {
      console.error('Failed to fetch data', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const handleCreate = () => {
    setEditingSkill(null)
    setFormData({
      name: '', category: categories[0]?.name || 'Frontend',
      proficiency: 80, icon: '', color: '#00e5ff', level: 'Advanced',
      yearsExperience: 1, description: '', linkUrl: '',
      featured: false, visible: true, order: 0, marqueeRow: 1,
    })
    setShowModal(true)
  }

  const handleEdit = (skill: any) => {
    setEditingSkill(skill)
    setFormData({
      name: skill.name,
      category: skill.category,
      proficiency: skill.proficiency,
      icon: skill.icon || '',
      color: skill.color || '#00e5ff',
      level: skill.level || 'Advanced',
      yearsExperience: skill.yearsExperience || 1,
      description: skill.description || '',
      linkUrl: skill.linkUrl || '',
      featured: skill.featured || false,
      visible: skill.visible !== false,
      order: skill.order || 0,
      marqueeRow: skill.marqueeRow || 1,
    })
    setShowModal(true)
  }

  const handleSave = async () => {
    try {
      if (editingSkill) {
        await skillsApi.update(editingSkill.id, formData)
        setMessage('✅ Skill updated')
      } else {
        await skillsApi.create(formData)
        setMessage('✅ Skill created')
      }
      setShowModal(false)
      fetchData()
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      setMessage('❌ Failed to save')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this skill?')) return
    try {
      await skillsApi.delete(id)
      setMessage('✅ Skill deleted')
      fetchData()
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      console.error(err)
    }
  }

  const toggleFeatured = async (skill: any) => {
    try {
      await skillsApi.update(skill.id, { ...skill, featured: !skill.featured })
      fetchData()
    } catch (err) {
      console.error(err)
    }
  }

  const toggleVisible = async (skill: any) => {
    try {
      await skillsApi.update(skill.id, { ...skill, visible: !skill.visible })
      fetchData()
    } catch (err) {
      console.error(err)
    }
  }

  // Category handlers
  const handleCreateCategory = () => {
    setEditingCategory(null)
    setCategoryData({ name: '', icon: '⚡', color: '#00e5ff', description: '', visible: true, order: 0 })
    setShowCategoryModal(true)
  }

  const handleEditCategory = (cat: any) => {
    setEditingCategory(cat)
    setCategoryData({
      name: cat.name,
      icon: cat.icon || '⚡',
      color: cat.color || '#00e5ff',
      description: cat.description || '',
      visible: cat.visible !== false,
      order: cat.order || 0,
    })
    setShowCategoryModal(true)
  }

  const handleSaveCategory = async () => {
    try {
      if (editingCategory) {
        await skillCategoriesApi.update(editingCategory.id, categoryData)
        setMessage('✅ Category updated')
      } else {
        await skillCategoriesApi.create(categoryData)
        setMessage('✅ Category created')
      }
      setShowCategoryModal(false)
      fetchData()
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      setMessage('❌ Failed to save category')
    }
  }

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Delete this category? Skills in this category will lose their category.')) return
    try {
      await skillCategoriesApi.delete(id)
      fetchData()
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return <div className="text-[var(--accent)] animate-pulse">Loading...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <h1 className="text-4xl font-bold">Skills Manager</h1>
        <div className="flex gap-2">
          {activeTab === 'skills' && (
            <button onClick={handleCreate} className="px-6 py-3 bg-[var(--accent)] text-black font-bold rounded-xl hover:shadow-[0_0_40px_rgba(0,229,255,0.4)] transition-all">
              + New Skill
            </button>
          )}
          {activeTab === 'categories' && (
            <button onClick={handleCreateCategory} className="px-6 py-3 bg-[var(--accent)] text-black font-bold rounded-xl hover:shadow-[0_0_40px_rgba(0,229,255,0.4)] transition-all">
              + New Category
            </button>
          )}
        </div>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-xl ${message.includes('✅') ? 'bg-green-500/20 border border-green-500/50 text-green-400' : 'bg-red-500/20 border border-red-500/50 text-red-400'}`}>
          {message}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b border-white/10">
        {[
          { id: 'skills', label: '🎯 Skills', count: skills.length },
          { id: 'categories', label: '📂 Categories', count: categories.length },
          { id: 'settings', label: '⚙️ Display Settings' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-6 py-3 rounded-t-xl font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-white/10 text-[var(--accent)] border-b-2 border-[var(--accent)]'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab.label} {tab.count !== undefined && <span className="text-xs ml-1">({tab.count})</span>}
          </button>
        ))}
      </div>

      {/* SKILLS TAB */}
      {activeTab === 'skills' && (
        <div className="space-y-6">
          {categories.map((cat) => {
            const catSkills = skills.filter(s => s.category === cat.name)
            if (catSkills.length === 0) return null

            return (
              <div key={cat.id}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{cat.icon}</span>
                  <h2 className="text-2xl font-bold" style={{ color: cat.color }}>{cat.name}</h2>
                  <span className="text-sm text-[var(--muted)]">({catSkills.length} skills)</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {catSkills.map((skill, i) => (
                    <motion.div
                      key={skill.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="p-5 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 hover:border-[var(--accent)]/30 transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {skill.icon && <span className="text-2xl">{skill.icon}</span>}
                          <div>
                            <h3 className="font-bold flex items-center gap-2">
                              {skill.name}
                              {skill.featured && <span className="text-xs">⭐</span>}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span
                                className="text-xs px-2 py-0.5 rounded-full font-medium"
                                style={{ 
                                  backgroundColor: `${skill.color}20`,
                                  color: skill.color,
                                  border: `1px solid ${skill.color}40`,
                                }}
                              >
                                {skill.level}
                              </span>
                              <span className="text-xs text-[var(--muted)]">
                                {skill.yearsExperience}y exp
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {skill.description && (
                        <p className="text-xs text-[var(--muted)] mb-3 line-clamp-2">{skill.description}</p>
                      )}

                      {/* Proficiency bar */}
                      <div className="mb-3">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-[var(--muted)]">Proficiency</span>
                          <span style={{ color: skill.color }}>{skill.proficiency}%</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${skill.proficiency}%` }}
                            transition={{ duration: 1, delay: i * 0.05 }}
                            className="h-full rounded-full"
                            style={{ background: `linear-gradient(90deg, ${skill.color}, ${skill.color}80)` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-[var(--muted)] mb-3">
                        <span>Row {skill.marqueeRow}</span>
                        {skill.linkUrl && <span className="truncate ml-2">🔗 {skill.linkUrl}</span>}
                      </div>

                      <div className="flex gap-2">
                        <button onClick={() => toggleFeatured(skill)} className={`flex-1 px-2 py-1.5 rounded text-xs ${skill.featured ? 'bg-[var(--accent)]/20 text-[var(--accent)]' : 'bg-white/5 text-white/60'}`}>
                          {skill.featured ? '⭐' : '☆'}
                        </button>
                        <button onClick={() => toggleVisible(skill)} className={`flex-1 px-2 py-1.5 rounded text-xs ${skill.visible ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                          {skill.visible ? '👁️' : '🚫'}
                        </button>
                        <button onClick={() => handleEdit(skill)} className="flex-1 px-2 py-1.5 rounded bg-blue-500/20 text-blue-400 text-xs">Edit</button>
                        <button onClick={() => handleDelete(skill.id)} className="px-2 py-1.5 rounded bg-red-500/20 text-red-400 text-xs">🗑️</button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* CATEGORIES TAB */}
      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl"
                    style={{ backgroundColor: `${cat.color}20`, border: `2px solid ${cat.color}` }}
                  >
                    {cat.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{cat.name}</h3>
                    <p className="text-xs text-[var(--muted)]">
                      {skills.filter(s => s.category === cat.name).length} skills
                    </p>
                  </div>
                </div>
              </div>
              {cat.description && (
                <p className="text-sm text-[var(--muted)] mb-4">{cat.description}</p>
              )}
              <div className="flex gap-2">
                <button onClick={() => handleEditCategory(cat)} className="flex-1 px-3 py-2 rounded-lg bg-blue-500/20 text-blue-400 text-sm">Edit</button>
                <button onClick={() => handleDeleteCategory(cat.id)} className="px-3 py-2 rounded-lg bg-red-500/20 text-red-400 text-sm">🗑️</button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* SETTINGS TAB */}
      {activeTab === 'settings' && (
        <div className="space-y-4">
          <div className="p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10">
            <h2 className="text-2xl font-bold mb-6">🎨 Display Settings</h2>
            
            <div className="space-y-4">
              {/* Layout */}
              <div className="p-4 rounded-xl bg-black/30">
                <label className="font-medium block mb-2">Layout Style</label>
                <div className="flex gap-2">
                  {['marquee', 'grid', 'list'].map((layout) => (
                    <button
                      key={layout}
                      onClick={() => setSettings({ ...settings, skills_layout: layout })}
                      className={`flex-1 px-4 py-3 rounded-lg capitalize transition-all ${
                        settings.skills_layout === layout
                          ? 'bg-[var(--accent)] text-black font-bold'
                          : 'bg-white/5 text-white/60 hover:bg-white/10'
                      }`}
                    >
                      {layout}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              {[
                { key: 'skills_show_proficiency', label: 'Show Proficiency Bars', icon: '📊' },
                { key: 'skills_show_level', label: 'Show Level Badges', icon: '🏷️' },
                { key: 'skills_show_years', label: 'Show Years of Experience', icon: '📅' },
                { key: 'skills_show_description', label: 'Show Descriptions', icon: '📝' },
              ].map((toggle) => (
                <div key={toggle.key} className="p-4 rounded-xl bg-black/30 flex items-center justify-between">
                  <div>
                    <span className="mr-2">{toggle.icon}</span>
                    <span className="font-medium">{toggle.label}</span>
                  </div>
                  <button
                    onClick={() => setSettings({ ...settings, [toggle.key]: !settings[toggle.key as keyof typeof settings] })}
                    className={`relative w-14 h-7 rounded-full transition-all ${
                      settings[toggle.key as keyof typeof settings] ? 'bg-[var(--accent)]' : 'bg-white/20'
                    }`}
                  >
                    <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all ${
                      settings[toggle.key as keyof typeof settings] ? 'left-8' : 'left-1'
                    }`} />
                  </button>
                </div>
              ))}

              {/* Number inputs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-black/30">
                  <label className="font-medium block mb-2">Marquee Speed (seconds)</label>
                  <input
                    type="number"
                    min="10"
                    max="120"
                    value={settings.skills_marquee_speed}
                    onChange={(e) => setSettings({ ...settings, skills_marquee_speed: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 rounded bg-white/5 border border-white/10 text-white"
                  />
                </div>
                <div className="p-4 rounded-xl bg-black/30">
                  <label className="font-medium block mb-2">Marquee Rows</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={settings.skills_marquee_rows}
                    onChange={(e) => setSettings({ ...settings, skills_marquee_rows: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 rounded bg-white/5 border border-white/10 text-white"
                  />
                </div>
                <div className="p-4 rounded-xl bg-black/30">
                  <label className="font-medium block mb-2">Grid Columns</label>
                  <input
                    type="number"
                    min="2"
                    max="6"
                    value={settings.skills_grid_columns}
                    onChange={(e) => setSettings({ ...settings, skills_grid_columns: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 rounded bg-white/5 border border-white/10 text-white"
                  />
                </div>
              </div>

              <button
                onClick={async () => {
                  try {
                    await Promise.all(
                      Object.entries(settings).map(([key, value]) =>
                        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/config/${key}`, {
                          method: 'PATCH',
                          headers: { 
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
                          },
                          body: JSON.stringify({ value }),
                        })
                      )
                    )
                    setMessage('✅ Settings saved')
                    setTimeout(() => setMessage(''), 3000)
                  } catch (err) {
                    setMessage('❌ Failed to save settings')
                  }
                }}
                className="w-full py-3 bg-[var(--accent)] text-black font-bold rounded-xl hover:shadow-[0_0_40px_rgba(0,229,255,0.4)] transition-all"
              >
                💾 Save All Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SKILL MODAL */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-3xl my-8 p-8 rounded-2xl backdrop-blur-xl bg-[#0a0a0a] border border-white/10 max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-2xl font-bold mb-6">{editingSkill ? 'Edit Skill' : 'New Skill'}</h2>
              
              <div className="space-y-4">
                {/* Preview */}
                <div className="p-4 rounded-xl bg-black/30 border border-white/10">
                  <p className="text-xs text-[var(--muted)] mb-2">Live Preview:</p>
                  <div className="flex items-center gap-3">
                    {formData.icon && <span className="text-3xl">{formData.icon}</span>}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-lg">{formData.name || 'Skill Name'}</span>
                        <span
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: `${formData.color}20`, color: formData.color, border: `1px solid ${formData.color}40` }}
                        >
                          {formData.level}
                        </span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${formData.proficiency}%`, background: `linear-gradient(90deg, ${formData.color}, ${formData.color}80)` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[var(--accent)] focus:outline-none text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Icon (emoji)</label>
                    <input
                      type="text"
                      value={formData.icon}
                      onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                      placeholder="⚡"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[var(--accent)] focus:outline-none text-white text-2xl text-center"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#111] border border-white/10 focus:border-[var(--accent)] focus:outline-none text-white"
                    >
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.name} style={{ backgroundColor: '#111' }}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Level</label>
                    <select
                      value={formData.level}
                      onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#111] border border-white/10 focus:border-[var(--accent)] focus:outline-none text-white"
                    >
                      {LEVELS.map(l => <option key={l} value={l} style={{ backgroundColor: '#111' }}>{l}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Color <span className="text-xs text-[var(--muted)]">(for badges, bars)</span>
                  </label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="w-16 h-12 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[var(--accent)] focus:outline-none text-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Proficiency: {formData.proficiency}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={formData.proficiency}
                    onChange={(e) => setFormData({ ...formData, proficiency: parseInt(e.target.value) })}
                    className="w-full"
                    style={{ accentColor: formData.color }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Years of Experience</label>
                    <input
                      type="number"
                      min="0"
                      max="50"
                      value={formData.yearsExperience}
                      onChange={(e) => setFormData({ ...formData, yearsExperience: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[var(--accent)] focus:outline-none text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Marquee Row (1-{settings.skills_marquee_rows})</label>
                    <input
                      type="number"
                      min="1"
                      max={settings.skills_marquee_rows}
                      value={formData.marqueeRow}
                      onChange={(e) => setFormData({ ...formData, marqueeRow: parseInt(e.target.value) || 1 })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[var(--accent)] focus:outline-none text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={2}
                    placeholder="Brief description of this skill..."
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[var(--accent)] focus:outline-none text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Link URL (optional)</label>
                  <input
                    type="text"
                    value={formData.linkUrl}
                    onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                    placeholder="https://docs.example.com"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[var(--accent)] focus:outline-none text-white"
                  />
                </div>

                <div className="flex gap-6 flex-wrap">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={formData.featured} onChange={(e) => setFormData({ ...formData, featured: e.target.checked })} className="w-4 h-4 accent-[var(--accent)]" />
                    <span>⭐ Featured</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={formData.visible} onChange={(e) => setFormData({ ...formData, visible: e.target.checked })} className="w-4 h-4 accent-[var(--accent)]" />
                    <span>👁️ Visible</span>
                  </label>
                </div>

                <div className="flex gap-3 pt-4 border-t border-white/10">
                  <button onClick={handleSave} className="flex-1 py-3 bg-[var(--accent)] text-black font-bold rounded-xl hover:shadow-[0_0_40px_rgba(0,229,255,0.4)] transition-all">
                    {editingSkill ? '💾 Update' : '✨ Create'}
                  </button>
                  <button onClick={() => setShowModal(false)} className="flex-1 py-3 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-all">
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CATEGORY MODAL */}
      <AnimatePresence>
        {showCategoryModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setShowCategoryModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md p-8 rounded-2xl backdrop-blur-xl bg-[#0a0a0a] border border-white/10"
            >
              <h2 className="text-2xl font-bold mb-6">{editingCategory ? 'Edit Category' : 'New Category'}</h2>
              
              {/* Preview */}
              <div className="p-4 rounded-xl bg-black/30 border border-white/10 mb-4">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl"
                    style={{ backgroundColor: `${categoryData.color}20`, border: `2px solid ${categoryData.color}` }}
                  >
                    {categoryData.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{categoryData.name || 'Category Name'}</h3>
                    <p className="text-xs text-[var(--muted)]">{categoryData.description || 'Description...'}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name *</label>
                  <input
                    type="text"
                    value={categoryData.name}
                    onChange={(e) => setCategoryData({ ...categoryData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[var(--accent)] focus:outline-none text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Icon (emoji)</label>
                    <input
                      type="text"
                      value={categoryData.icon}
                      onChange={(e) => setCategoryData({ ...categoryData, icon: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[var(--accent)] focus:outline-none text-white text-2xl text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Color</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={categoryData.color}
                        onChange={(e) => setCategoryData({ ...categoryData, color: e.target.value })}
                        className="w-14 h-12 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={categoryData.color}
                        onChange={(e) => setCategoryData({ ...categoryData, color: e.target.value })}
                        className="flex-1 px-3 py-2 rounded bg-white/5 border border-white/10 text-white font-mono text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={categoryData.description}
                    onChange={(e) => setCategoryData({ ...categoryData, description: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[var(--accent)] focus:outline-none text-white"
                  />
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={categoryData.visible} onChange={(e) => setCategoryData({ ...categoryData, visible: e.target.checked })} className="w-4 h-4 accent-[var(--accent)]" />
                  <span>👁️ Visible</span>
                </label>

                <div className="flex gap-3 pt-4 border-t border-white/10">
                  <button onClick={handleSaveCategory} className="flex-1 py-3 bg-[var(--accent)] text-black font-bold rounded-xl hover:shadow-[0_0_40px_rgba(0,229,255,0.4)] transition-all">
                    {editingCategory ? '💾 Update' : '✨ Create'}
                  </button>
                  <button onClick={() => setShowCategoryModal(false)} className="flex-1 py-3 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-all">
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}