'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { configApi } from '@/lib/admin'

export default function ConfigAdmin() {
  const [configs, setConfigs] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [message, setMessage] = useState('')

  const fetchConfigs = async () => {
    try {
      const res = await configApi.getAll()
      setConfigs(res.data.data || {})
    } catch (err) {
      console.error('Failed to fetch configs', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchConfigs()
  }, [])

  const handleUpdate = async (key: string, value: any) => {
    setSaving(key)
    setMessage('')
    try {
      await configApi.update(key, value)
      setConfigs({ ...configs, [key]: value })
      setMessage(`✅ ${key} updated successfully`)
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      console.error('Failed to update config', err)
      setMessage('❌ Failed to update')
      setTimeout(() => setMessage(''), 3000)
    } finally {
      setSaving(null)
    }
  }

  if (loading) return <div className="text-[var(--accent)] animate-pulse">Loading...</div>

  const configItems = [
    { key: 'site_name', label: 'Site Name', type: 'text' },
    { key: 'site_tagline', label: 'Tagline', type: 'text' },
    { key: 'hero_visible', label: 'Show Hero Section', type: 'toggle' },
    { key: 'about_visible', label: 'Show About Section', type: 'toggle' },
    { key: 'skills_visible', label: 'Show Skills Section', type: 'toggle' },
    { key: 'projects_visible', label: 'Show Projects Section', type: 'toggle' },
    { key: 'certifications_visible', label: 'Show Certifications', type: 'toggle' },
    { key: 'contact_visible', label: 'Show Contact Section', type: 'toggle' },
    { key: 'maintenance_mode', label: 'Maintenance Mode', type: 'toggle' },
  ]

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Site Configuration</h1>

      {message && (
        <div className={`mb-6 p-4 rounded-xl ${message.includes('✅') ? 'bg-green-500/20 border border-green-500/50 text-green-400' : 'bg-red-500/20 border border-red-500/50 text-red-400'}`}>
          {message}
        </div>
      )}

      <div className="space-y-4">
        {configItems.map((item, i) => {
          const currentValue = configs[item.key];
          const isToggle = item.type === 'toggle';
          const displayValue = isToggle ? (currentValue ? 'ON' : 'OFF') : (currentValue || '');

          return (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex-1">
                <h3 className="font-bold text-lg">{item.label}</h3>
                <p className="text-xs text-[var(--muted)] mt-1">
                  Key: <code className="bg-black/30 px-2 py-0.5 rounded">{item.key}</code>
                  {isToggle && <span className="ml-2 text-[var(--accent)]">• {displayValue}</span>}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {isToggle ? (
                  <button
                    onClick={() => handleUpdate(item.key, !currentValue)}
                    disabled={saving === item.key}
                    className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
                      currentValue ? 'bg-[var(--accent)]' : 'bg-white/20'
                    }`}
                  >
                    <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all duration-300 ${
                      currentValue ? 'left-8' : 'left-1'
                    }`} />
                  </button>
                ) : (
                  <input
                    type="text"
                    value={currentValue || ''}
                    onChange={(e) => handleUpdate(item.key, e.target.value)}
                    disabled={saving === item.key}
                    className="px-4 py-2 rounded-lg bg-black/30 border border-white/10 focus:border-[var(--accent)] focus:outline-none text-white w-64"
                  />
                )}
                {saving === item.key && (
                  <span className="text-[var(--accent)] text-sm animate-pulse">Saving...</span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  )
}