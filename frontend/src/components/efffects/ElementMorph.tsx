'use client'
import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface ElementMorphProps {
  children: ReactNode
  className?: string
  delay?: number
}

export default function ElementMorph({ children, className = '', delay = 0 }: ElementMorphProps) {
  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        y: 50, 
        rotateX: -15,
        filter: 'blur(10px)'
      }}
      whileInView={{ 
        opacity: 1, 
        y: 0, 
        rotateX: 0,
        filter: 'blur(0px)'
      }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ 
        duration: 0.9, 
        delay,
        ease: [0.76, 0, 0.24, 1]
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}