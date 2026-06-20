'use client'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Sidebar from '@/components/admin/Sidebar'
import CustomCursor from '@/components/efffects/CustomCursor'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Check if current page is an auth page (login, register, forgot-password, reset-password)
  const isAuthPage = ['/admin/login', '/admin/register', '/admin/forgot-password', '/admin/reset-password'].includes(pathname || '')

  useEffect(() => {
    setMounted(true)
    // Hide custom cursor on admin pages
    document.body.style.cursor = 'default'
    return () => {
      document.body.style.cursor = 'auto'
    }
  }, [])

  // Close sidebar on route change (mobile)
  useEffect(() => {
    const handleRouteChange = () => setSidebarOpen(false)
    window.addEventListener('popstate', handleRouteChange)
    return () => window.removeEventListener('popstate', handleRouteChange)
  }, [])

  // Don't show sidebar or custom cursor on auth pages
  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-[var(--bg)]" style={{ cursor: 'default' }}>
        {mounted && <CustomCursor />}
        {children}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--bg)]" style={{ cursor: 'default' }}>
      {mounted && <CustomCursor />}
      
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[var(--bg)]/95 backdrop-blur-xl border-b border-white/10 px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-lg font-bold">
            <span className="text-[var(--accent)]">Krushna</span> Admin
          </h1>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full z-50
        w-64 bg-[var(--bg)] border-r border-white/10
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main Content */}
      <main className="lg:ml-64 pt-14 lg:pt-0 min-h-screen">
        <div className="p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}