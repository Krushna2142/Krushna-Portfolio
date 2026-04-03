'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'

const LINKS = [
  { label: 'About',    href: '#about'    },
  { label: 'Skills',   href: '#skills'   },
  { label: 'Projects', href: '#projects' },
  { label: 'Certs',    href: '#certs'    },
  { label: 'Contact',  href: '#contact'  },
]

// Secret: click the logo 5 times rapidly to access admin
const SECRET_CLICKS = 5
const SECRET_WINDOW_MS = 3000

export default function Navbar() {
  const router = useRouter()
  const [scrolled,   setScrolled]   = useState(false)
  const [menuOpen,   setMenuOpen]   = useState(false)
  const [active,     setActive]     = useState('')
  const [logoGlow,   setLogoGlow]   = useState<string | null>(null)

  const clickCountRef = useRef(0)
  const clickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ── Scroll + active section tracking ─────────────────────
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })

    const sections = document.querySelectorAll('section[id]')
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id) }),
      { threshold: 0.35, rootMargin: '-80px 0px 0px 0px' }
    )
    sections.forEach(s => obs.observe(s))

    return () => {
      window.removeEventListener('scroll', onScroll)
      obs.disconnect()
    }
  }, [])

  // ── Secret logo click handler ─────────────────────────────
  const handleLogoClick = useCallback(() => {
    // Normal scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' })

    clickCountRef.current += 1

    // Visual feedback — brief purple glow pulse
    setLogoGlow('purple')
    setTimeout(() => setLogoGlow(null), 300)

    if (clickTimerRef.current) clearTimeout(clickTimerRef.current)

    if (clickCountRef.current >= SECRET_CLICKS) {
      // Secret unlocked — flash green, then navigate
      setLogoGlow('green')
      clickCountRef.current = 0
      setTimeout(() => {
        setLogoGlow(null)
        router.push('/admin')
      }, 400)
      return
    }

    // Reset counter if no click within window
    clickTimerRef.current = setTimeout(() => {
      clickCountRef.current = 0
    }, SECRET_WINDOW_MS)
  }, [router])

  const scrollTo = (href: string) => {
    setMenuOpen(false)
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  const glowColor =
    logoGlow === 'green'  ? 'rgba(0,255,136,0.8)' :
    logoGlow === 'purple' ? 'rgba(191,0,255,0.6)'  :
    'transparent'

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-dark-900/75 backdrop-blur-2xl border-b border-white/[0.04]'
          : 'bg-transparent'
      }`}
    >
      {/* Top edge accent line */}
      {scrolled && (
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(0,245,255,0.4) 30%, rgba(191,0,255,0.4) 70%, transparent 100%)',
          }}
        />
      )}

      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* ── Logo (secret admin trigger) ───────────────────── */}
        <button
          onClick={handleLogoClick}
          title="Krushna Pokharkar"
          className="font-mono text-sm group flex items-center gap-1 relative select-none"
          style={{ transition: 'filter 0.3s ease' }}
        >
          {/* Corner decorators */}
          <span
            className="absolute -inset-2 rounded pointer-events-none transition-all duration-300"
            style={{
              boxShadow: logoGlow ? `0 0 12px ${glowColor}` : 'none',
              border: logoGlow ? `1px solid ${glowColor}` : '1px solid transparent',
              opacity: logoGlow ? 1 : 0,
            }}
          />
          <span className="text-white/25 group-hover:text-white/45 transition-colors">&lt;</span>
          <span
            className="font-bold transition-all duration-300"
            style={{
              color: logoGlow === 'green' ? 'var(--neon-green)' :
                     logoGlow === 'purple' ? 'var(--neon-purple)' :
                     'var(--neon-cyan)',
              textShadow: logoGlow ? `0 0 16px ${glowColor}` : '0 0 20px rgba(0,245,255,0.6)',
            }}
          >
            KP
          </span>
          <span className="text-white/25 group-hover:text-white/45 transition-colors">/&gt;</span>
        </button>

        {/* ── Desktop Nav ───────────────────────────────────── */}
        <div className="hidden md:flex items-center gap-1">
          {LINKS.map(({ label, href }) => {
            const isActive = active === href.slice(1)
            return (
              <button
                key={href}
                onClick={() => scrollTo(href)}
                className="relative px-4 py-2 rounded-lg font-mono text-xs transition-all duration-300 group"
                style={{
                  color: isActive ? 'var(--neon-cyan)' : 'rgba(255,255,255,0.38)',
                  border: `1px solid ${isActive ? 'rgba(0,245,255,0.25)' : 'transparent'}`,
                  background: isActive ? 'rgba(0,245,255,0.06)' : 'transparent',
                }}
              >
                {/* Hover underline */}
                <span
                  className="absolute bottom-1 left-4 right-4 h-px scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                  style={{ background: 'var(--neon-cyan)' }}
                />
                <span className="relative group-hover:text-white/70 transition-colors">
                  {label}
                </span>
              </button>
            )
          })}

          {/* Status indicator */}
          <div className="ml-4 flex items-center gap-2 px-3 py-1.5 rounded-full border border-neon-green/20 bg-neon-green/[0.04]">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
            <span className="font-mono text-[10px] text-neon-green/70">Open to Work</span>
          </div>
        </div>

        {/* ── Mobile toggle ─────────────────────────────────── */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2 z-50"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block h-px w-5 transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[7px] bg-neon-cyan' : 'bg-white/40'}`} />
          <span className={`block h-px w-5 transition-all duration-300 ${menuOpen ? 'opacity-0' : 'bg-white/40'}`} />
          <span className={`block h-px w-5 transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[7px] bg-neon-cyan' : 'bg-white/40'}`} />
        </button>
      </div>

      {/* ── Mobile Menu ───────────────────────────────────────── */}
      <div className={`md:hidden overflow-hidden transition-all duration-400 ease-in-out ${menuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div
          className="border-b border-white/[0.04] px-6 pb-5 pt-2 flex flex-col gap-1"
          style={{ background: 'rgba(2,4,8,0.95)', backdropFilter: 'blur(24px)' }}
        >
          {LINKS.map(({ label, href }) => (
            <button
              key={href}
              onClick={() => scrollTo(href)}
              className="text-left px-4 py-3 rounded-xl font-mono text-sm text-white/45
                         hover:text-neon-cyan hover:bg-neon-cyan/[0.06] transition-all duration-200"
            >
              <span className="text-neon-cyan/40 mr-2 text-xs">→</span>
              {label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}