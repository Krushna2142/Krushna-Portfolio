'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function ZoomTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isProjectPage, setIsProjectPage] = useState(false)

  useEffect(() => {
    setIsProjectPage(pathname?.startsWith('/projects/'))
  }, [pathname])

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}