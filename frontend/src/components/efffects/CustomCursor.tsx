'use client'
import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false)
  const [isClickable, setIsClickable] = useState(false)
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)

  const springConfig = { damping: 25, stiffness: 700 }
  const cursorXSpring = useSpring(cursorX, springConfig)
  const cursorYSpring = useSpring(cursorY, springConfig)

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16)
      cursorY.set(e.clientY - 16)
    }

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      // Check for interactive elements including those in modals/popups
      if (target.closest('button, a, input, select, textarea, [data-cursor-hover], .cursor-pointer, [role="button"]')) {
        setIsHovering(true)
        if (target.closest('button, a, [data-cursor-hover], .cursor-pointer, [role="button"]')) {
          setIsClickable(true)
        }
      } else {
        setIsHovering(false)
        setIsClickable(false)
      }
    }

    window.addEventListener('mousemove', moveCursor)
    window.addEventListener('mouseover', handleMouseOver)

    return () => {
      window.removeEventListener('mousemove', moveCursor)
      window.removeEventListener('mouseover', handleMouseOver)
    }
  }, [cursorX, cursorY])

  return (
    <>
      {/* Main cursor dot - ALWAYS VISIBLE */}
      <motion.div
        className="fixed top-0 left-0 w-4 h-4 bg-[var(--accent)] rounded-full pointer-events-none z-[99999] mix-blend-difference"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          scale: isClickable ? 1.5 : isHovering ? 1.2 : 1,
        }}
      />
      
      {/* Outer ring - ALWAYS VISIBLE */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 border-2 border-[var(--accent)] rounded-full pointer-events-none z-[99998] mix-blend-difference"
        style={{
          x: useSpring(cursorX, { damping: 50, stiffness: 400 }),
          y: useSpring(cursorY, { damping: 50, stiffness: 400 }),
          scale: isHovering ? 1.5 : 1,
          opacity: 0.5,
        }}
      />
    </>
  )
}