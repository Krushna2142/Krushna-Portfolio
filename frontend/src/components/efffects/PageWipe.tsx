'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'

export default function PageWipe() {
  const pathname = usePathname()
  
  return (
    <AnimatePresence mode="sync">
      <motion.div
        key={`wipe-${pathname}`}
        initial={{ scaleY: 1, originY: 0 }}
        animate={{ scaleY: 0, originY: 0 }}
        exit={{ scaleY: 1, originY: 1 }}
        transition={{ 
          duration: 0.9, 
          ease: [0.76, 0, 0.24, 1]
        }}
        className="fixed inset-0 z-[9998] pointer-events-none bg-[var(--accent)] mix-blend-difference"
      />
    </AnimatePresence>
  )
}