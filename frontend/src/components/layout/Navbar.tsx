'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

const LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Services', href: '#services' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('')
  const navRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)

    const sections = document.querySelectorAll('section[id]')
    const obs = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) setActive(e.target.id)
        })
      },
      { threshold: 0.4 }
    )
    sections.forEach(s => obs.observe(s))

    return () => {
      window.removeEventListener('scroll', onScroll)
      obs.disconnect()
    }
  }, [])

  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  // 🔥 Magnetic hover effect
  const handleMouseMove = (e: any, el: HTMLButtonElement) => {
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2

    el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`
  }

  const resetMagnet = (el: HTMLButtonElement) => {
    el.style.transform = `translate(0px, 0px)`
  }

  return (
    <div className="fixed top-4 left-0 right-0 z-50 flex justify-center">
      
      {/* Floating Container */}
      <motion.div
        ref={navRef}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-2xl
          border border-white/10
          backdrop-blur-2xl
          transition-all duration-500
          ${scrolled 
            ? 'bg-[rgba(1,4,9,0.75)] shadow-[0_8px_30px_rgba(0,0,0,0.4)]' 
            : 'bg-[rgba(1,4,9,0.4)]'}
        `}
      >

        {/* Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="px-3 py-2 font-display font-bold tracking-widest text-sm text-white/70 hover:text-white transition"
        >
          &lt;KP/&gt;
        </button>

        {/* Links */}
        <div className="relative flex items-center gap-1">

          {/* Active Indicator */}
          <motion.div
            layoutId="active-pill"
            className="absolute inset-0 bg-[rgba(0,245,255,0.08)] border border-[rgba(0,245,255,0.25)] rounded-xl"
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            style={{
              width: 'auto',
              height: '100%',
              opacity: active ? 1 : 0,
            }}
          />

          {LINKS.map(({ label, href }) => {
            const isActive = active === href.slice(1)

            return (
              <button
                key={href}
                onClick={() => scrollTo(href)}
                onMouseMove={(e) => handleMouseMove(e, e.currentTarget)}
                onMouseLeave={(e) => resetMagnet(e.currentTarget)}
                className={`
                  relative px-5 py-2.5 rounded-xl
                  font-mono text-[0.72rem]
                  tracking-[0.12em]
                  transition-all duration-300
                  ${isActive 
                    ? 'text-[var(--neon-cyan)]' 
                    : 'text-white/40 hover:text-white'}
                `}
              >
                {isActive && (
                  <motion.div
                    layoutId="pill"
                    className="absolute inset-0 rounded-xl"
                  />
                )}
                <span className="relative z-10">{label}</span>
              </button>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}