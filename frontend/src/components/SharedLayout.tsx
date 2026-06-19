'use client'
import { createContext, useContext, useState, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface SharedLayoutContextType {
  registerElement: (id: string, element: HTMLElement | null) => void
  getElement: (id: string) => HTMLElement | null
}

const SharedLayoutContext = createContext<SharedLayoutContextType | null>(null)

export function SharedLayoutProvider({ children }: { children: ReactNode }) {
  const [elements, setElements] = useState<Map<string, HTMLElement | null>>(new Map())

  const registerElement = (id: string, element: HTMLElement | null) => {
    setElements(prev => new Map(prev).set(id, element))
  }

  const getElement = (id: string) => {
    return elements.get(id) || null
  }

  return (
    <SharedLayoutContext.Provider value={{ registerElement, getElement }}>
      {children}
    </SharedLayoutContext.Provider>
  )
}

export function useSharedLayout() {
  const context = useContext(SharedLayoutContext)
  if (!context) throw new Error('useSharedLayout must be used within SharedLayoutProvider')
  return context
}