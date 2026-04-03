'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { adminApi } from '@/lib/api'
import toast from 'react-hot-toast'
import type { Project, Skill, Certification, ContactMessage, AnalyticsDashboard } from '@/types'
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, BarChart, Bar,
} from 'recharts'

type Tab = 'dashboard' | 'projects' | 'skills' | 'certs' | 'messages' | 'config'

export default function AdminPanel() {
  const router = useRouter()
  const [tab,       setTab]       = useState<Tab>('dashboard')
  const [analytics, setAnalytics] = useState<AnalyticsDashboard | null>(null)
  const [projects,  setProjects]  = useState<Project[]>([])
  const [skills,    setSkills]    = useState<Skill[]>([])
  const [certs,     setCerts]     = useState<Certification[]>([])
  const [messages,  setMessages]  = useState<ContactMessage[]>([])
  const [config,    setConfig]    = useState<Record<string, any>>({})
  const [loading,   setLoading]   = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) { router.push('/admin/login'); return }
    fetchAll()
  }, [])

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [a, p, s, c, m, cfg] = await Promise.all([
        adminApi.getAnalytics(),
        adminApi.getProjects(),
        adminApi.getSkills(),
        adminApi.getCerts(),
        adminApi.getMessages(),
        adminApi.getConfig(),
      ])
      setAnalytics(a.data.data)
      setProjects(p.data.data)
      setSkills(s.data.data)
      setCerts(c.data.data)
      setMessages(m.data.data)
      setConfig(cfg.data.data)
    } catch {
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('admin_token')
    router.push('/admin/login')
  }

  const toggleVisible = async (type: string, id: string, current: boolean) => {
    try {
      if (type === 'projects') await adminApi.updateProject(id, { visible: !current })
      if (type === 'skills')   await adminApi.updateSkill(id, { visible: !current })
      if (type === 'certs')    await adminApi.updateCert(id, { visible: !current })
      toast.success('Updated')
      fetchAll()
    } catch { toast.error('Failed') }
  }

  const deleteItem = async (type: string, id: string) => {
    if (!confirm('Delete this item? This cannot be undone.')) return
    try {
      if (type === 'projects') await adminApi.deleteProject(id)
      if (type === 'skills')   await adminApi.deleteSkill(id)
      if (type === 'certs')    await adminApi.deleteCert(id)
      if (type === 'messages') await adminApi.deleteMsg(id)
      toast.success('Deleted')
      fetchAll()
    } catch { toast.error('Delete failed') }
  }

  const markRead = async (id: string) => {
    try { await adminApi.markRead(id); fetchAll() } catch {}
  }

  const toggleConfig = async (key: string, current: boolean) => {
    try {
      await adminApi.updateConfig(key, !current)
      setConfig(prev => ({ ...prev, [key]: !current }))
      toast.success('Config updated')
    } catch { toast.error('Failed') }
  }

  const TABS: { id: Tab; label: string; badge?: number }[] = [
    { id: 'dashboard', label: '📊 Dashboard' },
    { id: 'projects',  label: '🚀 Projects',  badge: projects.length },
    { id: 'skills',    label: '⚡ Skills',    badge: skills.length   },
    { id: 'certs',     label: '🎓 Certs',     badge: certs.length    },
    { id: 'messages',  label: '📬 Messages',  badge: messages.filter(m => !m.isRead).length },
    { id: 'config',    label: '⚙️ Config'     },
  ]

  const TOOLTIP_STYLE = {
    contentStyle: {
      background: '#060d14',
      border: '1px solid rgba(0,245,255,0.15)',
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: 11,
      borderRadius: 8,
    },
    labelStyle: { color: '#00f5ff' },
  }

  if (loading) return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center">
      <p className="font-mono text-xs text-neon-cyan animate-pulse">// Loading admin panel...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-dark-900 text-white">

      {/* Topbar */}
      <div className="sticky top-0 z-50 bg-dark-900/90 backdrop-blur-xl border-b border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm neon-text-cyan font-bold">&lt;KP/&gt;</span>
            <span className="font-mono text-xs text-white/20">Admin Panel</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="/" target="_blank"
               className="font-mono text-xs text-white/30 hover:text-white transition-colors">
              View Site ↗
            </a>
            <button
              onClick={logout}
              className="font-mono text-xs px-3 py-1.5 rounded-lg
                         border border-neon-pink/25 text-neon-pink/50
                         hover:text-neon-pink hover:border-neon-pink/50 transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-xs transition-all duration-300 ${
                tab === t.id
                  ? 'bg-neon-cyan/10 border border-neon-cyan/35 text-neon-cyan'
                  : 'border border-white/[0.07] text-white/35 hover:text-white/60 hover:border-white/15'
              }`}
            >
              {t.label}
              {!!t.badge && t.badge > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                  tab === t.id ? 'bg-neon-cyan/20 text-neon-cyan' : 'bg-white/10 text-white/30'
                }`}>
                  {t.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Dashboard ── */}
        {tab === 'dashboard' && analytics && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Visits',  value: analytics.totalVisits,              color: '#00f5ff' },
                { label: 'Today',         value: analytics.todayVisits,              color: '#bf00ff' },
                { label: 'Desktop Users', value: analytics.deviceBreakdown.desktop,  color: '#00ff88' },
                { label: 'Mobile Users',  value: analytics.deviceBreakdown.mobile,   color: '#ff0080' },
              ].map(({ label, value, color }) => (
                <div key={label} className="glass-card p-5" style={{ borderColor: `${color}18` }}>
                  <p className="font-display text-3xl font-bold mb-1" style={{ color }}>{value}</p>
                  <p className="font-mono text-xs text-white/35">{label}</p>
                </div>
              ))}
            </div>

            {analytics.visitsByDay.length > 0 && (
              <div className="glass-card p-6">
                <p className="font-mono text-xs text-white/30 mb-5">// Visits — Last 30 days</p>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={analytics.visitsByDay}>
                    <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
                    <YAxis tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
                    <Tooltip {...TOOLTIP_STYLE} />
                    <Line type="monotone" dataKey="count" stroke="#00f5ff" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              {/* Top pages */}
              <div className="glass-card p-6">
                <p className="font-mono text-xs text-white/30 mb-4">// Top Pages</p>
                {analytics.topPages.length === 0 ? (
                  <p className="font-mono text-xs text-white/20">No data yet</p>
                ) : (
                  <div className="space-y-3">
                    {analytics.topPages.map(({ page, count }) => (
                      <div key={page} className="flex justify-between items-center">
                        <span className="font-mono text-xs text-white/50 truncate">{page}</span>
                        <span className="font-mono text-xs text-neon-cyan ml-4 shrink-0">{count}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Device breakdown */}
              <div className="glass-card p-6">
                <p className="font-mono text-xs text-white/30 mb-4">// Device Breakdown</p>
                <ResponsiveContainer width="100%" height={150}>
                  <BarChart data={[
                    { name: 'Desktop', count: analytics.deviceBreakdown.desktop },
                    { name: 'Mobile',  count: analytics.deviceBreakdown.mobile  },
                    { name: 'Tablet',  count: analytics.deviceBreakdown.tablet  },
                  ]}>
                    <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
                    <YAxis tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
                    <Tooltip {...TOOLTIP_STYLE} />
                    <Bar dataKey="count" fill="#bf00ff" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* ── Projects ── */}
        {tab === 'projects' && (
          <div className="space-y-3">
            {projects.map(p => (
              <div key={p._id} className="glass-card p-5 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-display font-semibold text-white truncate">{p.title}</p>
                  <p className="font-mono text-xs text-white/35 mt-0.5">
                    {p.category} · {p.techStack.slice(0,3).join(', ')}
                    {p.featured && ' · ★ Featured'}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => toggleVisible('projects', p._id, p.visible)}
                    className={`font-mono text-xs px-3 py-1.5 rounded-lg border transition-all ${
                      p.visible
                        ? 'border-neon-green/35 text-neon-green bg-neon-green/10'
                        : 'border-white/15 text-white/30'
                    }`}
                  >
                    {p.visible ? 'Visible' : 'Hidden'}
                  </button>
                  <button
                    onClick={() => deleteItem('projects', p._id)}
                    className="font-mono text-xs px-3 py-1.5 rounded-lg
                               border border-neon-pink/25 text-neon-pink/50
                               hover:text-neon-pink hover:border-neon-pink/50 transition-all"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Skills ── */}
        {tab === 'skills' && (
          <div className="space-y-2">
            {skills.map(s => (
              <div key={s._id} className="glass-card p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <span className="font-mono text-sm text-white/80 truncate">{s.name}</span>
                  <span className="font-mono text-xs text-white/25 shrink-0">{s.category}</span>
                  <span className="font-mono text-xs text-neon-cyan shrink-0">{s.proficiency}%</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => toggleVisible('skills', s._id, s.visible)}
                    className={`font-mono text-xs px-3 py-1.5 rounded-lg border transition-all ${
                      s.visible
                        ? 'border-neon-green/35 text-neon-green bg-neon-green/10'
                        : 'border-white/15 text-white/30'
                    }`}
                  >
                    {s.visible ? 'On' : 'Off'}
                  </button>
                  <button
                    onClick={() => deleteItem('skills', s._id)}
                    className="font-mono text-xs px-2 py-1.5 rounded-lg
                               border border-neon-pink/25 text-neon-pink/50
                               hover:text-neon-pink transition-all"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Certs ── */}
        {tab === 'certs' && (
          <div className="space-y-3">
            {certs.map(c => (
              <div key={c._id} className="glass-card p-5 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-display font-semibold text-white truncate">{c.title}</p>
                  <p className="font-mono text-xs text-white/35 mt-0.5">{c.issuer}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => toggleVisible('certs', c._id, c.visible)}
                    className={`font-mono text-xs px-3 py-1.5 rounded-lg border transition-all ${
                      c.visible
                        ? 'border-neon-green/35 text-neon-green bg-neon-green/10'
                        : 'border-white/15 text-white/30'
                    }`}
                  >
                    {c.visible ? 'Visible' : 'Hidden'}
                  </button>
                  <button
                    onClick={() => deleteItem('certs', c._id)}
                    className="font-mono text-xs px-3 py-1.5 rounded-lg
                               border border-neon-pink/25 text-neon-pink/50
                               hover:text-neon-pink transition-all"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Messages ── */}
        {tab === 'messages' && (
          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="glass-card p-12 text-center">
                <p className="font-mono text-sm text-white/25">// No messages yet</p>
              </div>
            )}
            {messages.map(m => (
              <div
                key={m._id}
                className={`glass-card p-6 space-y-3 ${!m.isRead ? 'border-neon-cyan/20' : ''}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-display font-semibold text-white">{m.name}</p>
                      {!m.isRead && (
                        <span className="font-mono text-xs px-2 py-0.5 rounded-full
                                         bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan">
                          New
                        </span>
                      )}
                    </div>
                    <p className="font-mono text-xs text-neon-cyan/70">{m.email}</p>
                    <p className="font-mono text-xs text-white/25 mt-0.5">
                      {new Date(m.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {!m.isRead && (
                      <button
                        onClick={() => markRead(m._id)}
                        className="font-mono text-xs px-3 py-1.5 rounded-lg
                                   border border-neon-cyan/25 text-neon-cyan/50
                                   hover:text-neon-cyan hover:border-neon-cyan/50 transition-all"
                      >
                        Mark Read
                      </button>
                    )}
                    <button
                      onClick={() => deleteItem('messages', m._id)}
                      className="font-mono text-xs px-3 py-1.5 rounded-lg
                                 border border-neon-pink/25 text-neon-pink/50
                                 hover:text-neon-pink transition-all"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <p className="font-mono text-xs text-neon-purple/80">{m.subject}</p>
                <p className="text-white/55 text-sm leading-relaxed">{m.message}</p>
              </div>
            ))}
          </div>
        )}

        {/* ── Config ── */}
        {tab === 'config' && (
          <div className="space-y-3 max-w-2xl">
            <p className="font-mono text-xs text-white/25 mb-6">
              // Toggle sections visible/hidden on the public portfolio in real-time
            </p>
            {Object.entries(config)
              .filter(([key]) => key.endsWith('_visible'))
              .map(([key, value]) => {
                const label = key.replace('_visible', '').replace(/_/g, ' ').toUpperCase()
                return (
                  <div key={key} className="glass-card p-5 flex items-center justify-between">
                    <div>
                      <p className="font-mono text-sm text-white/80">{label}</p>
                      <p className="font-mono text-xs text-white/25 mt-0.5">{key}</p>
                    </div>
                    <button
                      onClick={() => toggleConfig(key, value as boolean)}
                      className={`relative w-14 h-7 rounded-full transition-all duration-300 border ${
                        value
                          ? 'bg-neon-cyan/15 border-neon-cyan/35'
                          : 'bg-white/[0.04] border-white/10'
                      }`}
                    >
                      <span
                        className={`absolute top-1 w-5 h-5 rounded-full transition-all duration-300 ${
                          value ? 'left-[30px] bg-neon-cyan shadow-neon-cyan' : 'left-1 bg-white/25'
                        }`}
                      />
                    </button>
                  </div>
                )
              })}
          </div>
        )}
      </div>
    </div>
  )
}