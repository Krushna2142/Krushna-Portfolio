'use client'
import { useState, useRef, useCallback } from 'react'
import type { Project } from '@/types'

const CAT_META: Record<string, { color: string; icon: string }> = {
  AI:      { color: '#00f5ff', icon: '🤖' },
  Web:     { color: '#bf00ff', icon: '🌐' },
  Mobile:  { color: '#ff0080', icon: '📱' },
  Backend: { color: '#00ff88', icon: '⚙️' },
  Other:   { color: '#ffffff', icon: '💡' },
}

// ── 3D tilt + holographic project card ────────────────────────
function ProjectCard({ project }: { project: Project }) {
  const ref  = useRef<HTMLDivElement>(null)
  const meta = CAT_META[project.category] || CAT_META.Other

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 16
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * -16
    el.style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${y}deg) translateZ(12px)`
    el.style.boxShadow =
      `0 32px 64px rgba(0,0,0,0.65),
       0 0 0 1px ${meta.color}18,
       0 0 50px ${meta.color}12`
  }, [meta.color])

  const onMouseLeave = useCallback(() => {
    const el = ref.current
    if (!el) return
    el.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateZ(0)'
    el.style.boxShadow = ''
  }, [])

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="glass-card p-6 flex flex-col gap-5 cursor-default"
      style={{
        borderColor: `${meta.color}10`,
        transition: 'transform 0.12s ease, box-shadow 0.3s ease',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* ── Card header ─────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Category icon with glow */}
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 transition-transform duration-300"
            style={{
              background: `${meta.color}0d`,
              border: `1px solid ${meta.color}20`,
              boxShadow: `0 0 16px ${meta.color}15, inset 0 0 8px ${meta.color}05`,
            }}
          >
            {meta.icon}
          </div>

          {project.featured && (
            <span
              className="font-mono text-[10px] px-2 py-0.5 rounded-full tracking-widest uppercase"
              style={{
                color: meta.color,
                background: `${meta.color}0d`,
                border: `1px solid ${meta.color}25`,
                textShadow: `0 0 8px ${meta.color}60`,
                boxShadow: `0 0 12px ${meta.color}15`,
              }}
            >
              ★ Featured
            </span>
          )}
        </div>

        {/* Category label */}
        <span
          className="font-mono text-[10px] px-2.5 py-1 rounded-lg shrink-0 tracking-wider uppercase"
          style={{
            color: meta.color,
            background: `${meta.color}0a`,
            border: `1px solid ${meta.color}18`,
          }}
        >
          {project.category}
        </span>
      </div>

      {/* ── Content ──────────────────────────────────────────── */}
      <div className="flex-1">
        <h3 className="font-display font-bold text-white text-lg leading-tight mb-2.5 tracking-tight">
          {project.title}
        </h3>
        <p className="text-white/40 text-[13px] leading-relaxed line-clamp-3">
          {project.description}
        </p>
      </div>

      {/* ── Tech stack ───────────────────────────────────────── */}
      <div className="flex flex-wrap gap-1.5">
        {project.techStack.slice(0, 5).map(tech => (
          <span
            key={tech}
            className="font-mono text-[11px] px-2 py-0.5 rounded-md transition-all duration-200
                       cursor-default hover:text-white/70"
            style={{
              border: '1px solid rgba(255,255,255,0.07)',
              color: 'rgba(255,255,255,0.3)',
              background: 'rgba(255,255,255,0.02)',
            }}
          >
            {tech}
          </span>
        ))}
        {project.techStack.length > 5 && (
          <span
            className="font-mono text-[11px] px-2 py-0.5 rounded-md"
            style={{
              border: '1px solid rgba(255,255,255,0.05)',
              color: 'rgba(255,255,255,0.18)',
            }}
          >
            +{project.techStack.length - 5}
          </span>
        )}
      </div>

      {/* ── Links ────────────────────────────────────────────── */}
      <div
        className="flex items-center gap-4 pt-4"
        style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
      >
        {project.githubUrl ? (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs text-white/30 hover:text-white/65
                       transition-colors duration-200 inline-flex items-center gap-1.5 group"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="opacity-60 group-hover:opacity-100">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
            GitHub
          </a>
        ) : (
          <span className="font-mono text-xs text-white/15">Private Repo</span>
        )}

        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs ml-auto transition-all duration-200 hover:opacity-80
                       inline-flex items-center gap-1"
            style={{
              color: meta.color,
              textShadow: `0 0 8px ${meta.color}40`,
            }}
          >
            Live Demo
            <span className="text-[10px] opacity-60">↗</span>
          </a>
        )}
      </div>

      {/* 3D depth gradient overlay */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          background: `linear-gradient(135deg, ${meta.color}04 0%, transparent 40%, rgba(0,0,0,0.1) 100%)`,
        }}
      />
    </div>
  )
}

export default function Projects({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState('All')

  const categories = ['All', ...Array.from(new Set(projects.map(p => p.category)))]
  const filtered   = filter === 'All' ? projects : projects.filter(p => p.category === filter)

  return (
    <section id="projects" className="section-padding relative overflow-hidden">

      {/* Background glow */}
      <div
        className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(0,245,255,0.03) 0%, transparent 70%)' }}
      />

      {/* Decorative shape */}
      <div
        className="absolute top-32 left-8 shape-float pointer-events-none"
        style={{
          width: 50, height: 50,
          border: '1px solid rgba(0,245,255,0.08)',
          borderRadius: '50%',
          animationDuration: '13s',
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* ── Section header ──────────────────────────────────── */}
        <div className="mb-14">
          <span className="section-eyebrow text-neon-cyan/50">// 03. What I&apos;ve Built</span>
          <h2 className="section-title">
            <span className="text-white">Featured </span>
            <span className="neon-text-cyan">Projects</span>
          </h2>
        </div>

        {/* ── Filter pills ────────────────────────────────────── */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map(cat => {
            const meta   = CAT_META[cat] || { color: '#00f5ff', icon: '' }
            const active = filter === cat
            return (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className="px-4 py-2 rounded-xl font-mono text-xs transition-all duration-250"
                style={{
                  border:     `1px solid ${active ? meta.color : 'rgba(255,255,255,0.07)'}`,
                  color:       active ? meta.color : 'rgba(255,255,255,0.32)',
                  background:  active ? `${meta.color}0d` : 'transparent',
                  boxShadow:   active ? `0 0 18px ${meta.color}20` : 'none',
                  transform:   active ? 'translateY(-1px)' : 'none',
                }}
              >
                {cat}
              </button>
            )
          })}
        </div>

        {/* ── Cards grid ──────────────────────────────────────── */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(project => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      </div>
    </section>
  )
}