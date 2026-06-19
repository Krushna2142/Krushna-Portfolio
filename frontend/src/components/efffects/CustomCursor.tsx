'use client'
import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  
  const springConfig = { damping: 25, stiffness: 400, mass: 0.5 }
  const cursorXSpring = useSpring(cursorX, springConfig)
  const cursorYSpring = useSpring(cursorY, springConfig)

  useEffect(() => {
    setIsClient(true)
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0)

    if (isTouchDevice) return

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
    }
    window.addEventListener('mousemove', moveCursor, { passive: true })

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.closest('a, button, [data-cursor-hover]')) {
        setIsHovering(true)
      } else {
        setIsHovering(false)
      }
    }
    document.addEventListener('mouseover', handleMouseOver, { passive: true })

    return () => {
      window.removeEventListener('mousemove', moveCursor)
      document.removeEventListener('mouseover', handleMouseOver)
    }
  }, [cursorX, cursorY, isTouchDevice])

  // Don't render during SSR or on touch devices
  if (!isClient || isTouchDevice) return null

  return (
    <>
      {/* Outer ring */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 border-2 border-[var(--accent)] rounded-full pointer-events-none z-[9999] mix-blend-difference"
        style={{ 
          x: cursorXSpring, 
          y: cursorYSpring, 
          translateX: '-50%', 
          translateY: '-50%',
        }}
        animate={{ 
          scale: isHovering ? 2 : 1, 
          opacity: isHovering ? 0.5 : 1 
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      />
      {/* Inner dot */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-[var(--accent)] rounded-full pointer-events-none z-[9999] mix-blend-difference"
        style={{ 
          x: cursorXSpring, 
          y: cursorYSpring, 
          translateX: '-50%', 
          translateY: '-50%' 
        }}
      />
    </>
  )
}