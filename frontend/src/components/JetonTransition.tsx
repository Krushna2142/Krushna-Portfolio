'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

// Different transition styles for different routes
const getTransitionForRoute = (pathname: string) => {
  if (pathname === '/' || pathname.startsWith('/#')) {
    return {
      name: 'home',
      page: {
        initial: { opacity: 0, y: 50, filter: 'blur(10px)' },
        animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
        exit: { opacity: 0, y: -50, filter: 'blur(10px)' },
      },
      panels: [
        { 
          initial: { scaleY: 0, transformOrigin: 'top' }, 
          animate: { scaleY: 1, transformOrigin: 'top' },
          exit: { scaleY: 0, transformOrigin: 'bottom' },
          color: 'bg-[#00e5ff]',
          delay: 0,
        },
        { 
          initial: { scaleY: 0, transformOrigin: 'bottom' }, 
          animate: { scaleY: 1, transformOrigin: 'bottom' },
          exit: { scaleY: 0, transformOrigin: 'top' },
          color: 'bg-[#8a2be2]',
          delay: 0.1,
        },
      ],
    }
  }
  
  if (pathname.startsWith('/projects')) {
    return {
      name: 'projects',
      page: {
        initial: { opacity: 0, scale: 0.95, filter: 'blur(10px)' },
        animate: { opacity: 1, scale: 1, filter: 'blur(0px)' },
        exit: { opacity: 0, scale: 1.05, filter: 'blur(10px)' },
      },
      panels: [
        { 
          initial: { x: '-100%', transformOrigin: 'left' }, 
          animate: { x: '0%', transformOrigin: 'left' },
          exit: { x: '100%', transformOrigin: 'right' },
          color: 'bg-[#00e5ff]',
          delay: 0,
        },
        { 
          initial: { x: '100%', transformOrigin: 'right' }, 
          animate: { x: '0%', transformOrigin: 'right' },
          exit: { x: '-100%', transformOrigin: 'left' },
          color: 'bg-[#8a2be2]',
          delay: 0.08,
        },
      ],
    }
  }
  
  // Default transition
  return {
    name: 'default',
    page: {
      initial: { opacity: 0, y: 50 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -50 },
    },
    panels: [
      { 
        initial: { scaleY: 0, transformOrigin: 'top' }, 
        animate: { scaleY: 1, transformOrigin: 'top' },
        exit: { scaleY: 0, transformOrigin: 'bottom' },
        color: 'bg-[#00e5ff]',
        delay: 0,
      },
      { 
        initial: { scaleY: 0, transformOrigin: 'bottom' }, 
        animate: { scaleY: 1, transformOrigin: 'bottom' },
        exit: { scaleY: 0, transformOrigin: 'top' },
        color: 'bg-[#8a2be2]',
        delay: 0.1,
      },
    ],
  }
}

export default function JetonTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [transition, setTransition] = useState(getTransitionForRoute('/'))
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    const newTransition = getTransitionForRoute(pathname)
    setTransition(newTransition)
    setIsTransitioning(true)
    
    // Reset transitioning state after animation completes
    const timer = setTimeout(() => {
      setIsTransitioning(false)
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [pathname])

  return (
    <>
      {/* Animated Panels - Only show during transition */}
      <AnimatePresence mode="wait">
        {isTransitioning && (
          <motion.div
            key={`panels-${pathname}`}
            className="fixed inset-0 z-[9998] pointer-events-none flex"
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {transition.panels.map((panel, i) => (
              <motion.div
                key={i}
                className={`flex-1 ${panel.color} mix-blend-difference`}
                variants={{
                  initial: panel.initial,
                  animate: panel.animate,
                  exit: panel.exit,
                }}
                transition={{ 
                  duration: 0.6, 
                  delay: panel.delay,
                  ease: [0.76, 0, 0.24, 1],
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Content */}
      <motion.div
        key={pathname}
        initial={transition.page.initial}
        animate={transition.page.animate}
        exit={transition.page.exit}
        transition={{ 
          duration: 0.8, 
          delay: 0.3, // Wait for panels to clear
          ease: [0.76, 0, 0.24, 1] 
        }}
      >
        {children}
      </motion.div>
    </>
  )
}