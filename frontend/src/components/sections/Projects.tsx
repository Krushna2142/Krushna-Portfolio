'use client'
import { useState } from 'react'
import type { Project } from '@/types'

const CAT_COLOR: Record<string, string> = {
  AI:      '#00f5ff',
  Web:     '#bf00ff',
  Mobile:  '#ff0080',
  Backend: '#00ff88',
  Other:   '#ffffff',
}

const CAT_ICON: Record<string, string> = {
  AI: '🤖', Web: '🌐', Mobile: '📱', Backend: '⚙️', Other: '💡',
}

function ProjectCard({ project }: { project: Project }) {
  const [hovered, setHovered] = useState(false)
  const color = CAT_COLOR[project.category] || '#00f5ff'

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex flex-col"
      style={{
        padding: '1.5rem',
        borderRadius: '16px',
        backdropFilter: 'blur(20px)',
        background: hovered ? `rgba(255,255,255,0.05)` : 'rgba(255,255,255,0.03)',
        border: `1px solid ${hovered ? `${color}30` : 'rgba(255,255,255,0.07)'}`,
        boxShadow: hovered
          ? `0 24px 60px rgba(0,0,0,0.6), 0 0 50px ${color}12`
          : '0 8px 32px rgba(0,0,0,0.4)',
        transform: hovered ? 'translateY(-6px) scale(1.005)' : 'translateY(0) scale(1)',
        transition: 'all 0.35s cubic-bezier(0.23,1,0.32,1)',
        cursor: 'default',
        gap: '1.25rem',
      }}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center text-lg flex-shrink-0"
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: `${color}10`,
              border: `1px solid ${color}22`,
            }}
          >
            {CAT_ICON[project.category]}
          </div>
          {project.featured && (
            <span
              className="font-mono text-[0.62rem] px-2 py-0.5 rounded-full tracking-wider"
              style={{ color, background: `${color}10`, border: `1px solid ${color}22` }}
            >
              ★ FEATURED
            </span>
          )}
        </div>
        <span
          className="font-mono text-[0.62rem] px-2.5 py-1 rounded-lg flex-shrink-0 tracking-widest"
          style={{ color, background: `${color}08`, border: `1px solid ${color}18` }}
        >
          {project.category}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 space-y-2.5">
        <h3
          className="text-white font-bold leading-snug"
          style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', letterSpacing: '0.03em', lineHeight: 1.3 }}
        >
          {project.title}
        </h3>
        <p
          className="text-white/42 leading-relaxed"
          style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', lineHeight: 1.75 }}
        >
          {project.description}
        </p>
      </div>

      {/* Tech stack */}
      <div className="flex flex-wrap gap-1.5">
        {project.techStack.slice(0, 5).map(tech => (
          <span
            key={tech}
            className="font-mono text-[0.65rem] px-2 py-0.5 rounded border border-white/[0.07] text-white/30 hover:text-white/55 hover:border-white/18 transition-colors cursor-default"
          >
            {tech}
          </span>
        ))}
        {project.techStack.length > 5 && (
          <span className="font-mono text-[0.65rem] px-2 py-0.5 rounded border border-white/[0.05] text-white/22">
            +{project.techStack.length - 5} more
          </span>
        )}
      </div>

      {/* Links */}
      <div className="flex items-center gap-4 pt-3 border-t border-white/[0.05]">
        {project.githubUrl ? (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[0.72rem] text-white/32 hover:text-white/65 transition-colors"
          >
            GitHub ↗
          </a>
        ) : (
          <span className="font-mono text-[0.72rem] text-white/18">Private Repo</span>
        )}
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[0.72rem] ml-auto hover:opacity-70 transition-opacity"
            style={{ color }}
          >
            Live Demo ↗
          </a>
        )}
      </div>
    </div>
  )
}

export default function Projects({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState('All')
  const categories = ['All', ...Array.from(new Set(projects.map(p => p.category)))]
  const filtered   = filter === 'All' ? projects : projects.filter(p => p.category === filter)

  return (
    <section id="projects" className="section-padding relative">
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] pointer-events-none"
        style={{ background: 'radial-gradient(circle at bottom left, rgba(0,245,255,0.04), transparent 70%)' }} />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Header */}
        <div className="mb-12">
          <p className="section-eyebrow text-[var(--neon-purple)]">// 03. WHAT I&apos;VE BUILT</p>
          <h2 className="section-title">
            <span className="text-white">Featured </span>
            <span className="neon-text-cyan">Projects</span>
          </h2>
        </div>

        {/* Filter */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map(cat => {
            const color  = CAT_COLOR[cat] || '#00f5ff'
            const active = filter === cat
            return (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className="px-4 py-2 rounded-xl font-mono text-[0.72rem] tracking-wider transition-all duration-300"
                style={{
                  border:    `1px solid ${active ? color : 'rgba(255,255,255,0.07)'}`,
                  color:      active ? color : 'rgba(255,255,255,0.32)',
                  background: active ? `${color}10` : 'transparent',
                  boxShadow:  active ? `0 0 16px ${color}20` : 'none',
                }}
              >
                {cat}
              </button>
            )
          })}
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(project => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      </div>
    </section>
  )
}