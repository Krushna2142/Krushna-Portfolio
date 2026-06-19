'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { adminAuth } from '@/lib/admin'

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  // Skip auth check on login page
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('admin_token')
      if (!token) {
        router.push('/admin/login')
        return
      }

      try {
        await adminAuth.verify()
        setIsAuthenticated(true)
      } catch {
        localStorage.removeItem('admin_token')
        router.push('/admin/login')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router, pathname])

  // Always show login page
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
        <div className="text-[var(--accent)] text-xl animate-pulse">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) return null

  return <>{children}</>
}