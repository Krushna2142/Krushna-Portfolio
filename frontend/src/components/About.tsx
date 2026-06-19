'use client'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import axios from 'axios'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const stats = [
  { label: 'Years Experience', value: '3+' },
  { label: 'Projects Completed', value: '20+' },
  { label: 'Happy Clients', value: '15+' },
]

export default function About() {
  const [skillsCount, setSkillsCount] = useState(0)

  useEffect(() => {
    axios.get(`${API_BASE}/skills`)
      .then(res => setSkillsCount(res.data.data?.length || 0))
      .catch(() => setSkillsCount(25))
  }, [])

  const allStats = [...stats, { label: 'Technologies', value: `${skillsCount}+` }]

  return (
    <section id="about" className="py-32 px-6 md:px-12 relative z-10">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-5xl md:text-7xl font-bold mb-16 text-center">
            About <span className="text-[var(--accent)]">Me</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div className="space-y-6">
              <p className="text-lg text-[var(--muted)] leading-relaxed">
                I'm a passionate Full-Stack Developer and AI Engineer with expertise in building 
                scalable web applications and intelligent automation systems.
              </p>
              <p className="text-lg text-[var(--muted)] leading-relaxed">
                I specialize in modern JavaScript technologies, AI/ML integration, and cloud 
                architecture. Whether it's building a no-code workflow automation platform or 
                developing agentic AI systems, I love turning complex problems into simple solutions.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {allStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 hover:border-[var(--accent)]/50 transition-all duration-300 group"
                >
                  <h3 className="text-4xl font-bold text-[var(--accent)] mb-2 group-hover:scale-110 transition-transform">
                    {stat.value}
                  </h3>
                  <p className="text-sm text-[var(--muted)]">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}