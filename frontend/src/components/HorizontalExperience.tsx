'use client'
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const experiences = [
  { title: 'AI Engineer', company: 'Freelance', year: '2024 - Present', desc: 'Building agentic AI systems and LLM workflows.' },
  { title: 'Full-Stack Developer', company: 'Tech Startup', year: '2023 - 2024', desc: 'Architected Node/React platforms scaling to 100k users.' },
  { title: 'Backend Intern', company: 'Enterprise Corp', year: '2022 - 2023', desc: 'Optimized MongoDB queries and built RESTful APIs.' },
]

export default function HorizontalExperience() {
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Track scroll progress within this specific container
  const { scrollYProgress } = useScroll({ target: containerRef })
  
  // Map vertical scroll (0 to 1) to horizontal translation (0% to -66%)
  const x = useTransform(scrollYProgress, [0, 1], ['5%', '-66%'])

  return (
    <section ref={containerRef} className="h-[300vh] relative z-10">
      {/* Sticky container stays on screen while we scroll through the 300vh height */}
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <h2 className="absolute top-20 left-12 text-5xl font-bold z-20">Experience</h2>
        
        <motion.div style={{ x }} className="flex gap-10 pl-20 pt-20">
          {experiences.map((exp, i) => (
            <motion.div 
              key={i}
              className="w-[500px] h-[350px] bg-[#111] rounded-3xl flex-shrink-0 p-10 border border-white/10 flex flex-col justify-between"
              data-cursor-hover
            >
              <div>
                <span className="text-[var(--accent)] text-sm tracking-widest uppercase">{exp.year}</span>
                <h3 className="text-4xl font-bold mt-2 mb-1">{exp.title}</h3>
                <p className="text-xl text-[var(--muted)]">{exp.company}</p>
              </div>
              <p className="text-[var(--muted)] leading-relaxed">{exp.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}