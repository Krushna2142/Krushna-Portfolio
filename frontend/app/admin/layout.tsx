'use client'
import Sidebar from '@/components/admin/Sidebar'
import { useEffect } from 'react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // Hide custom cursor on admin pages
  useEffect(() => {
    document.body.style.cursor = 'default'
    return () => {
      document.body.style.cursor = 'auto'
    }
  }, [])

  return (
    <div className="min-h-screen bg-[var(--bg)]" style={{ cursor: 'default' }}>
      {/* Sidebar component here */}
      <Sidebar/>
      <main className="ml-64 p-8">
        {children}
      </main>
    </div>
  )
}