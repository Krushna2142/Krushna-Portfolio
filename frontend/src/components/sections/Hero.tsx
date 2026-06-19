'use client'
import { Canvas, useFrame } from '@react-three/fiber'
import { MeshDistortMaterial, Sphere } from '@react-three/drei'
import { motion } from 'framer-motion'
import { useRef, Suspense, useEffect, useState } from 'react'
import axios from 'axios'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

function AnimatedBlob() {
  const meshRef = useRef<any>(null)
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.1
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.15
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2
    }
  })
  return (
    <Sphere ref={meshRef} args={[1, 32, 32]} scale={2.5}>
      <MeshDistortMaterial color="#1a1a1a" distort={0.4} speed={1.5} roughness={0.2} metalness={0.9} />
    </Sphere>
  )
}

export default function Hero() {
  const [config, setConfig] = useState<any>({})
  const [profileImage, setProfileImage] = useState<string>('/profile.jpeg')

  useEffect(() => {
    axios.get(`${API_BASE}/config`)
      .then(res => {
        const data = res.data.data || {}
        setConfig(data)
        if (data.profile_image) {
          setProfileImage(data.profile_image)
        }
      })
      .catch(err => console.error('Failed to load config', err))
  }, [])

  const title = config.hero_title || "Hi, I'm Krushna"
  const subtitle = config.hero_subtitle || "Full-Stack Developer & AI Engineer"
  const description = config.hero_description || "I craft intelligent, scalable web applications and AI-powered solutions that transform complex problems into elegant experiences."
  const accentColor = config.accent_color || '#00e5ff'

  return (
    <section id="home" className="relative min-h-screen w-full flex items-center justify-center overflow-hidden pt-20">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0 opacity-60">
        <Canvas camera={{ position: [0, 0, 5] }} dpr={[1, 1.5]}>
          <Suspense fallback={null}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={2} color={accentColor} />
            <AnimatedBlob />
          </Suspense>
        </Canvas>
      </div>

      <div className="relative z-10 container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
          {/* Profile Picture */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: -50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="relative flex-shrink-0"
          >
            <div className="relative w-64 h-64 md:w-80 md:h-80">
              <div className="absolute inset-0 rounded-full backdrop-blur-xl bg-gradient-to-br from-[var(--accent)]/20 to-[var(--accent-2)]/20 border border-white/20 p-1">
                <div className="w-full h-full rounded-full overflow-hidden bg-black/50 backdrop-blur-sm">
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/profile.jpeg'
                    }}
                  />
                </div>
              </div>
              <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] opacity-20 blur-xl animate-pulse" />
            </div>
          </motion.div>

          {/* Text Content */}
          <div className="flex-1 text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
            >
              <p
                className="tracking-[0.3em] uppercase mb-4 text-sm md:text-base font-semibold"
                style={{ color: accentColor }}
              >
                {subtitle}
              </p>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.9] mb-6">
                {title.split(' ').map((word: string, i: number) => {
                  const isLast = i === title.split(' ').length - 1
                  return (
                    <span
                      key={i}
                      className={isLast ? 'bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] bg-clip-text text-transparent' : ''}
                    >
                      {word}{' '}
                    </span>
                  )
                })}
              </h1>
              <p className="text-[var(--muted)] text-lg md:text-xl max-w-2xl mb-8 leading-relaxed">
                {description}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <motion.a
                  href="#work"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 font-bold rounded-full hover:shadow-[0_0_40px_rgba(0,229,255,0.4)] transition-all duration-300 text-center text-black"
                  style={{ backgroundColor: accentColor }}
                  data-cursor-hover
                >
                  View My Work
                </motion.a>
                <motion.a
                  href={config.resume_url || '#contact'}
                  target={config.resume_url ? '_blank' : undefined}
                  rel={config.resume_url ? 'noopener noreferrer' : undefined}
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 backdrop-blur-xl bg-white/5 border border-white/20 text-white font-bold rounded-full hover:border-[var(--accent)]/50 transition-all duration-300 text-center"
                  data-cursor-hover
                >
                  {config.resume_url ? '📄 Download Resume' : '💬 Let\'s Talk'}
                </motion.a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <div className="w-6 h-10 border-2 border-[var(--muted)]/50 rounded-full flex justify-center pt-2 backdrop-blur-sm">
          <div className="w-1 h-2 bg-[var(--accent)] rounded-full" />
        </div>
      </motion.div>
    </section>
  )
}