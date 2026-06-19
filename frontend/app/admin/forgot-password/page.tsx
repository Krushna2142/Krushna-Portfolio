'use client'
import { useState } from 'react'
import Link from 'next/link'  // ← Change this line
import { motion } from 'framer-motion'
import { adminAuth } from '@/lib/admin'


export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      await adminAuth.forgotPassword(email)
      setSuccess('If an account exists with that email, a reset token has been sent.')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send reset email')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10"
      >
        <h1 className="text-3xl font-bold mb-2 text-center">
          <span className="text-[var(--accent)]">Forgot</span> Password
        </h1>
        <p className="text-[var(--muted)] text-center mb-8">
          Enter your email to receive a reset token
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-400 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 rounded-lg bg-green-500/20 border border-green-500/50 text-green-400 text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-white/70">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 transition-all text-white"
              placeholder="admin@example.com"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[var(--accent)] text-black font-bold rounded-xl hover:shadow-[0_0_40px_rgba(0,229,255,0.4)] transition-all duration-300 disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send Reset Token'}
          </button>

          <div className="text-center text-sm text-white/60 pt-4 border-t border-white/10 space-y-2">
            <div>
              Remember your password?{' '}
              <Link href="/admin/login" className="text-[var(--accent)] hover:underline font-medium">
                Login
              </Link>
            </div>
            <div>
              Have a reset token?{' '}
              <Link href="/admin/reset-password" className="text-[var(--accent)] hover:underline font-medium">
                Reset Password
              </Link>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  )
}