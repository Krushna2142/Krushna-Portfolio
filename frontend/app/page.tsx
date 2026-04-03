'use client'
import dynamic from 'next/dynamic'
import Navbar         from '@/components/layout/Navbar'
import Hero           from '@/components/sections/Hero'
import Skills         from '@/components/sections/Skills'
import Projects       from '@/components/sections/Projects'
import Certifications from '@/components/sections/Certifications'
import Contact        from '@/components/sections/Contact'
import { usePortfolioData } from '@/hooks/usePortfolioData'

const ParticleScene = dynamic(
  () => import('@/components/three/Particlescene'),
  { ssr: false }
)

export default function Portfolio() {
  const { projects, skills, certs, config, loading } = usePortfolioData()

  return (
    <main className="relative bg-dark-900 min-h-screen">
      <ParticleScene />
      <Navbar />

      {config.hero_visible !== false && <Hero />}

      {!loading && skills.length > 0 && config.skills_visible !== false && (
        <Skills skills={skills} />
      )}

      {!loading && projects.length > 0 && config.projects_visible !== false && (
        <Projects projects={projects} />
      )}

      {!loading && certs.length > 0 && config.certifications_visible !== false && (
        <Certifications certs={certs} />
      )}

      {config.contact_visible !== false && <Contact />}

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer
        className="py-10 px-6 text-center relative"
        style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
      >
        {/* Top fade line */}
        <div
          className="absolute top-0 left-1/4 right-1/4 h-px rounded-full"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(0,245,255,0.15), transparent)' }}
        />

        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-mono text-xs text-white/18">
            Designed &amp; Built by{' '}
            <span className="neon-text-cyan">Krushna Pokharkar</span>
            {' '}·{' '}
            <span className="text-white/12">{new Date().getFullYear()}</span>
          </p>

          <div className="flex items-center gap-4">
            <p className="font-mono text-[10px] text-white/12 tracking-widest">
              FULL·STACK · AI · ENGINEER
            </p>
            {/*
              Admin portal — intentionally low visibility.
              Alternatively, access via clicking the KP logo × 5 in the navbar.
            */}
            <a
              href="/admin"
              aria-label="Admin"
              className="font-mono text-[9px] tracking-widest transition-colors duration-500"
              style={{ color: 'rgba(255,255,255,0.06)' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'rgba(191,0,255,0.4)' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.06)' }}
            >
              ·
            </a>
          </div>
        </div>
      </footer>
    </main>
  )
}