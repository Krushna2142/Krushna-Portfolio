'use client'
import { useEffect, useState, useRef } from 'react'

const ROLES = [
  'Full-Stack Developer',
  'Software Engineer',
  'Tech Enthusiast',
  'Content Creator',
  'AI Researcher',
  'Agentic AI Engineer',
  'MERN Stack Developer',
  'Java Spring Boot Dev',
  'Open Source Builder',
]

const BOOT_LINES = [
  { text: '> Initializing portfolio v2.0...',       color: 'text-white/35'   },
  { text: '> Loading neural networks... done',       color: 'text-[var(--neon-cyan)]' },
  { text: '> Connecting to MongoDB Atlas... done',   color: 'text-[var(--neon-green)]' },
  { text: '> Mounting Three.js scene... done',       color: 'text-[var(--neon-cyan)]' },
  { text: '> Building AI agent pipeline... done',    color: 'text-[var(--neon-purple)]' },
  { text: '> [SYS] All systems operational.',        color: 'text-[var(--neon-green)]' },
]

export default function Hero() {
  const [roleIndex,  setRoleIndex]  = useState(0)
  const [displayed,  setDisplayed]  = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [charIdx,    setCharIdx]    = useState(0)
  const [bootLines,  setBootLines]  = useState<typeof BOOT_LINES>([])
  const bootRef = useRef<HTMLDivElement>(null)

  // Typewriter
  useEffect(() => {
    const current = ROLES[roleIndex]
    const delay   = isDeleting ? 32 : 72
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

  // Boot terminal
  useEffect(() => {
    BOOT_LINES.forEach((line, i) => {
      setTimeout(() => {
        setBootLines(prev => [...prev, line])
      }, 500 + i * 480)
    })
  }, [])

  useEffect(() => {
    if (bootRef.current) bootRef.current.scrollTop = bootRef.current.scrollHeight
  }, [bootLines])

  return (
    <section
      id="about"
      className="relative min-h-screen flex items-center justify-center cyber-grid overflow-hidden"
      style={{ paddingTop: '6rem', paddingBottom: '4rem', paddingLeft: '1.5rem', paddingRight: '1.5rem' }}
    >
      {/* Ambient glows */}
      <div className="absolute top-1/4 left-[10%] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(0,245,255,0.06) 0%, transparent 70%)' }} />
      <div className="absolute bottom-1/4 right-[10%] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(191,0,255,0.06) 0%, transparent 70%)' }} />

      {/* HUD corner decorations */}
      <div className="absolute top-20 left-6 font-mono text-[0.55rem] text-[rgba(0,245,255,0.2)] leading-5 pointer-events-none">
        <div>SYS // ONLINE</div>
        <div>LAT // 18.52°N</div>
        <div>LON // 73.85°E</div>
      </div>
      <div className="absolute top-20 right-6 font-mono text-[0.55rem] text-[rgba(0,245,255,0.2)] leading-5 text-right pointer-events-none">
        <div>VER // 2.0.4</div>
        <div>ENV // PROD</div>
        <div>STATUS // ACTIVE</div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

        {/* ── Left ──────────────────────────────────────────── */}
        <div className="space-y-7 animate-fade-up" style={{ paddingTop: '2rem' }}>

          {/* Status badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-[rgba(0,255,136,0.25)] bg-[rgba(0,255,136,0.05)]">
            <span className="w-2 h-2 rounded-full bg-[var(--neon-green)] animate-pulse flex-shrink-0" />
            <span className="font-mono text-xs text-[var(--neon-green)] tracking-wider">
              Available — SDE / AI Intern Roles
            </span>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <p className="font-mono text-[0.65rem] text-white/25 tracking-[0.35em] uppercase">
              Hello, I&apos;m
            </p>
            <h1 className="leading-none">
              <span className="block text-white" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.8rem, 7vw, 5rem)', fontWeight: 800, letterSpacing: '0.06em', lineHeight: 1.05 }}>
                KRUSHNA
              </span>
              <span className="block neon-text-cyan" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.8rem, 7vw, 5rem)', fontWeight: 800, letterSpacing: '0.06em', lineHeight: 1.05 }}>
                POKHARKAR
              </span>
            </h1>
          </div>

          {/* Typing role */}
          <div className="flex items-center gap-2.5 h-8">
            <span className="font-mono text-[var(--neon-cyan)] text-sm opacity-40">$</span>
            <span className="font-mono text-base text-[var(--neon-purple)] tracking-wide">
              {displayed}
              <span
                className="inline-block w-[2px] h-[18px] bg-[var(--neon-purple)] ml-0.5 animate-glow-pulse"
                style={{ verticalAlign: 'middle' }}
              />
            </span>
          </div>

          {/* Description */}
          <p className="text-white/50 text-[0.95rem] leading-[1.85] max-w-[440px]" style={{ fontFamily: 'var(--font-body)' }}>
            Self-taught engineer with 3+ years building production-grade systems. Currently building{' '}
            <span className="text-[var(--neon-cyan)] font-semibold">JobCrawler.ai</span>
            {' '}— an autonomous agent that crawls jobs, parses resumes, detects skill gaps, and runs adaptive mock interviews.
          </p>

          {/* Tech pills */}
          <div className="flex flex-wrap gap-2" style={{ paddingTop: '0.25rem' }}>
            {['React', 'Next.js', 'Spring Boot', 'Python', 'OpenAI API', 'Docker', 'MongoDB', 'Flutter'].map(t => (
              <span
                key={t}
                className="px-3 py-1.5 rounded-md font-mono text-[0.68rem] border border-white/[0.08] text-white/35 hover:border-[rgba(0,245,255,0.35)] hover:text-[var(--neon-cyan)] transition-all duration-300 cursor-default tracking-wider"
              >
                {t}
              </span>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3" style={{ paddingTop: '0.5rem' }}>
            <button
              onClick={() => document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-primary"
            >
              View Projects →
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
              LinkedIn ↗
            </a>
          </div>
        </div>

        {/* ── Right — Terminal ──────────────────────────────── */}
        <div
          className="glass-card-elevated animate-fade-up delay-200 corner-accent"
          style={{ padding: '1.75rem', fontFamily: 'var(--font-mono)' }}
        >
          {/* Terminal chrome */}
          <div className="flex items-center gap-2 pb-4 mb-4 border-b border-white/[0.06]">
            <span className="w-3 h-3 rounded-full bg-red-500/50 flex-shrink-0" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/50 flex-shrink-0" />
            <span className="w-3 h-3 rounded-full bg-[rgba(0,255,136,0.6)] flex-shrink-0" />
            <span className="ml-3 text-white/20 text-[0.65rem] tracking-wider">portfolio@krushna ~ bash</span>
          </div>

          {/* Boot output */}
          <div ref={bootRef} className="space-y-2.5 min-h-[148px] overflow-hidden">
            {bootLines.map((line, i) => (
              <p key={i} className={`text-[0.72rem] leading-relaxed transition-all duration-300 ${line.color}`}>
                {line.text}
              </p>
            ))}
            {bootLines.length < BOOT_LINES.length && (
              <span className="inline-block w-2 h-[14px] bg-[rgba(0,245,255,0.5)] animate-pulse" />
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mt-6 pt-5 border-t border-white/[0.06]">
            {[
              { label: 'Years Coding',    value: '3+',  color: 'var(--neon-cyan)'   },
              { label: 'Projects Built',  value: '10+', color: 'var(--neon-purple)' },
              { label: 'Skills Mastered', value: '37+', color: 'var(--neon-pink)'   },
              { label: 'Certifications',  value: '3',   color: 'var(--neon-green)'  },
            ].map(({ label, value, color }) => (
              <div key={label} className="space-y-1">
                <p className="font-bold" style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color, lineHeight: 1.2 }}>
                  {value}
                </p>
                <p className="text-white/30 text-[0.68rem] tracking-wide">{label}</p>
              </div>
            ))}
          </div>

          {/* Focus */}
          <div className="mt-5 pt-4 border-t border-white/[0.06] space-y-1.5">
            <p className="text-white/20 text-[0.65rem] tracking-widest">// CURRENT_FOCUS</p>
            <p className="text-[var(--neon-cyan)] text-[0.72rem] leading-relaxed">
              Agentic AI · Multi-agent Systems · LLM Tool-use · Spring AI
            </p>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <div className="w-px h-10 bg-gradient-to-b from-[rgba(0,245,255,0.35)] to-transparent" />
        <span className="font-mono text-[0.6rem] text-white/15 tracking-widest">SCROLL</span>
      </div>
    </section>
  )
}