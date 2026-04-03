'use client'
import { useRef, useCallback } from 'react'
import type { Certification } from '@/types'

const ISSUER_META: Record<string, { color: string; abbr: string; icon: string }> = {
  'Google':            { color: '#00f5ff', abbr: 'G',   icon: '◉' },
  'IBM / Coursera':    { color: '#bf00ff', abbr: 'IBM', icon: '◆' },
  'Deloitte / Forage': { color: '#00ff88', abbr: 'D',   icon: '◈' },
}

function CertCard({ cert }: { cert: Certification }) {
  const ref  = useRef<HTMLDivElement>(null)
  const meta = ISSUER_META[cert.issuer] || { color: '#00f5ff', abbr: '✦', icon: '◎' }

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 14
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * -14
    el.style.transform = `perspective(900px) rotateY(${x}deg) rotateX(${y}deg) translateZ(10px)`
    el.style.boxShadow = `0 24px 50px rgba(0,0,0,0.6), 0 0 0 1px ${meta.color}18, 0 0 35px ${meta.color}10`
  }, [meta.color])

  const onMouseLeave = useCallback(() => {
    const el = ref.current
    if (!el) return
    el.style.transform = 'perspective(900px) rotateY(0deg) rotateX(0deg) translateZ(0)'
    el.style.boxShadow = ''
  }, [])

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="glass-card p-6 flex gap-4 items-start cursor-default"
      style={{
        borderColor: `${meta.color}12`,
        transition: 'transform 0.12s ease, box-shadow 0.3s ease',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* 3D issuer badge */}
      <div
        className="shrink-0 w-12 h-12 rounded-xl flex flex-col items-center justify-center
                   font-mono font-bold text-xs gap-0.5"
        style={{
          background: `${meta.color}0d`,
          border: `1px solid ${meta.color}22`,
          color: meta.color,
          boxShadow: `0 0 20px ${meta.color}12, inset 0 1px 0 ${meta.color}15`,
        }}
      >
        <span style={{ fontSize: '0.7rem', opacity: 0.5 }}>{meta.icon}</span>
        <span>{meta.abbr}</span>
      </div>

      {/* Content */}
      <div className="min-w-0 space-y-1.5">
        <h3 className="font-display font-semibold text-white text-sm leading-snug tracking-tight">
          {cert.title}
        </h3>
        <p className="font-mono text-xs font-medium" style={{ color: meta.color }}>
          {cert.issuer}
        </p>
        {cert.credentialUrl && (
          <a
            href={cert.credentialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-mono text-xs text-white/20
                       hover:text-white/55 transition-colors duration-200 mt-0.5"
          >
            View Credential
            <span className="text-[10px] opacity-60">↗</span>
          </a>
        )}
      </div>

      {/* Depth overlay */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{ background: `linear-gradient(135deg, ${meta.color}04 0%, transparent 60%)` }}
      />
    </div>
  )
}

export default function Certifications({ certs }: { certs: Certification[] }) {
  return (
    <section id="certs" className="section-padding relative overflow-hidden">

      {/* Background glow */}
      <div
        className="absolute top-1/2 right-0 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(0,255,136,0.04) 0%, transparent 70%)' }}
      />

      {/* Floating shape */}
      <div
        className="absolute bottom-24 right-16 shape-float pointer-events-none"
        style={{
          width: 36, height: 36,
          border: '1px solid rgba(0,255,136,0.12)',
          transform: 'rotate(45deg)',
          borderRadius: 4,
          animationDuration: '11s',
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* ── Section header ──────────────────────────────────── */}
        <div className="mb-14">
          <span className="section-eyebrow text-neon-green/50">// 04. Credentials</span>
          <h2 className="section-title">
            <span className="text-white">Certifications &amp; </span>
            <span className="neon-text-green">Achievements</span>
          </h2>
        </div>

        {/* ── Cert cards ──────────────────────────────────────── */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
          {certs.map(cert => (
            <CertCard key={cert._id} cert={cert} />
          ))}
        </div>

        {/* ── VSS Recognition — Featured card ─────────────────── */}
        <div
          className="glass-card p-8 corner-tl corner-br"
          style={{ borderColor: 'rgba(0,245,255,0.1)' }}
        >
          {/* Top accent line */}
          <div
            className="absolute top-0 left-8 right-8 h-px rounded-full"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(0,245,255,0.3), transparent)' }}
          />

          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
            {/* Badge */}
            <div
              className="shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center
                         font-mono font-bold text-base neon-text-cyan"
              style={{
                background: 'rgba(0,245,255,0.06)',
                border: '1px solid rgba(0,245,255,0.18)',
                boxShadow: '0 0 24px rgba(0,245,255,0.12), inset 0 0 12px rgba(0,245,255,0.04)',
              }}
            >
              VSS
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <h3 className="font-display font-bold text-white text-lg mb-1.5 tracking-tight">
                Vidyarthi Sahayyak Samiti Scholar — Wing Head
              </h3>
              <p className="text-white/40 text-sm leading-relaxed">
                Selected as a VSS Scholar for academic excellence and leadership.
                Serving as Wing Head at one of India&apos;s most respected student development organizations.
                Recognized for integrity, discipline, and community-driven learning.
              </p>
            </div>

            {/* Year */}
            <div className="shrink-0 flex flex-col items-end gap-1">
              <span className="font-mono text-xs text-neon-cyan/35 whitespace-nowrap">
                2023 — Present
              </span>
              <span
                className="font-mono text-[10px] px-2 py-0.5 rounded-full"
                style={{
                  color: 'var(--neon-green)',
                  background: 'rgba(0,255,136,0.06)',
                  border: '1px solid rgba(0,255,136,0.15)',
                }}
              >
                Active
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}