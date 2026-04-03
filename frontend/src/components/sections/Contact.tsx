'use client'
import { useState, useRef, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { portfolioApi } from '@/lib/api'

interface FormData {
  name: string
  email: string
  subject: string
  message: string
}

const INFO_ITEMS = [
  { label: 'Email',    value: 'krushnapokharkar4@gmail.com', color: '#00f5ff', icon: '◉' },
  { label: 'Phone',    value: '+91 7410796292',              color: '#bf00ff', icon: '◆' },
  { label: 'Location', value: 'Pune, Maharashtra 🇮🇳',        color: '#00ff88', icon: '◈' },
  { label: 'College',  value: 'AISSMS Polytechnic \'26',     color: '#ff0080', icon: '◇' },
]

const SOCIALS = [
  { label: 'LinkedIn',  href: 'https://www.linkedin.com/in/krushnapokharkar2142', icon: 'in',  color: '#00f5ff' },
  { label: 'Email',     href: 'mailto:krushnapokharkar4@gmail.com',               icon: '@',   color: '#bf00ff' },
  { label: 'Portfolio', href: 'https://krishna-portfolio-peachone.vercel.app',    icon: '⬡',   color: '#00ff88' },
]

// ── Tilt wrapper for info cards ────────────────────────────────
function TiltInfoCard({
  color,
  children,
}: {
  color: string
  children: React.ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 12
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * -12
    el.style.transform = `perspective(700px) rotateY(${x}deg) rotateX(${y}deg) translateZ(6px)`
  }, [])

  const onMouseLeave = useCallback(() => {
    if (ref.current) {
      ref.current.style.transform = 'perspective(700px) rotateY(0deg) rotateX(0deg) translateZ(0)'
    }
  }, [])

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="glass-card p-4 flex items-center gap-4 cursor-default"
      style={{
        borderColor: `${color}12`,
        transition: 'transform 0.12s ease',
        transformStyle: 'preserve-3d',
      }}
    >
      {children}
    </div>
  )
}

export default function Contact() {
  const [sending, setSending] = useState(false)
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    setSending(true)
    try {
      await portfolioApi.sendContact(data)
      toast.success("Message sent! I'll reply within 24 hours.")
      reset()
    } catch {
      toast.error('Failed to send. Email me directly.')
    } finally {
      setSending(false)
    }
  }

  return (
    <section id="contact" className="section-padding relative overflow-hidden">

      {/* Background glows */}
      <div
        className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(255,0,128,0.04) 0%, transparent 70%)' }}
      />
      <div
        className="absolute top-1/4 left-0 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(0,245,255,0.03) 0%, transparent 70%)' }}
      />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* ── Section header ──────────────────────────────────── */}
        <div className="mb-14">
          <span className="section-eyebrow text-neon-pink/50">// 05. Let&apos;s Build Together</span>
          <h2 className="section-title">
            <span className="text-white">Get In </span>
            <span className="neon-text-pink">Touch</span>
          </h2>
          <p className="text-white/30 text-sm mt-1 max-w-md font-mono">
            Open to SDE internships, AI research collabs, and freelance projects.
            Response guaranteed within 24 hours.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-10 items-start">

          {/* ── Info column ──────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-3">

            {/* Info cards with 3D tilt */}
            {INFO_ITEMS.map(({ label, value, color, icon }) => (
              <TiltInfoCard key={label} color={color}>
                {/* Icon dot */}
                <div
                  className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{
                    background: `${color}0d`,
                    border: `1px solid ${color}18`,
                    color,
                    fontSize: '0.8rem',
                    boxShadow: `0 0 12px ${color}12`,
                  }}
                >
                  {icon}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-mono text-[10px] text-white/20 tracking-widest uppercase mb-0.5">
                    {label}
                  </p>
                  <p className="font-mono text-sm truncate"
                     style={{ color: 'rgba(255,255,255,0.65)' }}>
                    {value}
                  </p>
                </div>

                {/* Subtle right glow bar */}
                <div
                  className="shrink-0 w-0.5 h-8 rounded-full"
                  style={{ background: `linear-gradient(180deg, transparent, ${color}40, transparent)` }}
                />
              </TiltInfoCard>
            ))}

            {/* Socials */}
            <div className="pt-3">
              <p className="font-mono text-[10px] text-white/20 mb-3 tracking-[0.2em] uppercase">
                // Find me online
              </p>
              <div className="flex gap-2">
                {SOCIALS.map(({ label, href, icon, color }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={label}
                    className="w-11 h-11 rounded-xl glass-card flex items-center justify-center
                               font-mono text-xs text-white/35 transition-all duration-300"
                    style={{
                      transition: 'all 0.25s ease',
                    }}
                    onMouseEnter={e => {
                      const el = e.currentTarget
                      el.style.color = color
                      el.style.borderColor = `${color}30`
                      el.style.background = `${color}08`
                      el.style.boxShadow = `0 0 20px ${color}20`
                      el.style.transform = 'translateY(-2px)'
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget
                      el.style.color = 'rgba(255,255,255,0.35)'
                      el.style.borderColor = ''
                      el.style.background = ''
                      el.style.boxShadow = ''
                      el.style.transform = ''
                    }}
                  >
                    {icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* ── Contact form ──────────────────────────────────── */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="lg:col-span-3 glass-card p-8 space-y-5 corner-tl corner-br"
            style={{ borderColor: 'rgba(255,0,128,0.08)' }}
          >
            {/* Top accent */}
            <div
              className="absolute top-0 left-8 right-8 h-px rounded-full"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(255,0,128,0.25), transparent)' }}
            />

            <div className="grid sm:grid-cols-2 gap-5">
              <div className="space-y-1">
                <input
                  {...register('name', { required: true })}
                  placeholder="Your Name"
                  className={`input-field ${errors.name ? 'border-neon-pink/35' : ''}`}
                />
                {errors.name && (
                  <p className="font-mono text-[11px] text-neon-pink/70 pl-1">Required</p>
                )}
              </div>
              <div className="space-y-1">
                <input
                  {...register('email', { required: true, pattern: /^\S+@\S+\.\S+$/ })}
                  placeholder="your@email.com"
                  className={`input-field ${errors.email ? 'border-neon-pink/35' : ''}`}
                />
                {errors.email && (
                  <p className="font-mono text-[11px] text-neon-pink/70 pl-1">Valid email required</p>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <input
                {...register('subject', { required: true })}
                placeholder="Subject"
                className={`input-field ${errors.subject ? 'border-neon-pink/35' : ''}`}
              />
              {errors.subject && (
                <p className="font-mono text-[11px] text-neon-pink/70 pl-1">Required</p>
              )}
            </div>

            <div className="space-y-1">
              <textarea
                {...register('message', { required: true, minLength: 20 })}
                placeholder="Tell me about your project or opportunity..."
                rows={6}
                className={`input-field resize-none ${errors.message ? 'border-neon-pink/35' : ''}`}
              />
              {errors.message && (
                <p className="font-mono text-[11px] text-neon-pink/70 pl-1">Min 20 characters</p>
              )}
            </div>

            <button
              type="submit"
              disabled={sending}
              className="w-full py-3.5 rounded-xl font-mono text-sm font-medium
                         transition-all duration-300 relative overflow-hidden"
              style={{
                background: 'rgba(255,0,128,0.07)',
                border: '1px solid rgba(255,0,128,0.3)',
                color: 'var(--neon-pink)',
              }}
              onMouseEnter={e => {
                if (sending) return
                const el = e.currentTarget
                el.style.background = 'rgba(255,0,128,0.14)'
                el.style.boxShadow = '0 0 24px rgba(255,0,128,0.3)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget
                el.style.background = 'rgba(255,0,128,0.07)'
                el.style.boxShadow = ''
              }}
            >
              {sending ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-3 h-3 rounded-full border border-neon-pink/50 border-t-neon-pink animate-spin" />
                  Sending...
                </span>
              ) : (
                '> Send Message →'
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}