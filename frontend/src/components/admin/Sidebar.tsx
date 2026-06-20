'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

// Define the props interface
interface SidebarProps {
  onClose?: () => void  // Add this line
}

export default function Sidebar({ onClose }: SidebarProps) {  // Destructure onClose
  const pathname = usePathname()

  const menuItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/admin/projects', label: 'Projects', icon: '💼' },
    { href: '/admin/skills', label: 'Skills', icon: '⚡' },
    { href: '/admin/certifications', label: 'Certifications', icon: '🏆' },
    { href: '/admin/content', label: 'Content Editor', icon: '✏️' },
    { href: '/admin/contacts', label: 'Contacts', icon: '📬' },
    { href: '/admin/config', label: 'Site Config', icon: '⚙️' },
  ]

  const isActive = (href: string) => pathname === href

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              <span className="text-[var(--accent)]">Krushna</span> Admin
            </h1>
            <p className="text-xs text-[var(--muted)] mt-1">Portfolio CMS</p>
          </div>
          {/* Close button for mobile */}
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}  // Close sidebar on navigation (mobile)
            className={`
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all
              ${isActive(item.href)
                ? 'bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20'
                : 'text-white/70 hover:bg-white/5 hover:text-white'
              }
            `}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <Link
          href="/"
          onClick={onClose}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all"
        >
          <span>🚪</span>
          <span className="font-medium">Logout</span>
        </Link>
      </div>
    </div>
  )
}