'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { adminApi } from '@/lib/api'
import toast from 'react-hot-toast'

export default function AdminLogin() {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [loading,  setLoading]  = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (token) router.push('/admin')
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await adminApi.login(email, password)
      localStorage.setItem('admin_token', res.data.data.token)
      toast.success('Access granted')
      router.push('/admin')
    } catch {
      toast.error('Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark-900 cyber-grid flex items-center justify-center p-6">
      <div className="w-full max-w-sm glass-card p-8 space-y-8" style={{ borderColor: 'rgba(0,245,255,0.12)' }}>
        <div className="text-center">
          <div
            className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center
                       font-mono font-bold text-xl neon-text-cyan mb-5"
            style={{ background: 'rgba(0,245,255,0.08)', border: '1px solid rgba(0,245,255,0.2)' }}
          >
            KP
          </div>
          <h1 className="font-display text-2xl font-bold text-white">Admin Access</h1>
          <p className="font-mono text-xs text-white/25 mt-1">Portfolio Control Panel</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="admin email"
            required
            autoComplete="email"
            className="input-field"
          />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="password"
            required
            autoComplete="current-password"
            className="input-field"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-mono text-sm
                       bg-neon-cyan/10 border border-neon-cyan/40 text-neon-cyan
                       hover:bg-neon-cyan/20 hover:shadow-neon-cyan
                       disabled:opacity-40 disabled:cursor-not-allowed
                       transition-all duration-300"
          >
            {loading ? '> Authenticating...' : '> Access System →'}
          </button>
        </form>

        <p className="text-center font-mono text-xs text-white/15">
          Unauthorized access is prohibited
        </p>
      </div>
    </div>
  )
}