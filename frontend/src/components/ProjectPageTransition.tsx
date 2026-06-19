'use client'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export default function ProjectPageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isProjectPage, setIsProjectPage] = useState(false)

  useEffect(() => {
    setIsProjectPage(pathname?.startsWith('/projects/'))
  }, [pathname])

  if (!isProjectPage) {
    return <>{children}</>
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  )
}