'use client'
import { useState } from 'react'

interface Service {
  id: string
  icon: string
  title: string
  tagline: string
  description: string
  stack: string[]
  color: string
  features: string[]
}

const SERVICES: Service[] = [
  {
    id: 'agentic-ai',
    icon: '🤖',
    title: 'Agentic AI Systems',
    tagline: 'Autonomous reasoning pipelines',
    description: 'End-to-end agentic AI applications — from LLM tool-use and multi-agent orchestration to RAG pipelines, skill-gap analyzers, and adaptive interview bots.',
    stack: ['OpenAI API', 'LangChain', 'FastAPI', 'Python', 'MongoDB'],
    color: '#00f5ff',
    features: ['Multi-agent orchestration', 'RAG pipelines', 'LLM tool-use', 'Adaptive workflows'],
  },
  {
    id: 'fullstack',
    icon: '🌐',
    title: 'Full-Stack Web Apps',
    tagline: 'Production-grade MERN & Next.js',
    description: 'Complete web applications with scalable backends, responsive frontends, and robust auth — built for performance and deployed with CI/CD pipelines.',
    stack: ['Next.js', 'React', 'Node.js', 'Express', 'MongoDB', 'PostgreSQL'],
    color: '#bf00ff',
    features: ['REST & GraphQL APIs', 'Auth & RBAC', 'Real-time features', 'SEO optimized'],
  },
  {
    id: 'spring-boot',
    icon: '⚙️',
    title: 'Java Spring Boot APIs',
    tagline: 'Enterprise-grade microservices',
    description: 'Robust, microservices-ready Spring Boot backends with JWT auth, JPA repositories, and Spring AI integration for intelligent enterprise workflows.',
    stack: ['Spring Boot', 'Java', 'Spring AI', 'PostgreSQL', 'Docker'],
    color: '#00ff88',
    features: ['Microservices arch', 'JWT / OAuth2', 'Spring AI integration', 'Docker deployments'],
  },
  {
    id: 'mobile',
    icon: '📱',
    title: 'Mobile App Development',
    tagline: 'Cross-platform Flutter apps',
    description: 'Beautiful, performant mobile applications with Flutter — single codebase, native performance, Firebase integration, and seamless REST API connectivity.',
    stack: ['Flutter', 'Dart', 'Firebase', 'React Native', 'REST APIs'],
    color: '#ff0080',
    features: ['iOS & Android', 'Firebase backend', 'Offline support', 'Push notifications'],
  },
  {
    id: 'devops',
    icon: '🐳',
    title: 'DevOps & Cloud Infra',
    tagline: 'Container-first deployments',
    description: 'Dockerized applications, CI/CD pipeline setup, cloud deployments to AWS/GCP/Render, and production monitoring — from dev to prod with zero downtime.',
    stack: ['Docker', 'AWS', 'GCP', 'GitHub Actions', 'Nginx'],
    color: '#ff6b00',
    features: ['Docker & Compose', 'CI/CD pipelines', 'Cloud deployments', 'Health monitoring'],
  },
  {
    id: 'consulting',
    icon: '🧠',
    title: 'AI & System Consulting',
    tagline: 'Architecture & strategy',
    description: 'Technical consulting for teams integrating AI into existing products — system design, LLM selection, agent architecture, prompt engineering, and roadmap planning.',
    stack: ['System Design', 'LLM Selection', 'Prompt Engineering', 'Architecture'],
    color: '#00f5ff',
    features: ['AI integration audit', 'Prompt engineering', 'System design docs', 'Tech roadmaps'],
  },
]

export default function Services() {
  const [activeId, setActiveId] = useState<string | null>(null)

  return (
    <section id="services" className="section-padding relative">
      {/* Ambient */}
      <div
        className="absolute top-1/2 right-0 w-[500px] h-[500px] pointer-events-none -translate-y-1/2"
        style={{ background: 'radial-gradient(circle at right, rgba(0,255,136,0.04), transparent 70%)' }}
      />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Header */}
        <div className="mb-14">
          <p className="section-eyebrow text-[var(--neon-green)]">// 04. WHAT I BUILD FOR YOU</p>
          <h2 className="section-title">
            <span className="text-white">Services &amp; </span>
            <span className="neon-text-green">Offerings</span>
          </h2>
          <p className="section-subtitle">
            End-to-end engineering — from autonomous AI agents to production cloud deployments.
            Every engagement is custom-architected for scale.
          </p>
        </div>

        {/* Service grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map((service, idx) => {
            const isActive = activeId === service.id
            const { color } = service

            return (
              <div
                key={service.id}
                onClick={() => setActiveId(isActive ? null : service.id)}
                className="group relative flex flex-col cursor-pointer"
                style={{
                  padding: '1.75rem',
                  borderRadius: '16px',
                  backdropFilter: 'blur(20px)',
                  background: isActive ? `${color}08` : 'rgba(255,255,255,0.025)',
                  border: `1px solid ${isActive ? `${color}35` : 'rgba(255,255,255,0.07)'}`,
                  boxShadow: isActive
                    ? `0 20px 60px rgba(0,0,0,0.5), 0 0 40px ${color}15, inset 0 1px 0 rgba(255,255,255,0.07)`
                    : '0 8px 32px rgba(0,0,0,0.4)',
                  transform: isActive ? 'translateY(-4px)' : 'translateY(0)',
                  transition: 'all 0.4s cubic-bezier(0.23,1,0.32,1)',
                  animationDelay: `${idx * 0.05}s`,
                  gap: '1rem',
                }}
              >
                {/* Top accent line */}
                <div
                  className="absolute top-0 left-4 right-4 h-px"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
                    opacity: isActive ? 0.6 : 0.2,
                    transition: 'opacity 0.4s',
                  }}
                />

                {/* Icon + Color dot */}
                <div className="flex items-start justify-between">
                  <div
                    className="flex items-center justify-center text-2xl flex-shrink-0"
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '12px',
                      background: `${color}10`,
                      border: `1px solid ${color}22`,
                      transition: 'all 0.3s',
                      boxShadow: isActive ? `0 0 20px ${color}25` : 'none',
                    }}
                  >
                    {service.icon}
                  </div>
                  <span
                    className="font-mono text-[0.6rem] px-2.5 py-1 rounded-full tracking-widest flex-shrink-0"
                    style={{ color, background: `${color}10`, border: `1px solid ${color}20` }}
                  >
                    {idx < 5 ? `S-0${idx + 1}` : 'S-06'}
                  </span>
                </div>

                {/* Title */}
                <div className="space-y-1">
                  <h3
                    className="font-bold text-white"
                    style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', lineHeight: 1.3, letterSpacing: '0.03em' }}
                  >
                    {service.title}
                  </h3>
                  <p className="font-mono text-[0.65rem] tracking-wider" style={{ color }}>
                    {service.tagline}
                  </p>
                </div>

                {/* Description */}
                <p
                  className="text-white/45 leading-relaxed flex-1"
                  style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', lineHeight: 1.75 }}
                >
                  {service.description}
                </p>

                {/* Features — shown when active */}
                <div
                  style={{
                    maxHeight: isActive ? '200px' : '0',
                    overflow: 'hidden',
                    transition: 'max-height 0.4s cubic-bezier(0.23,1,0.32,1)',
                  }}
                >
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    {service.features.map(f => (
                      <div key={f} className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: color }} />
                        <span className="text-white/55 text-[0.68rem]" style={{ fontFamily: 'var(--font-mono)', lineHeight: 1.4 }}>
                          {f}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stack pills */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {service.stack.map(tech => (
                    <span
                      key={tech}
                      className="font-mono text-[0.62rem] px-2 py-0.5 rounded border border-white/[0.06] text-white/28 hover:text-white/50 hover:border-white/15 transition-colors cursor-default"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Expand hint */}
                <div className="flex items-center gap-1.5 pt-1">
                  <span
                    className="font-mono text-[0.62rem] tracking-wider"
                    style={{ color: `${color}70` }}
                  >
                    {isActive ? 'Click to collapse' : 'Click to expand →'}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* CTA */}
        <div
          className="mt-12 glass-card-elevated corner-accent"
          style={{ padding: '2.5rem', textAlign: 'center' }}
        >
          <p className="font-mono text-[0.65rem] text-[rgba(0,245,255,0.4)] tracking-[0.3em] uppercase mb-3">
            // OPEN FOR COLLABORATION
          </p>
          <h3
            className="text-white mb-3"
            style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, letterSpacing: '0.04em', lineHeight: 1.2 }}
          >
            Got a project in mind?
          </h3>
          <p
            className="text-white/40 mb-6 max-w-md mx-auto"
            style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', lineHeight: 1.75 }}
          >
            Available for SDE internships, AI research collaborations, and freelance engineering contracts.
            Response guaranteed within 24 hours.
          </p>
          <button
            onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-primary mx-auto"
          >
            Let&apos;s Build Together →
          </button>
        </div>
      </div>
    </section>
  )
}