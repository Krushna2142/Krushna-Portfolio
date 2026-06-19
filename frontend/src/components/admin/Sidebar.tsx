'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { adminAuth } from '@/lib/admin'
import { useState } from 'react'

const navItems = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: '' },
  { name: 'Projects', href: '/admin/projects', icon: '💼' },
  { name: 'Skills', href: '/admin/skills', icon: '⚡' },
  { name: 'Certifications', href: '/admin/certifications', icon: '🏆' },
  { name: 'Content Editor', href: '/admin/content', icon: '✏️' },
  { name: 'Contacts', href: '/admin/contacts', icon: '✉️' },
  { name: 'Site Config', href: '/admin/config', icon: '⚙️' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = () => {
    adminAuth.logout()
    router.push('/admin/login')
  }

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-[9999] p-3 rounded-xl backdrop-blur-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
      >
        {isOpen ? '✕' : '☰'}
      </button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`fixed top-0 left-0 h-screen w-64 bg-black/80 backdrop-blur-xl border-r border-white/10 flex flex-col z-50 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <h1 className="text-2xl font-bold">
            <span className="text-[var(--accent)]">Krushna</span>
            <span className="text-white/70"> Admin</span>
          </h1>
          <p className="text-xs text-[var(--muted)] mt-1">Portfolio CMS</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'bg-[var(--accent)]/20 text-[var(--accent)] border border-[var(--accent)]/50'
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all duration-300"
          >
            <span className="text-xl">🚪</span>
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </motion.aside>
    </>
  )
}