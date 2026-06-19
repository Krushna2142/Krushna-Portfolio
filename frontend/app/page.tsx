'use client'
import { useEffect, useState } from 'react'
import Hero from '@/components/sections/Hero'
import About from '@/components/sections/About'
import Skills from '@/components/sections/Skills'
import Work from '@/components/sections/Work'
import Contact from '@/components/sections/Contact'
import Footer from '@/components/layout/Footer'
import FloatingNav from '@/components/layout/FloatingNav'
import Marquee from '@/components/sections/Marquee'
import axios from 'axios'
import Services from '@/components/sections/Services'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function Home() {
  const [config, setConfig] = useState<any>({})

  useEffect(() => {
    axios.get(`${API_BASE}/config`)
      .then(res => setConfig(res.data.data || {}))
      .catch(err => console.error('Failed to fetch config', err))
  }, [])

  // If maintenance mode is on, show maintenance page
  if (config.maintenance_mode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
        <div className="text-center p-8">
          <h1 className="text-5xl font-bold mb-4"> Under Maintenance</h1>
          <p className="text-[var(--muted)] text-lg">We'll be back shortly!</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <FloatingNav />
      {config.hero_visible !== false && <Hero />}
      {config.about_visible !== false && <About />}
      <Marquee />
      {config.services_visible !== false && <Services />}
      {config.projects_visible !== false && <Work />}
      {config.skills_visible !== false && <Skills />}
      {config.contact_visible !== false && <Contact />}
      <Footer />
    </>
  )
}