'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'

export default function ProjectCard({ project, index }: { project: any, index: number }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 100, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.76, 0, 0.24, 1] }}
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-cursor-hover
    >
      <Link href={`/projects/${project.id}`} className="block">
        <div
          className="relative aspect-video rounded-3xl overflow-hidden backdrop-blur-xl bg-white/5 border border-white/10 cursor-pointer"
        >
          <motion.img
            src={project.thumbnail || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800'}
            alt={project.title}
            className="w-full h-full object-cover"
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.5 }}
            transition={{ duration: 0.4 }}
            className="absolute top-4 left-4 w-16 h-16 border-t-2 border-l-2 border-[var(--accent)]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.5 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="absolute bottom-4 right-4 w-16 h-16 border-b-2 border-r-2 border-[var(--accent-2)]"
          />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end p-8"
          >
            <div>
              <span className="inline-block px-4 py-2 rounded-full bg-[var(--accent)]/20 border border-[var(--accent)]/50 text-[var(--accent)] text-sm mb-3">
                {project.category}
              </span>
              <h3 className="text-2xl font-bold text-white">{project.title}</h3>
              <p className="text-white/70 text-sm mt-2">Click to explore →</p>
            </div>
          </motion.div>

          <div className="absolute top-6 right-6 px-4 py-2 rounded-full backdrop-blur-xl bg-black/50 border border-white/20 text-xs font-medium">
            {project.featured ? '⭐ Featured' : project.category}
          </div>
        </div>

        <div className="mt-6 px-2">
          <h3 className="text-2xl md:text-3xl font-bold mb-3 group-hover:text-[var(--accent)] transition-colors">
            {project.title}
          </h3>
          <p className="text-[var(--muted)] line-clamp-2 mb-4">{project.description}</p>
          <div className="flex flex-wrap gap-2">
            {(project.techStack || []).slice(0, 5).map((tech: string) => (
              <span
                key={tech}
                className="px-3 py-1.5 rounded-lg backdrop-blur-sm bg-white/5 border border-white/10 text-xs text-[var(--muted)]"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}