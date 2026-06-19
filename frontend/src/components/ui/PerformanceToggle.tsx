'use client'
import { useState, useEffect } from 'react'

export default function PerformanceToggle() {
  const [highPerf, setHighPerf] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('highPerformance')
    if (saved === 'true') {
      setHighPerf(true)
      document.documentElement.classList.add('high-performance')
    }
  }, [])

  const toggle = () => {
    const newVal = !highPerf
    setHighPerf(newVal)
    localStorage.setItem('highPerformance', String(newVal))
    if (newVal) {
      document.documentElement.classList.add('high-performance')
    } else {
      document.documentElement.classList.remove('high-performance')
    }
  }

  return (
    <button
      onClick={toggle}
      className="fixed bottom-4 right-4 z-[9999] px-4 py-2 rounded-full bg-black/80 border border-white/20 text-white text-sm hover:bg-white/10 transition-all"
      title="Toggle performance mode"
    >
      {highPerf ? ' High Perf' : '🎨 Full FX'}
    </button>
  )
}