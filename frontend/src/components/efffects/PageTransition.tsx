'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, scale: 1.02, filter: 'blur(10px)' }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }} // Premium easing
        >
          {children}
        </motion.div>
      </AnimatePresence>
      
      {/* The Cinematic Overlay Wipe */}
      <motion.div
        key={`wipe-${pathname}`}
        className="fixed inset-0 z-[100] bg-[var(--accent)] pointer-events-none origin-bottom"
        initial={{ scaleY: 0 }}
        animate={{ 
          scaleY: [0, 1, 0], 
          originY: [1, 1, 0] // Wipes up from bottom, then wipes out to top
        }}
        transition={{ 
          duration: 1.2, 
          ease: [0.76, 0, 0.24, 1],
          times: [0, 0.5, 1]
        }}
      />
    </>
  )
}