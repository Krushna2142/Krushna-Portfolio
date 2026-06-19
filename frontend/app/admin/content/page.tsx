'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { configApi } from '@/lib/admin'
import ImageUpload from '@/components/admin/ImageUpload'

export default function ContentEditor() {
  const [configs, setConfigs] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    configApi.getAll()
      .then(res => setConfigs(res.data.data || {}))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const handleUpdate = async (key: string, value: any) => {
    setSaving(key)
    try {
      await configApi.update(key, value)
      setConfigs({ ...configs, [key]: value })
      setMessage(`✅ ${key} updated successfully`)
      setTimeout(() => setMessage(''), 2000)
    } catch (err) {
      console.error('Update failed:', err)
      setMessage('❌ Failed to update')
      setTimeout(() => setMessage(''), 2000)
    } finally {
      setSaving(null)
    }
  }

  if (loading) return <div className="text-[var(--accent)] animate-pulse">Loading...</div>

  const sections = [
    {
      title: '👤 Profile Picture',
      fields: [
        { key: 'profile_image', label: 'Profile Image', type: 'image' },
      ],
    },
    {
      title: '🎯 Hero Section',
      fields: [
        { key: 'hero_title', label: 'Main Title', type: 'text' },
        { key: 'hero_subtitle', label: 'Subtitle/Tagline', type: 'text' },
        { key: 'hero_description', label: 'Description', type: 'textarea' },
        { key: 'hero_visible', label: 'Show Hero Section', type: 'toggle' },
      ],
    },
    {
      title: '👥 About Section',
      fields: [
        { key: 'about_title', label: 'Section Title', type: 'text' },
        { key: 'about_bio', label: 'Biography Text', type: 'textarea' },
        { key: 'about_visible', label: 'Show About Section', type: 'toggle' },
        { key: 'about_stat_1_label', label: 'Stat 1 Label', type: 'text' },
        { key: 'about_stat_1_value', label: 'Stat 1 Value', type: 'text' },
        { key: 'about_stat_2_label', label: 'Stat 2 Label', type: 'text' },
        { key: 'about_stat_2_value', label: 'Stat 2 Value', type: 'text' },
      ],
    },
    {
      title: '🔗 Social Links',
      fields: [
        { key: 'social_github', label: 'GitHub URL', type: 'text' },
        { key: 'social_linkedin', label: 'LinkedIn URL', type: 'text' },
        { key: 'social_twitter', label: 'Twitter URL', type: 'text' },
        { key: 'contact_email', label: 'Contact Email', type: 'text' },
        { key: 'resume_url', label: 'Resume/CV URL', type: 'text' },
      ],
    },
    {
      title: '🎨 Theme & SEO',
      fields: [
        { key: 'accent_color', label: 'Accent Color', type: 'color' },
        { key: 'seo_title', label: 'SEO Page Title', type: 'text' },
        { key: 'seo_description', label: 'SEO Description', type: 'textarea' },
      ],
    },
    {
      title: '⚙️ Site Settings',
      fields: [
        { key: 'site_name', label: 'Site Name', type: 'text' },
        { key: 'site_tagline', label: 'Site Tagline', type: 'text' },
        { key: 'maintenance_mode', label: 'Maintenance Mode', type: 'toggle' },
        { key: 'maintenance_message', label: 'Maintenance Message', type: 'text' },
        { key: 'skills_visible', label: 'Show Skills', type: 'toggle' },
        { key: 'projects_visible', label: 'Show Projects', type: 'toggle' },
        { key: 'certifications_visible', label: 'Show Certifications', type: 'toggle' },
        { key: 'contact_visible', label: 'Show Contact', type: 'toggle' },
      ],
    },
  ]

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Content Editor</h1>
      <p className="text-[var(--muted)] mb-8">Edit your website content. Changes sync instantly to the public site.</p>

      {message && (
        <div className={`mb-6 p-4 rounded-xl sticky top-4 z-50 ${message.includes('✅') ? 'bg-green-500/20 border border-green-500/50 text-green-400' : 'bg-red-500/20 border border-red-500/50 text-red-400'}`}>
          {message}
        </div>
      )}

      <div className="space-y-8">
        {sections.map((section, si) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: si * 0.1 }}
            className="p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10"
          >
            <h2 className="text-2xl font-bold mb-6">{section.title}</h2>
            <div className="space-y-4">
              {section.fields.map((field) => {
                const value = configs[field.key]
                const isToggle = field.type === 'toggle'
                const isColor = field.type === 'color'
                const isTextarea = field.type === 'textarea'
                const isImage = field.type === 'image'

                return (
                  <div key={field.key} className="flex flex-col md:flex-row md:items-start gap-4 p-4 rounded-xl bg-black/30">
                    <div className="flex-1">
                      <label className="font-medium block">{field.label}</label>
                      <code className="text-xs text-[var(--muted)]">{field.key}</code>
                    </div>
                    <div className="md:w-1/2">
                      {isImage ? (
                        <ImageUpload
                          value={value || ''}
                          onChange={(url) => handleUpdate(field.key, url)}
                          folder={field.key.includes('profile') ? 'profile' : 'content'}
                        />
                      ) : isToggle ? (
                        <button
                          onClick={() => handleUpdate(field.key, !value)}
                          disabled={saving === field.key}
                          className={`relative w-14 h-7 rounded-full transition-all ${value ? 'bg-[var(--accent)]' : 'bg-white/20'}`}
                        >
                          <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all ${value ? 'left-8' : 'left-1'}`} />
                        </button>
                      ) : isColor ? (
                        <div className="flex gap-2 items-center">
                          <input
                            type="color"
                            value={value || '#00e5ff'}
                            onChange={(e) => handleUpdate(field.key, e.target.value)}
                            className="w-16 h-10 rounded cursor-pointer"
                          />
                          <input
                            type="text"
                            value={value || ''}
                            onChange={(e) => handleUpdate(field.key, e.target.value)}
                            className="flex-1 px-3 py-2 rounded bg-white/5 border border-white/10 text-white font-mono text-sm"
                          />
                        </div>
                      ) : isTextarea ? (
                        <textarea
                          value={value || ''}
                          onChange={(e) => handleUpdate(field.key, e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 rounded bg-white/5 border border-white/10 focus:border-[var(--accent)] focus:outline-none text-white text-sm"
                        />
                      ) : (
                        <input
                          type="text"
                          value={value || ''}
                          onChange={(e) => handleUpdate(field.key, e.target.value)}
                          className="w-full px-3 py-2 rounded bg-white/5 border border-white/10 focus:border-[var(--accent)] focus:outline-none text-white text-sm"
                        />
                      )}
                      {saving === field.key && <span className="text-xs text-[var(--accent)] ml-2">Saving...</span>}
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}