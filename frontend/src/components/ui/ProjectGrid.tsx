'use client'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import axios from 'axios'

export default function ProjectGrid() {
  const [projects, setProjects] = useState([])

  useEffect(() => {
    // Fetch from your existing Node backend!
    axios.get('http://localhost:5000/api/projects').then(res => {
      setProjects(res.data.data)
    })
  }, [])

  return (
    <section className="py-32 px-6 md:px-12 relative z-10">
      <h2 className="text-5xl md:text-7xl font-bold mb-20">Selected Works</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {projects.map((project: any, i) => (
          <ProjectCard key={project._id} project={project} index={i} />
        ))}
      </div>
    </section>
  )
}

function ProjectCard({ project, index }: { project: any, index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="group relative overflow-hidden rounded-3xl bg-[#111] border border-white/5"
      data-cursor-hover
    >
      {/* Image Container with Zoom on Hover */}
      <div className="aspect-video overflow-hidden">
        <motion.img 
          src={project.thumbnail || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800'} 
          alt={project.title}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      {/* Content Overlay */}
      <div className="p-8">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-3xl font-bold group-hover:text-[var(--accent)] transition-colors duration-300">
            {project.title}
          </h3>
          <span className="text-xs px-3 py-1 rounded-full bg-white/10 text-[var(--muted)]">
            {project.category}
          </span>
        </div>
        <p className="text-[var(--muted)] line-clamp-2">{project.description}</p>
        
        {/* Tech Stack Pills */}
        <div className="flex flex-wrap gap-2 mt-6">
          {project.techStack?.slice(0, 4).map((tech: string) => (
            <span key={tech} className="text-xs px-2 py-1 rounded bg-white/5 border border-white/10">
              {tech}
            </span>
          ))}
        </div>
      </div>
      
      {/* Hover Gradient Glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none bg-gradient-to-tr from-[var(--accent)] to-transparent" />
    </motion.div>
  )
}