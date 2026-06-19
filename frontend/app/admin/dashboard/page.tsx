'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { analyticsApi, contactsApi, adminAuth } from '@/lib/admin'

export default function Dashboard() {
  const router = useRouter()
  const [analytics, setAnalytics] = useState<any>(null)
  const [unreadContacts, setUnreadContacts] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    // Check auth
    const checkAuth = async () => {
      const token = localStorage.getItem('admin_token')
      if (!token) {
        router.push('/admin/login')
        return
      }
      
      try {
        await adminAuth.verify()
      } catch {
        localStorage.removeItem('admin_token')
        router.push('/admin/login')
      }
    }
    
    checkAuth()
  }, [router])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analyticsRes, contactsRes] = await Promise.all([
          analyticsApi.getDashboard().catch(() => ({ data: { data: null } })),
          contactsApi.getAll().catch(() => ({ data: { data: [] } })),
        ])
        
        setAnalytics(analyticsRes.data.data)
        setUnreadContacts((contactsRes.data.data || []).filter((c: any) => !c.isRead).length)
      } catch (err) {
        console.error('Failed to fetch dashboard data', err)
        setError('Failed to load dashboard data. Make sure backend is running.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return <div className="text-[var(--accent)] animate-pulse">Loading dashboard...</div>
  }

  if (error) {
    return (
      <div className="p-6 rounded-2xl bg-red-500/20 border border-red-500/50 text-red-400">
        {error}
        <div className="mt-4 text-sm">
          Make sure your backend is running at <code className="bg-black/30 px-2 py-1 rounded">http://localhost:5000</code>
        </div>
      </div>
    )
  }

  const stats = [
    { label: 'Total Visits', value: analytics?.totalVisits || 0, icon: '👁️', color: 'from-cyan-500/20 to-blue-500/20' },
    { label: 'Today', value: analytics?.todayVisits || 0, icon: '📅', color: 'from-purple-500/20 to-pink-500/20' },
    { label: 'Unread Messages', value: unreadContacts, icon: '✉️', color: 'from-green-500/20 to-emerald-500/20' },
    { label: 'Desktop', value: analytics?.deviceBreakdown?.desktop || 0, icon: '💻', color: 'from-yellow-500/20 to-orange-500/20' },
  ]

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`p-6 rounded-2xl backdrop-blur-xl bg-gradient-to-br ${stat.color} border border-white/10`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl">{stat.icon}</span>
            </div>
            <div className="text-3xl font-bold mb-1">{stat.value}</div>
            <div className="text-sm text-white/60">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Device Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10">
          <h2 className="text-2xl font-bold mb-6">Device Breakdown</h2>
          {analytics?.deviceBreakdown ? (
            <div className="space-y-4">
              {Object.entries(analytics.deviceBreakdown).map(([device, count]: [string, any]) => (
                <div key={device}>
                  <div className="flex justify-between mb-2">
                    <span className="capitalize">{device}</span>
                    <span className="text-[var(--accent)]">{count}</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[var(--accent)] rounded-full transition-all duration-500"
                      style={{ width: `${((count / analytics?.totalVisits) * 100) || 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[var(--muted)]">No analytics data available</p>
          )}
        </div>

        {/* Top Pages */}
        <div className="p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10">
          <h2 className="text-2xl font-bold mb-6">Top Pages</h2>
          {analytics?.topPages && analytics.topPages.length > 0 ? (
            <div className="space-y-3">
              {analytics.topPages.map((page: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                  <span className="text-white/70">{page.page}</span>
                  <span className="text-[var(--accent)] font-bold">{page.count}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[var(--muted)]">No page analytics available</p>
          )}
        </div>
      </div>
    </div>
  )
}