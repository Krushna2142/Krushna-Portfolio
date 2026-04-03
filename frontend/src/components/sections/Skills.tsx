'use client'
import { useState, useEffect, useRef } from 'react'
import type { Skill } from '@/types'

const CAT_COLOR: Record<string, string> = {
  'Frontend':    'var(--neon-cyan)',
  'Backend':     'var(--neon-purple)',
  'Mobile':      'var(--neon-pink)',
  'Database':    'var(--neon-green)',
  'DevOps':      'var(--neon-cyan)',
  'AI/ML':       'var(--neon-purple)',
  'Languages':   'var(--neon-pink)',
  'Tools':       'var(--neon-green)',
  'Soft Skills': 'var(--neon-cyan)',
}

const CAT_HEX: Record<string, string> = {
  'Frontend':    '#00f5ff',
  'Backend':     '#bf00ff',
  'Mobile':      '#ff0080',
  'Database':    '#00ff88',
  'DevOps':      '#00f5ff',
  'AI/ML':       '#bf00ff',
  'Languages':   '#ff0080',
  'Tools':       '#00ff88',
  'Soft Skills': '#00f5ff',
}

function SkillBar({ skill, animate }: { skill: Skill; animate: boolean }) {
  const [width, setWidth] = useState(0)
  const color = CAT_HEX[skill.category] || '#00f5ff'

  useEffect(() => {
    if (!animate) { setWidth(0); return }
    const t = setTimeout(() => setWidth(skill.proficiency), 120)
    return () => clearTimeout(t)
  }, [animate, skill.proficiency])

  return (
    <div className="group space-y-2">
      <div className="flex justify-between items-center">
        <span
          className="text-white/55 group-hover:text-white/90 transition-colors"
          style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', lineHeight: 1.4 }}
        >
          {skill.name}
        </span>
        <span
          className="font-mono tabular-nums flex-shrink-0 ml-2"
          style={{ fontSize: '0.68rem', color, lineHeight: 1.4 }}
        >
          {skill.proficiency}%
        </span>
      </div>
      <div className="progress-track">
        <div
          className="progress-fill"
          style={{
            width: `${width}%`,
            background: `linear-gradient(90deg, ${color}60, ${color})`,
            boxShadow: `0 0 8px ${color}50`,
          }}
        />
      </div>
    </div>
  )
}

export default function Skills({ skills }: { skills: Skill[] }) {
  const [activeCategory, setActiveCategory] = useState('All')
  const [animated,       setAnimated]       = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const categories = ['All', ...Array.from(new Set(skills.map(s => s.category)))]
  const filtered   = activeCategory === 'All' ? skills : skills.filter(s => s.category === activeCategory)
  const grouped    = filtered.reduce<Record<string, Skill[]>>((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = []
    acc[skill.category].push(skill)
    return acc
  }, {})

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setAnimated(true) },
      { threshold: 0.1 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  const handleCategoryChange = (cat: string) => {
    setAnimated(false)
    setActiveCategory(cat)
    setTimeout(() => setAnimated(true), 80)
  }

  return (
    <section id="skills" ref={ref} className="section-padding relative">
      {/* Ambient */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] pointer-events-none"
        style={{ background: 'radial-gradient(circle at top right, rgba(191,0,255,0.05), transparent 70%)' }} />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Header */}
        <div className="mb-12">
          <p className="section-eyebrow text-[var(--neon-cyan)]">// 02. TECHNICAL ARSENAL</p>
          <h2 className="section-title">
            <span className="text-white">Skills &amp; </span>
            <span className="neon-text-purple">Expertise</span>
          </h2>
          <p className="section-subtitle">
            {skills.length} skills across the full stack — from frontend to autonomous AI agents.
          </p>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map(cat => {
            const hex    = CAT_HEX[cat] || '#00f5ff'
            const active = activeCategory === cat
            return (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className="px-4 py-2 rounded-xl font-mono text-[0.72rem] tracking-wider transition-all duration-300"
                style={{
                  border:     `1px solid ${active ? hex : 'rgba(255,255,255,0.07)'}`,
                  color:       active ? hex : 'rgba(255,255,255,0.32)',
                  background:  active ? `${hex}10` : 'transparent',
                  boxShadow:   active ? `0 0 16px ${hex}20, inset 0 0 16px ${hex}05` : 'none',
                }}
              >
                {cat}
              </button>
            )
          })}
        </div>

        {/* Skill cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Object.entries(grouped).map(([category, catSkills]) => {
            const hex = CAT_HEX[category] || '#00f5ff'
            return (
              <div
                key={category}
                className="glass-card card-3d transition-all duration-500"
                style={{
                  padding: '1.5rem',
                  borderColor: `${hex}18`,
                  boxShadow: `0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)`,
                }}
              >
                {/* Card header */}
                <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/[0.06]">
                  <h3
                    className="font-mono font-bold tracking-[0.15em] uppercase"
                    style={{ fontSize: '0.68rem', color: hex }}
                  >
                    {category}
                  </h3>
                  <span
                    className="font-mono text-[0.65rem] px-2 py-0.5 rounded-md"
                    style={{ color: hex, background: `${hex}12`, border: `1px solid ${hex}25` }}
                  >
                    {catSkills.length}
                  </span>
                </div>

                {/* Skills */}
                <div className="space-y-4">
                  {catSkills.map(skill => (
                    <SkillBar key={skill._id} skill={skill} animate={animated} />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}