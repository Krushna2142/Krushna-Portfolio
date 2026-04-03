'use client'
import dynamic      from 'next/dynamic'
import Navbar       from '@/components/layout/Navbar'
import Hero         from '@/components/sections/Hero'
import Skills       from '@/components/sections/Skills'
import Projects     from '@/components/sections/Projects'
import Services     from '@/components/sections/Services'
import Contact      from '@/components/sections/Contact'
import { usePortfolioData } from '@/hooks/usePortfolioData'

const ParticleScene = dynamic(
  () => import('@/components/three/Particlescene'),
  { ssr: false }
)

export default function Portfolio() {
  const { projects, skills, config, loading } = usePortfolioData()

  return (
    <main className="relative bg-[var(--dark-900)] min-h-screen">
      <ParticleScene />
      <Navbar />

      {config.hero_visible !== false && <Hero />}

      {!loading && skills.length > 0 && config.skills_visible !== false && (
        <Skills skills={skills} />
      )}

      {!loading && projects.length > 0 && config.projects_visible !== false && (
        <Projects projects={projects} />
      )}

      {config.services_visible !== false && <Services />}

      {config.contact_visible !== false && <Contact />}

      <footer className="border-t border-white/[0.04] py-8 px-6 text-center">
        <p className="font-mono text-[0.65rem] text-white/18 tracking-widest">
          DESIGNED &amp; BUILT BY{' '}
          <span className="neon-text-cyan">KRUSHNA POKHARKAR</span>
          {' '}·{' '}
          <span className="text-white/12">{new Date().getFullYear()}</span>
        </p>
      </footer>
    </main>
  )
}