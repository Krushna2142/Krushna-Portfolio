'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { certsApi } from '@/lib/admin'

export default function CertificationsAdmin() {
  const [certs, setCerts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingCert, setEditingCert] = useState<any>(null)
  const [formData, setFormData] = useState({
    title: '',
    issuer: '',
    credentialUrl: '',
    visible: true,
    order: 0,
  })

  const fetchCerts = async () => {
    try {
      const res = await certsApi.getAll()
      setCerts(res.data.data)
    } catch (err) {
      console.error('Failed to fetch certifications', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCerts()
  }, [])

  const handleCreate = () => {
    setEditingCert(null)
    setFormData({ title: '', issuer: '', credentialUrl: '', visible: true, order: 0 })
    setShowModal(true)
  }

  const handleEdit = (cert: any) => {
    setEditingCert(cert)
    setFormData({
      title: cert.title,
      issuer: cert.issuer,
      credentialUrl: cert.credential_url || '',
      visible: cert.visible,
      order: cert.order_index || 0,
    })
    setShowModal(true)
  }

  const handleSave = async () => {
    try {
      if (editingCert) {
        await certsApi.update(editingCert.id, formData)
      } else {
        await certsApi.create(formData)
      }
      setShowModal(false)
      fetchCerts()
    } catch (err) {
      console.error('Failed to save certification', err)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this certification?')) return
    try {
      await certsApi.delete(id)
      fetchCerts()
    } catch (err) {
      console.error('Failed to delete certification', err)
    }
  }

  if (loading) return <div className="text-[var(--accent)] animate-pulse">Loading...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">Certifications</h1>
        <button
          onClick={handleCreate}
          className="px-6 py-3 bg-[var(--accent)] text-black font-bold rounded-xl hover:shadow-[0_0_40px_rgba(0,229,255,0.4)] transition-all"
        >
          + New Certification
        </button>
      </div>

      <div className="space-y-4">
        {certs.map((cert, i) => (
          <motion.div
            key={cert.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 flex items-center justify-between"
          >
            <div>
              <h3 className="text-xl font-bold">{cert.title}</h3>
              <p className="text-[var(--muted)]">{cert.issuer}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(cert)} className="px-4 py-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30">Edit</button>
              <button onClick={() => handleDelete(cert.id)} className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30">Delete</button>
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
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md p-8 rounded-2xl backdrop-blur-xl bg-[var(--bg)] border border-white/10"
            >
              <h2 className="text-2xl font-bold mb-6">{editingCert ? 'Edit' : 'New'} Certification</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[var(--accent)] focus:outline-none text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Issuer</label>
                  <input
                    type="text"
                    value={formData.issuer}
                    onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[var(--accent)] focus:outline-none text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Credential URL</label>
                  <input
                    type="text"
                    value={formData.credentialUrl}
                    onChange={(e) => setFormData({ ...formData, credentialUrl: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[var(--accent)] focus:outline-none text-white"
                  />
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.visible}
                    onChange={(e) => setFormData({ ...formData, visible: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span>Visible</span>
                </label>

                <div className="flex gap-3 pt-4">
                  <button onClick={handleSave} className="flex-1 py-3 bg-[var(--accent)] text-black font-bold rounded-xl hover:shadow-[0_0_40px_rgba(0,229,255,0.4)] transition-all">
                    {editingCert ? 'Update' : 'Create'}
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
    </div>
  )
}