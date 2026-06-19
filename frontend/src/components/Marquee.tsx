'use client'
import { motion } from 'framer-motion'

const skills = ['React.js', 'Node.js', 'Next.js', 'MongoDB', 'Python', 'FastAPI', 'AWS', 'Docker', 'TypeScript', 'Tailwind CSS', 'OpenAI API', 'WebGL']

export default function Marquee() {
  return (
    <div className="py-20 overflow-hidden border-y border-white/10 bg-[#0a0a0a]">
      <motion.div 
        className="flex gap-16 whitespace-nowrap"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
      >
        {/* Duplicate the array for seamless loop */}
        {[...skills, ...skills].map((skill, i) => (
          <span key={i} className="text-4xl md:text-6xl font-bold text-white/20 hover:text-[var(--accent)] transition-colors duration-300">
            {skill} ✦
          </span>
        ))}
      </motion.div>
    </div>
  )
}