'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import type { Skill } from '@/types'

const CAT_META: Record<string, { color: string; icon: string }> = {
  'Frontend':    { color: '#00f5ff', icon: '◈' },
  'Backend':     { color: '#bf00ff', icon: '⬡' },
  'Mobile':      { color: '#ff0080', icon: '◉' },
  'Database':    { color: '#00ff88', icon: '◆' },
  'DevOps':      { color: '#00f5ff', icon: '⬢' },
  'AI/ML':       { color: '#bf00ff', icon: '◇' },
  'Languages':   { color: '#ff0080', icon: '◎' },
  'Tools':       { color: '#00ff88', icon: '◐' },
  'Soft Skills': { color: '#00f5ff', icon: '○' },
}

// ── Animated skill bar ─────────────────────────────────────────
function SkillBar({ skill, animate }: { skill: Skill; animate: boolean }) {
  const [width, setWidth] = useState(0)
  const meta = CAT_META[skill.category] || { color: '#00f5ff', icon: '◈' }

  useEffect(() => {
    if (!animate) { setWidth(0); return }
    const t = setTimeout(() => setWidth(skill.proficiency), 120)
    return () => clearTimeout(t)
  }, [animate, skill.proficiency])

  return (
    <div className="group space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="font-mono text-xs text-white/55 group-hover:text-white/85 transition-colors duration-200">
          {skill.name}
        </span>
        <span className="font-mono text-[11px] font-medium tabular-nums"
              style={{ color: meta.color }}>
          {skill.proficiency}%
        </span>
      </div>
      <div className="h-[2px] bg-white/[0.05] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full relative overflow-hidden transition-all duration-1000 ease-out"
          style={{
            width: `${width}%`,
            background: `linear-gradient(90deg, ${meta.color}50, ${meta.color})`,
          }}
        >
          {/* Moving shimmer on the bar */}
          <div
            className="absolute inset-0 w-1/2"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)',
              animation: animate ? 'dataStream 2s ease-out 1s both' : 'none',
            }}
          />
        </div>
      </div>
    </div>
  )
}

// ── 3D Tilt card wrapper ───────────────────────────────────────
function TiltCard({
  children,
  color,
  className = '',
  style = {},
}: {
  children: React.ReactNode
  color: string
  className?: string
  style?: React.CSSProperties
}) {
  const ref = useRef<HTMLDivElement>(null)

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 14
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * -14
    el.style.transform = `perspective(900px) rotateY(${x}deg) rotateX(${y}deg) translateZ(10px)`
    el.style.boxShadow = `0 24px 56px rgba(0,0,0,0.6), 0 0 0 1px ${color}20, 0 0 40px ${color}10`
  }, [color])

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
      className={`glass-card ${className}`}
      style={{
        ...style,
        transition: 'transform 0.12s ease, box-shadow 0.3s ease',
        transformStyle: 'preserve-3d',
      }}
    >
      {children}
    </div>
  )
}

export default function Skills({ skills }: { skills: Skill[] }) {
  const [activeCategory, setActiveCategory] = useState('All')
  const [animated,       setAnimated]       = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const categories = ['All', ...Array.from(new Set(skills.map(s => s.category)))]

  const filtered = activeCategory === 'All'
    ? skills
    : skills.filter(s => s.category === activeCategory)

  const grouped = filtered.reduce<Record<string, Skill[]>>((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = []
    acc[skill.category].push(skill)
    return acc
  }, {})

  // Intersection observer for animate-on-scroll
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setAnimated(true) },
      { threshold: 0.08 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  const handleCategoryChange = (cat: string) => {
    setAnimated(false)
    setActiveCategory(cat)
    requestAnimationFrame(() => setTimeout(() => setAnimated(true), 60))
  }

  return (
    <section id="skills" ref={ref} className="section-padding relative overflow-hidden">

      {/* Background accent */}
      <div
        className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(191,0,255,0.04) 0%, transparent 70%)' }}
      />

      {/* Decorative floating shape */}
      <div
        className="absolute top-20 right-10 shape-float pointer-events-none"
        style={{
          width: 80, height: 80,
          border: '1px solid rgba(191,0,255,0.1)',
          transform: 'rotate(30deg)',
          borderRadius: 4,
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* ── Section header ──────────────────────────────────── */}
        <div className="mb-14">
          <span className="section-eyebrow text-neon-purple/50">// 02. Technical Arsenal</span>
          <h2 className="section-title">
            <span className="text-white">Skills &amp; </span>
            <span className="neon-text-purple">Expertise</span>
          </h2>
          <p className="text-white/30 text-sm mt-1 font-mono">
            {skills.length} skills across the full stack — frontend to autonomous AI agents.
          </p>
        </div>

        {/* ── Category filter pills ───────────────────────────── */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map(cat => {
            const meta   = CAT_META[cat] || { color: '#00f5ff', icon: '◈' }
            const active = activeCategory === cat
            return (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className="px-4 py-2 rounded-xl font-mono text-xs transition-all duration-250"
                style={{
                  border:     `1px solid ${active ? meta.color : 'rgba(255,255,255,0.07)'}`,
                  color:       active ? meta.color : 'rgba(255,255,255,0.32)',
                  background:  active ? `${meta.color}0d` : 'transparent',
                  boxShadow:   active ? `0 0 18px ${meta.color}20, inset 0 0 8px ${meta.color}06` : 'none',
                  transform:   active ? 'translateY(-1px)' : 'none',
                }}
              >
                {cat !== 'All' && (
                  <span className="mr-1.5 opacity-60">{meta.icon}</span>
                )}
                {cat}
              </button>
            )
          })}
        </div>

        {/* ── Skill cards grid ────────────────────────────────── */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Object.entries(grouped).map(([category, catSkills]) => {
            const meta = CAT_META[category] || { color: '#00f5ff', icon: '◈' }
            return (
              <TiltCard
                key={category}
                color={meta.color}
                className="p-6 space-y-5"
                style={{ borderColor: `${meta.color}12` }}
              >
                {/* Card header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="text-lg"
                      style={{ color: meta.color, filter: `drop-shadow(0 0 6px ${meta.color}60)` }}
                    >
                      {meta.icon}
                    </span>
                    <h3 className="font-mono text-xs font-bold tracking-[0.15em] uppercase"
                        style={{ color: meta.color }}>
                      {category}
                    </h3>
                  </div>
                  <span
                    className="font-mono text-xs px-2 py-0.5 rounded-md tabular-nums"
                    style={{
                      color: meta.color,
                      background: `${meta.color}0d`,
                      border: `1px solid ${meta.color}20`,
                    }}
                  >
                    {catSkills.length}
                  </span>
                </div>

                {/* Thin accent line */}
                <div
                  className="h-px w-full rounded-full"
                  style={{ background: `linear-gradient(90deg, ${meta.color}40, transparent)` }}
                />

                {/* Skill bars */}
                <div className="space-y-3.5">
                  {catSkills.map(skill => (
                    <SkillBar key={skill._id} skill={skill} animate={animated} />
                  ))}
                </div>
              </TiltCard>
            )
          })}
        </div>
      </div>
    </section>
  )
}