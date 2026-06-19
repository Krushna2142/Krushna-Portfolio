'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { projectsApi } from '@/lib/admin'
import ImageUpload from '@/components/admin/ImageUpload'

export default function ProjectsAdmin() {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingProject, setEditingProject] = useState<any>(null)
  const [message, setMessage] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    longDescription: '',
    techStack: [] as string[],
    category: 'AI',
    thumbnail: '',
    images: [] as string[],
    liveUrl: '',
    githubUrl: '',
    featured: false,
    visible: true,
    order: 0,
  })

  const fetchProjects = async () => {
    try {
      const res = await projectsApi.getAll()
      setProjects(res.data.data || [])
    } catch (err) {
      console.error('Failed to fetch projects', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchProjects() }, [])

  const handleCreate = () => {
    setEditingProject(null)
    setFormData({
      title: '', description: '', longDescription: '',
      techStack: [], category: 'AI', thumbnail: '',
      images: [], liveUrl: '', githubUrl: '', featured: false, visible: true, order: 0,
    })
    setShowModal(true)
  }

  const handleEdit = (project: any) => {
    setEditingProject(project)
    setFormData({
      title: project.title,
      description: project.description,
      longDescription: project.longDescription || '',
      techStack: project.techStack || [],
      category: project.category || 'AI',
      thumbnail: project.thumbnail || '',
      images: project.images || [],
      liveUrl: project.liveUrl || '',
      githubUrl: project.githubUrl || '',
      featured: project.featured || false,
      visible: project.visible !== false,
      order: project.order || 0,
    })
    setShowModal(true)
  }

  const handleSave = async () => {
    try {
      if (editingProject) {
        await projectsApi.update(editingProject.id, formData)
        setMessage('✅ Project updated successfully')
      } else {
        await projectsApi.create(formData)
        setMessage('✅ Project created successfully')
      }
      setShowModal(false)
      fetchProjects()
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      console.error('Failed to save project', err)
      setMessage('❌ Failed to save project')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project?')) return
    try {
      await projectsApi.delete(id)
      setMessage('✅ Project deleted')
      fetchProjects()
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      console.error('Failed to delete', err)
    }
  }

  const toggleFeatured = async (project: any) => {
    try {
      await projectsApi.update(project.id, { ...project, featured: !project.featured })
      fetchProjects()
    } catch (err) {
      console.error('Failed to toggle featured', err)
    }
  }

  const toggleVisible = async (project: any) => {
    try {
      await projectsApi.update(project.id, { ...project, visible: !project.visible })
      fetchProjects()
    } catch (err) {
      console.error('Failed to toggle visibility', err)
    }
  }

  const moveProject = async (project: any, direction: 'up' | 'down') => {
    const idx = projects.findIndex(p => p.id === project.id)
    const newIdx = direction === 'up' ? idx - 1 : idx + 1
    if (newIdx < 0 || newIdx >= projects.length) return
    
    const newProjects = [...projects]
    const temp = newProjects[idx].order
    newProjects[idx].order = newProjects[newIdx].order
    newProjects[newIdx].order = temp
    
    try {
      await Promise.all([
        projectsApi.update(newProjects[idx].id, { order: newProjects[idx].order }),
        projectsApi.update(newProjects[newIdx].id, { order: newProjects[newIdx].order }),
      ])
      fetchProjects()
    } catch (err) {
      console.error('Failed to reorder', err)
    }
  }

  const addImage = (url: string) => {
    if (url && !formData.images.includes(url)) {
      setFormData({ ...formData, images: [...formData.images, url] })
    }
  }

  const removeImage = (index: number) => {
    setFormData({ ...formData, images: formData.images.filter((_, i) => i !== index) })
  }

  const moveImage = (index: number, direction: 'left' | 'right') => {
    const newImages = [...formData.images]
    const newIndex = direction === 'left' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= newImages.length) return
    
    ;[newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]]
    setFormData({ ...formData, images: newImages })
  }

  if (loading) return <div className="text-[var(--accent)] animate-pulse">Loading...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">Projects ({projects.length})</h1>
        <button
          onClick={handleCreate}
          className="px-6 py-3 bg-[var(--accent)] text-black font-bold rounded-xl hover:shadow-[0_0_40px_rgba(0,229,255,0.4)] transition-all"
        >
          + New Project
        </button>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-xl ${message.includes('✅') ? 'bg-green-500/20 border border-green-500/50 text-green-400' : 'bg-red-500/20 border border-red-500/50 text-red-400'}`}>
          {message}
        </div>
      )}

      <div className="space-y-4">
        {projects.map((project, i) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <h3 className="text-xl font-bold">{project.title}</h3>
                  {project.featured && (
                    <span className="px-2 py-1 rounded bg-[var(--accent)]/20 text-[var(--accent)] text-xs">⭐ Featured</span>
                  )}
                  <span className="px-2 py-1 rounded bg-white/10 text-white/60 text-xs">{project.category}</span>
                  {!project.visible && (
                    <span className="px-2 py-1 rounded bg-red-500/20 text-red-400 text-xs">Hidden</span>
                  )}
                  <span className="px-2 py-1 rounded bg-blue-500/20 text-blue-400 text-xs">
                    {(project.images || []).length} images
                  </span>
                </div>
                <p className="text-[var(--muted)] text-sm line-clamp-2">{project.description}</p>
                <div className="flex gap-2 mt-3 flex-wrap">
                  {(project.techStack || []).slice(0, 6).map((tech: string) => (
                    <span key={tech} className="px-2 py-1 rounded bg-white/5 text-xs text-[var(--muted)]">{tech}</span>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <button onClick={() => moveProject(project, 'up')} className="px-3 py-1 rounded bg-white/5 text-white/60 hover:bg-white/10 text-sm" title="Move up">↑</button>
                  <button onClick={() => moveProject(project, 'down')} className="px-3 py-1 rounded bg-white/5 text-white/60 hover:bg-white/10 text-sm" title="Move down">↓</button>
                </div>
                <button onClick={() => toggleFeatured(project)} className={`px-3 py-1 rounded text-xs ${project.featured ? 'bg-[var(--accent)]/20 text-[var(--accent)]' : 'bg-white/5 text-white/60'}`}>
                  {project.featured ? '⭐ Featured' : '☆ Feature'}
                </button>
                <button onClick={() => toggleVisible(project)} className={`px-3 py-1 rounded text-xs ${project.visible ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {project.visible ? '👁️ Visible' : '🚫 Hidden'}
                </button>
                <button onClick={() => handleEdit(project)} className="px-4 py-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 text-sm">Edit</button>
                <button onClick={() => handleDelete(project.id)} className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 text-sm">Delete</button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

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
              className="w-full max-w-4xl my-8 p-8 rounded-2xl backdrop-blur-xl bg-[#0a0a0a] border border-white/10 max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-2xl font-bold mb-6">{editingProject ? 'Edit Project' : 'New Project'}</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[var(--accent)] focus:outline-none text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Short Description *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[var(--accent)] focus:outline-none text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Long Description (for detail page)</label>
                  <textarea
                    value={formData.longDescription}
                    onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[var(--accent)] focus:outline-none text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#111] border border-white/10 focus:border-[var(--accent)] focus:outline-none text-white"
                    >
                      <option value="AI">AI</option>
                      <option value="Web">Web</option>
                      <option value="Mobile">Mobile</option>
                      <option value="Backend">Backend</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Order (lower = first)</label>
                    <input
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[var(--accent)] focus:outline-none text-white"
                    />
                  </div>
                </div>

                {/* Thumbnail Upload */}
                <div>
                  <label className="block text-sm font-medium mb-2">Thumbnail (Main Image)</label>
                  <ImageUpload
                    value={formData.thumbnail}
                    onChange={(url) => setFormData({ ...formData, thumbnail: url })}
                    folder="projects/thumbnails"
                  />
                </div>

                {/* Additional Images */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Additional Images ({formData.images.length})
                  </label>
                  <p className="text-xs text-[var(--muted)] mb-3">
                    These images will scroll horizontally on the project detail page (Amazon-style)
                  </p>
                  
                  {/* Image Gallery Preview */}
                  {formData.images.length > 0 && (
                    <div className="grid grid-cols-4 gap-3 mb-4">
                      {formData.images.map((img, idx) => (
                        <div key={idx} className="relative group rounded-lg overflow-hidden border border-white/10">
                          <img src={img} alt={`Image ${idx + 1}`} className="w-full h-24 object-cover" />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                            <button
                              onClick={() => moveImage(idx, 'left')}
                              disabled={idx === 0}
                              className="p-1 rounded bg-white/20 hover:bg-white/40 disabled:opacity-30"
                            >←</button>
                            <button
                              onClick={() => removeImage(idx)}
                              className="p-1 rounded bg-red-500/80 hover:bg-red-500"
                            >✕</button>
                            <button
                              onClick={() => moveImage(idx, 'right')}
                              disabled={idx === formData.images.length - 1}
                              className="p-1 rounded bg-white/20 hover:bg-white/40 disabled:opacity-30"
                            >→</button>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-xs text-center py-1">
                            {idx + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <ImageUpload
                    value=""
                    onChange={addImage}
                    folder="projects/images"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Live URL</label>
                    <input
                      type="text"
                      value={formData.liveUrl}
                      onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[var(--accent)] focus:outline-none text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">GitHub URL</label>
                    <input
                      type="text"
                      value={formData.githubUrl}
                      onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[var(--accent)] focus:outline-none text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Tech Stack</label>
                  {formData.techStack.map((tech, i) => (
                    <div key={i} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={tech}
                        onChange={(e) => {
                          const newTech = [...formData.techStack]
                          newTech[i] = e.target.value
                          setFormData({ ...formData, techStack: newTech })
                        }}
                        className="flex-1 px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-[var(--accent)] focus:outline-none text-white"
                      />
                      <button
                        onClick={() => setFormData({ ...formData, techStack: formData.techStack.filter((_, idx) => idx !== i) })}
                        className="px-3 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30"
                      >✕</button>
                    </div>
                  ))}
                  <button
                    onClick={() => setFormData({ ...formData, techStack: [...formData.techStack, ''] })}
                    className="px-4 py-2 rounded-lg bg-[var(--accent)]/20 text-[var(--accent)] hover:bg-[var(--accent)]/30 text-sm"
                  >+ Add Technology</button>
                </div>

                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="w-4 h-4 accent-[var(--accent)]"
                    />
                    <span>⭐ Featured Project</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.visible}
                      onChange={(e) => setFormData({ ...formData, visible: e.target.checked })}
                      className="w-4 h-4 accent-[var(--accent)]"
                    />
                    <span>👁️ Visible on website</span>
                  </label>
                </div>

                <div className="flex gap-3 pt-4 border-t border-white/10">
                  <button
                    onClick={handleSave}
                    className="flex-1 py-3 bg-[var(--accent)] text-black font-bold rounded-xl hover:shadow-[0_0_40px_rgba(0,229,255,0.4)] transition-all"
                  >
                    {editingProject ? '💾 Update Project' : '✨ Create Project'}
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-3 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-all"
                  >Cancel</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}