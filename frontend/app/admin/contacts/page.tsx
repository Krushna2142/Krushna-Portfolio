'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { contactsApi } from '@/lib/admin'

export default function ContactsAdmin() {
  const [contacts, setContacts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchContacts = async () => {
    try {
      const res = await contactsApi.getAll()
      setContacts(res.data.data)
    } catch (err) {
      console.error('Failed to fetch contacts', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchContacts()
  }, [])

  const handleMarkRead = async (id: string) => {
    try {
      await contactsApi.markRead(id)
      fetchContacts()
    } catch (err) {
      console.error('Failed to mark as read', err)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this message?')) return
    try {
      await contactsApi.delete(id)
      fetchContacts()
    } catch (err) {
      console.error('Failed to delete contact', err)
    }
  }

  if (loading) return <div className="text-[var(--accent)] animate-pulse">Loading...</div>

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Contact Messages</h1>

      <div className="space-y-4">
        {contacts.map((contact, i) => (
          <motion.div
            key={contact.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`p-6 rounded-2xl backdrop-blur-xl border ${
              contact.is_read ? 'bg-white/5 border-white/10' : 'bg-[var(--accent)]/5 border-[var(--accent)]/30'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold">{contact.name}</h3>
                <p className="text-[var(--muted)] text-sm">{contact.email}</p>
              </div>
              <div className="flex gap-2">
                {!contact.is_read && (
                  <button
                    onClick={() => handleMarkRead(contact.id)}
                    className="px-3 py-1 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 text-sm"
                  >
                    Mark Read
                  </button>
                )}
                <button
                  onClick={() => handleDelete(contact.id)}
                  className="px-3 py-1 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
            <h4 className="font-bold mb-2">{contact.subject}</h4>
            <p className="text-[var(--muted)] whitespace-pre-wrap">{contact.message}</p>
            <div className="text-xs text-[var(--muted)] mt-4">
              {new Date(contact.created_at).toLocaleString()}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}