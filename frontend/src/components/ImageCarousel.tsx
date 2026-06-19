'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ImageCarouselProps {
  images: string[]
  thumbnail?: string
}

export default function ImageCarousel({ images, thumbnail }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)
  
  // Combine thumbnail with additional images
  const allImages = thumbnail ? [thumbnail, ...images] : images

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
    }),
  }

  const paginate = (newDirection: number) => {
    setDirection(newDirection)
    setCurrentIndex((prevIndex) => {
      let nextIndex = prevIndex + newDirection
      if (nextIndex < 0) nextIndex = allImages.length - 1
      if (nextIndex >= allImages.length) nextIndex = 0
      return nextIndex
    })
  }

  // Auto-scroll every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      paginate(1)
    }, 5000)
    return () => clearInterval(timer)
  }, [allImages.length])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') paginate(-1)
      if (e.key === 'ArrowRight') paginate(1)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  if (allImages.length === 0) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-[var(--accent)]/10 to-[var(--accent-2)]/10 flex items-center justify-center">
        <span className="text-6xl">💻</span>
      </div>
    )
  }

  return (
    <div className="relative w-full">
      {/* Main Image Display */}
      <div className="relative w-full h-[60vh] md:h-[70vh] rounded-3xl overflow-hidden mb-4">
        <AnimatePresence initial={false} custom={direction}>
          <motion.img
            key={currentIndex}
            src={allImages[currentIndex]}
            alt={`Project image ${currentIndex + 1}`}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.3 },
              scale: { duration: 0.3 }
            }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Navigation Arrows */}
        {allImages.length > 1 && (
          <>
            <button
              onClick={() => paginate(-1)}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full backdrop-blur-xl bg-black/40 border border-white/20 text-white hover:bg-black/60 hover:scale-110 transition-all flex items-center justify-center text-2xl"
            >
              ‹
            </button>
            <button
              onClick={() => paginate(1)}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full backdrop-blur-xl bg-black/40 border border-white/20 text-white hover:bg-black/60 hover:scale-110 transition-all flex items-center justify-center text-2xl"
            >
              ›
            </button>
          </>
        )}

        {/* Image Counter */}
        {allImages.length > 1 && (
          <div className="absolute top-4 right-4 px-4 py-2 rounded-full backdrop-blur-xl bg-black/40 border border-white/20 text-sm">
            {currentIndex + 1} / {allImages.length}
          </div>
        )}
      </div>

      {/* Thumbnail Strip - Horizontal Scroll (Amazon Style) */}
      {allImages.length > 1 && (
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-[var(--accent)] scrollbar-track-white/10"
            style={{ scrollbarWidth: 'thin' }}
          >
            {allImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setDirection(idx > currentIndex ? 1 : -1)
                  setCurrentIndex(idx)
                }}
                className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                  idx === currentIndex
                    ? 'border-[var(--accent)] scale-110 shadow-[0_0_20px_rgba(0,229,255,0.4)]'
                    : 'border-white/20 opacity-60 hover:opacity-100 hover:border-white/40'
                }`}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>

          {/* Fade indicators */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[var(--bg)] to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[var(--bg)] to-transparent pointer-events-none" />
        </div>
      )}

      {/* Keyboard Instructions */}
      <p className="text-center text-xs text-[var(--muted)] mt-4">
        Use ← → arrow keys or click to navigate
      </p>
    </div>
  )
}