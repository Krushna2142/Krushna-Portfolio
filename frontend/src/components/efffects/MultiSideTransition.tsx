'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function MultiSideTransition() {
  const pathname = usePathname()
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    // Trigger transition
    setIsTransitioning(true)
    
    // Reset after animation completes
    const timer = setTimeout(() => {
      setIsTransitioning(false)
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [pathname])

  if (!isTransitioning) return null

  return (
    <div className="fixed inset-0 z-[9997] pointer-events-none">
      {/* TOP Panel - Expands Down */}
      <motion.div
        initial={{ scaleY: 0, transformOrigin: "top" }}
        animate={{ scaleY: 1, transformOrigin: "top" }}
        exit={{ scaleY: 0, transformOrigin: "bottom" }}
        transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1], delay: 0 }}
        className="absolute top-0 left-0 right-0 h-1/2 bg-[var(--accent)]"
        style={{ mixBlendMode: 'difference' }}
      />
      
      {/* BOTTOM Panel - Expands Up */}
      <motion.div
        initial={{ scaleY: 0, transformOrigin: "bottom" }}
        animate={{ scaleY: 1, transformOrigin: "bottom" }}
        exit={{ scaleY: 0, transformOrigin: "top" }}
        transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1], delay: 0.05 }}
        className="absolute bottom-0 left-0 right-0 h-1/2 bg-[var(--accent-2)]"
        style={{ mixBlendMode: 'difference' }}
      />
      
      {/* LEFT Panel - Expands Right */}
      <motion.div
        initial={{ scaleX: 0, transformOrigin: "left" }}
        animate={{ scaleX: 1, transformOrigin: "left" }}
        exit={{ scaleX: 0, transformOrigin: "right" }}
        transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
        className="absolute top-0 left-0 bottom-0 w-1/2 bg-gradient-to-r from-[var(--accent)] to-transparent"
        style={{ mixBlendMode: 'exclusion' }}
      />
      
      {/* RIGHT Panel - Expands Left */}
      <motion.div
        initial={{ scaleX: 0, transformOrigin: "right" }}
        animate={{ scaleX: 1, transformOrigin: "right" }}
        exit={{ scaleX: 0, transformOrigin: "left" }}
        transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1], delay: 0.15 }}
        className="absolute top-0 right-0 bottom-0 w-1/2 bg-gradient-to-l from-[var(--accent-2)] to-transparent"
        style={{ mixBlendMode: 'exclusion' }}
      />

      {/* CENTER Diamond/Circle Reveal */}
      <motion.div
        initial={{ scale: 0, borderRadius: "50%" }}
        animate={{ scale: 2, borderRadius: "0%" }}
        exit={{ scale: 0, borderRadius: "50%" }}
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vmax] h-[150vmax] bg-[var(--accent)]"
        style={{ mixBlendMode: 'color-dodge' }}
      />

      {/* Rotating Square Effect */}
      <motion.div
        initial={{ rotate: 0, scale: 0 }}
        animate={{ rotate: 180, scale: 1.5 }}
        exit={{ rotate: 360, scale: 0 }}
        transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1], delay: 0.25 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vmax] h-[80vmax] border-[20px] border-[var(--accent-2)]"
        style={{ mixBlendMode: 'screen' }}
      />
    </div>
  )
}