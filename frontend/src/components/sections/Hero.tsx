'use client'
import { useEffect, useState, useRef, useCallback } from 'react'

const ROLES = [
  'Full-Stack Developer',
  'Agentic AI Engineer',
  'MERN Stack Developer',
  'Java Spring Boot Dev',
  'Open Source Builder',
]

// ── 3D Tilt hook ───────────────────────────────────────────────
function useTilt(intensity = 10) {
  const ref = useRef<HTMLDivElement>(null)

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width  - 0.5) * intensity
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * -intensity
    el.style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${y}deg) translateZ(12px)`
  }, [intensity])

  const onMouseLeave = useCallback(() => {
    if (ref.current) {
      ref.current.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateZ(0)'
    }
  }, [])

  return { ref, onMouseMove, onMouseLeave }
}

export default function Hero() {
  const [roleIndex,  setRoleIndex]  = useState(0)
  const [displayed,  setDisplayed]  = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [charIdx,    setCharIdx]    = useState(0)
  const [bootLines,  setBootLines]  = useState<string[]>([])
  const bootRef = useRef<HTMLDivElement>(null)
  const tilt = useTilt(8)

  // ── Typewriter ───────────────────────────────────────────────
  useEffect(() => {
    const current = ROLES[roleIndex]
    const delay   = isDeleting ? 30 : 70

    const timer = setTimeout(() => {
      if (!isDeleting) {
        setDisplayed(current.slice(0, charIdx + 1))
        if (charIdx + 1 === current.length) {
          setTimeout(() => setIsDeleting(true), 2200)
        } else {
          setCharIdx(c => c + 1)
        }
      } else {
        setDisplayed(current.slice(0, charIdx - 1))
        if (charIdx === 0) {
          setIsDeleting(false)
          setRoleIndex(i => (i + 1) % ROLES.length)
        } else {
          setCharIdx(c => c - 1)
        }
      }
    }, delay)

    return () => clearTimeout(timer)
  }, [charIdx, isDeleting, roleIndex])

  // ── Boot terminal ───────────────────────────────────────────
  useEffect(() => {
    const lines = [
      '> Initializing portfolio v3.0 ...',
      '> Neural networks loaded ........... ✓',
      '> MongoDB Atlas connected .......... ✓',
      '> Three.js scene mounted ........... ✓',
      '> AI agent pipeline built .......... ✓',
      '> [OK] All systems operational.',
    ]
    lines.forEach((line, i) => {
      setTimeout(() => {
        setBootLines(prev => [...prev, line])
      }, 400 + i * 480)
    })
  }, [])

  useEffect(() => {
    if (bootRef.current) bootRef.current.scrollTop = bootRef.current.scrollHeight
  }, [bootLines])

  return (
    <section
      id="about"
      className="relative min-h-screen flex items-center justify-center section-padding cyber-grid overflow-hidden"
    >

      {/* ── Ambient glows ──────────────────────────────────────── */}
      <div className="absolute top-1/3 left-[8%] w-96 h-96 rounded-full pointer-events-none"
           style={{ background: 'radial-gradient(circle, rgba(0,245,255,0.06) 0%, transparent 70%)' }} />
      <div className="absolute bottom-1/4 right-[8%] w-80 h-80 rounded-full pointer-events-none"
           style={{ background: 'radial-gradient(circle, rgba(191,0,255,0.05) 0%, transparent 70%)' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
           style={{ background: 'radial-gradient(circle, rgba(0,245,255,0.02) 0%, transparent 60%)' }} />

      {/* ── Floating 3D geometric shapes ───────────────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Top-left floating cube frame */}
        <div
          className="absolute shape-float"
          style={{ top: '15%', left: '5%', width: 40, height: 40,
                   border: '1px solid rgba(0,245,255,0.15)',
                   transform: 'rotate(45deg)', animationDuration: '9s' }}
        />
        <div
          className="absolute shape-float"
          style={{ top: '18%', left: '5.8%', width: 26, height: 26,
                   border: '1px solid rgba(0,245,255,0.08)',
                   transform: 'rotate(45deg)', animationDelay: '-2s', animationDuration: '9s' }}
        />

        {/* Top-right floating triangle */}
        <div
          className="absolute shape-float"
          style={{ top: '20%', right: '7%', width: 0, height: 0,
                   borderLeft: '18px solid transparent',
                   borderRight: '18px solid transparent',
                   borderBottom: '32px solid rgba(191,0,255,0.12)',
                   animationDuration: '11s', animationDelay: '-3s' }}
        />

        {/* Bottom-left ring */}
        <div
          className="absolute orbit-ring shape-float"
          style={{ bottom: '22%', left: '3%', width: 60, height: 60,
                   animationDuration: '14s', animationDelay: '-5s' }}
        />

        {/* Mid-right diamond */}
        <div
          className="absolute shape-float"
          style={{ top: '55%', right: '4%', width: 20, height: 20,
                   background: 'rgba(255,0,128,0.1)',
                   border: '1px solid rgba(255,0,128,0.2)',
                   transform: 'rotate(45deg)', animationDuration: '7s', animationDelay: '-1s' }}
        />

        {/* Bottom horizontal data stream — pure CSS only */}
        <div className="absolute bottom-0 left-0 right-0 h-px"
             style={{ background: 'linear-gradient(90deg, transparent, rgba(0,245,255,0.15), rgba(191,0,255,0.1), transparent)' }} />
      </div>

      {/* ── Main content grid ─────────────────────────────────── */}
      <div className="relative z-10 max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">

        {/* ── LEFT — Text content ───────────────────────────────── */}
        <div className="space-y-7" style={{ animation: 'fadeUp 0.7s ease-out forwards', animationFillMode: 'both' }}>

          {/* Status badge with 3D depth */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full w-fit badge-3d"
               style={{ border: '1px solid rgba(0,255,136,0.25)', background: 'rgba(0,255,136,0.04)' }}>
            <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
            <span className="font-mono text-xs text-neon-green/80 tracking-wide">
              Available — SDE / AI Intern Roles
            </span>
          </div>

          {/* Name with holographic highlight on second line */}
          <div>
            <p className="font-mono text-xs text-white/25 tracking-[0.3em] uppercase mb-3">
              Hello, I&apos;m
            </p>
            <h1 className="font-display font-extrabold leading-[0.95] tracking-tight">
              <span className="text-white block"
                    style={{ fontSize: 'clamp(2.8rem, 7vw, 5rem)' }}>
                Krushna
              </span>
              <span className="holographic-text block"
                    style={{ fontSize: 'clamp(2.8rem, 7vw, 5rem)' }}>
                Pokharkar
              </span>
            </h1>
          </div>

          {/* Typewriter role */}
          <div className="flex items-center gap-2.5 h-8">
            <span className="font-mono text-neon-cyan/35 text-sm select-none">$</span>
            <span className="font-mono text-base text-neon-purple font-medium">
              {displayed}
              <span className="inline-block w-[2px] h-[18px] bg-neon-purple ml-0.5 align-middle"
                    style={{ animation: 'glowPulse 1.1s ease-in-out infinite' }} />
            </span>
          </div>

          {/* Description */}
          <p className="text-white/50 text-[15px] leading-[1.8] max-w-[460px]">
            Self-taught engineer with 3+ years building production-grade systems.
            Currently building{' '}
            <span className="text-neon-cyan font-semibold" style={{ textShadow: '0 0 12px rgba(0,245,255,0.4)' }}>
              JobCrawler.ai
            </span>
            {' '}— an autonomous agent that crawls jobs, parses resumes, detects
            skill gaps, and runs adaptive mock interviews.
          </p>

          {/* Tech pills */}
          <div className="flex flex-wrap gap-2">
            {['React', 'Next.js', 'Spring Boot', 'Python', 'OpenAI API', 'Docker', 'MongoDB', 'Flutter'].map(t => (
              <span
                key={t}
                className="px-3 py-1 rounded-md font-mono text-xs cursor-default
                           transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: 'rgba(255,255,255,0.35)',
                  background: 'rgba(255,255,255,0.02)',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget
                  el.style.borderColor = 'rgba(0,245,255,0.35)'
                  el.style.color = 'var(--neon-cyan)'
                  el.style.background = 'rgba(0,245,255,0.05)'
                  el.style.boxShadow = '0 0 12px rgba(0,245,255,0.15)'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget
                  el.style.borderColor = 'rgba(255,255,255,0.08)'
                  el.style.color = 'rgba(255,255,255,0.35)'
                  el.style.background = 'rgba(255,255,255,0.02)'
                  el.style.boxShadow = 'none'
                }}
              >
                {t}
              </span>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              onClick={() => document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-primary"
            >
              View Projects <span className="opacity-60">→</span>
            </button>
            <button
              onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-ghost"
            >
              Get In Touch
            </button>
            <a
              href="https://www.linkedin.com/in/krushnapokharkar2142"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
            >
              LinkedIn <span className="text-xs opacity-50">↗</span>
            </a>
          </div>
        </div>

        {/* ── RIGHT — 3D Tilting Terminal ────────────────────────── */}
        <div
          ref={tilt.ref}
          onMouseMove={tilt.onMouseMove}
          onMouseLeave={tilt.onMouseLeave}
          className="glass-card tilt-card p-6 font-mono text-sm cursor-default select-none corner-tl corner-br"
          style={{
            animationDelay: '0.2s',
            animation: 'fadeUp 0.7s 0.15s ease-out both',
            boxShadow: '0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06), inset 0 1px 0 rgba(255,255,255,0.08)',
            transition: 'transform 0.15s ease, box-shadow 0.3s ease',
          }}
        >
          {/* Terminal chrome */}
          <div className="flex items-center gap-2 pb-4 mb-4 border-b border-white/[0.05]">
            <span className="w-2.5 h-2.5 rounded-full"
                  style={{ background: 'rgba(255,96,96,0.7)', boxShadow: '0 0 6px rgba(255,96,96,0.4)' }} />
            <span className="w-2.5 h-2.5 rounded-full"
                  style={{ background: 'rgba(255,196,0,0.7)', boxShadow: '0 0 6px rgba(255,196,0,0.3)' }} />
            <span className="w-2.5 h-2.5 rounded-full"
                  style={{ background: 'rgba(0,210,106,0.7)', boxShadow: '0 0 6px rgba(0,210,106,0.3)' }} />
            <span className="ml-3 text-white/20 text-xs tracking-wide">portfolio@krushna ~ bash</span>
            <span className="ml-auto text-white/10 text-xs">v3.0</span>
          </div>

          {/* Boot output */}
          <div ref={bootRef} className="space-y-2 min-h-[150px] overflow-hidden">
            {bootLines.map((line, i) => (
              <p
                key={i}
                className="text-xs"
                style={{
                  color: line.includes('[OK]')  ? 'var(--neon-green)' :
                         line.includes('AI')    ? 'var(--neon-purple)' :
                         line.includes('✓')     ? 'var(--neon-cyan)' :
                         'rgba(255,255,255,0.35)',
                  textShadow: line.includes('[OK]') ? '0 0 8px rgba(0,255,136,0.4)' : 'none',
                  animation: `fadeIn 0.3s ease-out`,
                }}
              >
                {line}
              </p>
            ))}
            {bootLines.length < 6 && (
              <span className="inline-block w-2 h-3.5 rounded-sm bg-neon-cyan/50"
                    style={{ animation: 'glowPulse 0.8s ease-in-out infinite' }} />
            )}
          </div>

          {/* Divider */}
          <div className="my-5 border-t border-white/[0.05]" />

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Years Coding',    value: '3+',  color: '#00f5ff' },
              { label: 'Projects Built',  value: '10+', color: '#bf00ff' },
              { label: 'Skills Mastered', value: '37+', color: '#ff0080' },
              { label: 'Certifications',  value: '3',   color: '#00ff88' },
            ].map(({ label, value, color }) => (
              <div
                key={label}
                className="p-3 rounded-xl"
                style={{
                  background: `${color}06`,
                  border: `1px solid ${color}15`,
                }}
              >
                <p className="text-2xl font-bold font-display mb-0.5"
                   style={{ color, textShadow: `0 0 16px ${color}60` }}>
                  {value}
                </p>
                <p className="text-white/30 text-[11px] font-mono">{label}</p>
              </div>
            ))}
          </div>

          {/* Focus */}
          <div className="mt-5 pt-4 border-t border-white/[0.05]">
            <p className="text-white/20 text-[10px] font-mono mb-1.5 tracking-widest uppercase">
              // current_focus
            </p>
            <p className="text-neon-cyan text-xs font-mono"
               style={{ textShadow: '0 0 8px rgba(0,245,255,0.3)' }}>
              Agentic AI · Multi-agent Systems · LLM Tool-use · Spring AI
            </p>
          </div>

          {/* 3D depth layer indicator (purely decorative) */}
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, rgba(0,245,255,0.03) 0%, transparent 50%, rgba(191,0,255,0.02) 100%)',
            }}
          />
        </div>
      </div>

      {/* ── Scroll hint ─────────────────────────────────────────── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
           style={{ animation: 'float 3s ease-in-out infinite' }}>
        <div className="w-px h-10 bg-gradient-to-b from-neon-cyan/30 to-transparent" />
        <span className="font-mono text-[10px] text-white/15 tracking-[0.2em] uppercase">scroll</span>
      </div>
    </section>
  )
}