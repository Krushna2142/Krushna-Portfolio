'use client'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import ProjectCard from '@/components/ui/ProjectCard'
import axios from 'axios'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function Work() {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get(`${API_BASE}/projects`)
      .then(res => setProjects(res.data.data || []))
      .catch(err => console.error('Failed to fetch projects', err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <section id="work" className="py-32 px-6 md:px-12">
        <div className="text-center text-[var(--accent)] animate-pulse">Loading projects...</div>
      </section>
    )
  }

  return (
    <section id="work" className="py-32 px-6 md:px-12 relative z-10">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.p
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-[var(--accent)] tracking-[0.3em] uppercase mb-4 text-sm font-semibold"
          >
            Portfolio
          </motion.p>
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6">
            Selected <span className="text-[var(--accent)]">Works</span>
          </h2>
          <p className="text-[var(--muted)] text-lg max-w-2xl mx-auto">
            A curated collection of {projects.length} projects showcasing my expertise
          </p>
        </motion.div>

        {projects.length === 0 ? (
          <div className="text-center text-[var(--muted)] py-20">
            No projects yet. Add some from the admin panel!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <motion.a
            href="https://github.com/krushna2142"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full backdrop-blur-xl bg-white/5 border border-white/10 text-white font-medium hover:border-[var(--accent)]/50 transition-all duration-300"
            data-cursor-hover
          >
            View More on GitHub
            <span className="text-[var(--accent)]">→</span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}