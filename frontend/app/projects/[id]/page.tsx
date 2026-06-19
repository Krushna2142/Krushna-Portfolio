'use client'
import { motion } from 'framer-motion'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import axios from 'axios'
import ImageCarousel from '@/components/ImageCarousel'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function ProjectDetail() {
  const { id } = useParams()
  const router = useRouter()
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get(`${API_BASE}/projects`)
      .then(res => {
        const found = (res.data.data || []).find((p: any) => p.id === id)
        setProject(found || null)
      })
      .catch(err => console.error('Failed to fetch project', err))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[var(--accent)] animate-pulse">Loading...</div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Project Not Found</h2>
          <button onClick={() => router.push('/#work')} className="text-[var(--accent)] hover:underline">
            ← Back to Projects
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 md:px-12 relative z-10">
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => router.push('/#work')}
        className="inline-flex items-center gap-2 text-[var(--accent)] hover:underline mb-12 text-lg cursor-pointer"
      >
        ← Back to Projects
      </motion.button>

      {/* Image Carousel */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <ImageCarousel
          images={project.images || []}
          thumbnail={project.thumbnail}
        />
      </motion.div>

      <div className="max-w-5xl mx-auto mt-12">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="text-[var(--accent)] tracking-[0.3em] uppercase text-sm font-semibold">
              {project.category}
            </span>
            {project.featured && (
              <span className="px-3 py-1 rounded-full bg-[var(--accent)]/20 text-[var(--accent)] text-xs">
                ⭐ Featured
              </span>
            )}
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">{project.title}</h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-xl md:text-2xl text-[var(--muted)] leading-relaxed mb-12"
        >
          {project.longDescription || project.description}
        </motion.p>

        {project.features && project.features.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mb-12">
            <h2 className="text-3xl font-bold mb-8">Key Features</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {project.features.map((feature: string, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.05 }}
                  className="flex items-start gap-3 p-4 rounded-xl backdrop-blur-xl bg-white/5 border border-white/10"
                >
                  <span className="w-2 h-2 rounded-full bg-[var(--accent)] mt-2 flex-shrink-0" />
                  <span className="text-[var(--muted)] leading-relaxed">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="mb-12">
          <h2 className="text-3xl font-bold mb-8">Tech Stack</h2>
          <div className="flex flex-wrap gap-3">
            {(project.techStack || []).map((tech: string, i: number) => (
              <motion.span
                key={tech}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + i * 0.05 }}
                className="px-6 py-3 rounded-full backdrop-blur-xl bg-white/5 border border-white/10 hover:border-[var(--accent)]/50 hover:bg-[var(--accent)]/10 transition-all duration-300"
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {(project.liveUrl || project.githubUrl) && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            {project.liveUrl && (
              <motion.a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-[var(--accent)] text-black font-bold rounded-full text-center hover:shadow-[0_0_40px_rgba(0,229,255,0.4)] transition-all"
                data-cursor-hover
              >
                🌐 View Live Demo
              </motion.a>
            )}
            {project.githubUrl && (
              <motion.a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 backdrop-blur-xl bg-white/5 border border-white/20 text-white font-bold rounded-full text-center hover:border-[var(--accent)]/50 transition-all"
                data-cursor-hover
              >
                💻 View Source Code
              </motion.a>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}