'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import axios from 'axios'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const LEVEL_COLORS: Record<string, string> = {
  'Beginner': '#6bcf7f',
  'Intermediate': '#4fc3f7',
  'Advanced': '#ffd93d',
  'Expert': '#ff6b9d',
}

const DEFAULT_CATEGORIES = [
  { name: 'Frontend', icon: '🎨', color: '#00e5ff', description: 'UI/UX and client-side technologies' },
  { name: 'Backend', icon: '⚙️', color: '#8a2be2', description: 'Server-side and API development' },
  { name: 'Mobile', icon: '📱', color: '#ff6b9d', description: 'Mobile app development' },
  { name: 'Database', icon: '💾', color: '#ffd93d', description: 'Data storage and management' },
  { name: 'DevOps', icon: '☁️', color: '#6bcf7f', description: 'Infrastructure and deployment' },
  { name: 'AI/ML', icon: '🤖', color: '#ff8a65', description: 'Artificial intelligence and machine learning' },
  { name: 'Languages', icon: '', color: '#4fc3f7', description: 'Programming languages' },
  { name: 'Tools', icon: '️', color: '#4db6ac', description: 'Development tools and utilities' },
]

export default function Skills() {
  const [skills, setSkills] = useState<any[]>([])
  const [config, setConfig] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      axios.get(`${API_BASE}/skills`).then(r => r.data.data || []),
      axios.get(`${API_BASE}/config`).then(r => r.data.data || {}),
    ])
      .then(([skillsData, configData]) => {
        setSkills(skillsData)
        setConfig(configData)
      })
      .catch(err => console.error('Failed to fetch skills', err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <section id="skills" className="py-20 px-4 md:px-12">
        <div className="text-center text-[var(--accent)] animate-pulse">Loading skills...</div>
      </section>
    )
  }

  const categories = DEFAULT_CATEGORIES
  const layout = config.skills_layout || 'marquee'
  const showProficiency = config.skills_show_proficiency !== false
  const showLevel = config.skills_show_level !== false
  const showYears = config.skills_show_years === true
  const showDescription = config.skills_show_description === true
  const marqueeSpeed = parseInt(config.skills_marquee_speed) || 30
  const marqueeRows = parseInt(config.skills_marquee_rows) || 3

  const getRowSkills = (rowNum: number) => skills.filter(s => s.marqueeRow === rowNum)

  // ============ MARQUEE LAYOUT ============
  if (layout === 'marquee') {
    return (
      <section id="skills" className="py-20 md:py-32 relative z-10 overflow-hidden">
        <div className="container mx-auto px-4 md:px-12 mb-12 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-4xl md:text-7xl font-bold mb-4 md:mb-6">
              My <span className="text-[var(--accent)]">Skills</span>
            </h2>
            <p className="text-[var(--muted)] text-base md:text-lg max-w-2xl mx-auto">
              Technologies and tools I use to bring ideas to life
            </p>
          </motion.div>
        </div>

        {/* Category Cards */}
        <div className="container mx-auto px-4 md:px-12 mb-12 md:mb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {categories.map((cat, index) => {
              const catSkills = skills.filter(s => s.category === cat.name)
              if (catSkills.length === 0) return null
              const isExpanded = expandedCategory === cat.name

              return (
                <motion.div
                  key={cat.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="rounded-2xl backdrop-blur-md bg-white/5 border transition-all duration-500 overflow-hidden cursor-pointer group"
                  style={{ borderColor: `${cat.color}30` }}
                  onClick={() => setExpandedCategory(isExpanded ? null : cat.name)}
                >
                  <div className="p-4 md:p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div 
                        className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center text-xl md:text-2xl flex-shrink-0"
                        style={{ backgroundColor: `${cat.color}20`, border: `2px solid ${cat.color}` }}
                      >
                        {cat.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-sm md:text-base truncate" style={{ color: cat.color }}>{cat.name}</h3>
                        <p className="text-xs text-[var(--muted)]">{catSkills.length} skills</p>
                      </div>
                      <motion.span
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        className="text-[var(--muted)] text-lg"
                      >
                        ▼
                      </motion.span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {catSkills.slice(0, isExpanded ? undefined : 3).map((skill) => (
                        <span
                          key={skill.id}
                          className="px-2 py-1 rounded-md text-xs font-medium truncate max-w-full"
                          style={{ 
                            backgroundColor: `${skill.color}15`,
                            color: skill.color,
                            border: `1px solid ${skill.color}30`,
                          }}
                        >
                          {skill.icon && <span className="mr-1">{skill.icon}</span>}
                          {skill.name}
                        </span>
                      ))}
                      {!isExpanded && catSkills.length > 3 && (
                        <span className="px-2 py-1 rounded-md text-xs bg-white/5 text-[var(--muted)]">
                          +{catSkills.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-white/10"
                      >
                        <div className="p-4 space-y-3">
                          {catSkills.map((skill) => (
                            <div key={skill.id} className="flex items-center gap-3">
                              {skill.icon && <span className="text-lg">{skill.icon}</span>}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-sm font-medium truncate" style={{ color: skill.color }}>
                                    {skill.name}
                                  </span>
                                  {showLevel && (
                                    <span
                                      className="text-[10px] px-1.5 py-0.5 rounded-full flex-shrink-0"
                                      style={{ 
                                        backgroundColor: `${LEVEL_COLORS[skill.level]}20`,
                                        color: LEVEL_COLORS[skill.level],
                                      }}
                                    >
                                      {skill.level}
                                    </span>
                                  )}
                                </div>
                                {showProficiency && (
                                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                    <div
                                      className="h-full rounded-full transition-all duration-1000"
                                      style={{ width: `${skill.proficiency}%`, background: skill.color }}
                                    />
                                  </div>
                                )}
                              </div>
                              {showYears && (
                                <span className="text-xs text-[var(--muted)] flex-shrink-0">{skill.yearsExperience}y</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Marquee Rows */}
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-r from-[var(--bg)] to-transparent pointer-events-none z-20" />
          <div className="absolute right-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-l from-[var(--bg)] to-transparent pointer-events-none z-20" />

          {Array.from({ length: marqueeRows }).map((_, rowIdx) => {
            const rowSkills = getRowSkills(rowIdx + 1)
            if (rowSkills.length === 0) return null
            const direction = rowIdx % 2 === 0 ? 'left' : 'right'
            const speed = marqueeSpeed + (rowIdx * 5)

            return (
              <div key={rowIdx} className="mb-4 overflow-hidden">
                <motion.div
                  className="flex gap-4 whitespace-nowrap"
                  animate={{ x: direction === 'left' ? ['0%', '-50%'] : ['-50%', '0%'] }}
                  transition={{ repeat: Infinity, duration: speed, ease: 'linear' }}
                >
                  {[...rowSkills, ...rowSkills].map((skill, i) => (
                    <a
                      key={`${skill.id}-${i}`}
                      href={skill.linkUrl || undefined}
                      target={skill.linkUrl ? '_blank' : undefined}
                      rel={skill.linkUrl ? 'noopener noreferrer' : undefined}
                      className="flex-shrink-0 group"
                    >
                      <div
                        className="px-6 py-3 rounded-full backdrop-blur-sm bg-white/5 border hover:scale-110 transition-all duration-300 flex items-center gap-3"
                        style={{ borderColor: `${skill.color}40` }}
                      >
                        {skill.icon && <span className="text-xl">{skill.icon}</span>}
                        <div className="flex flex-col">
                          <span className="text-base font-medium whitespace-nowrap" style={{ color: skill.color }}>
                            {skill.name}
                          </span>
                          {(showLevel || showYears) && (
                            <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
                              {showLevel && <span style={{ color: LEVEL_COLORS[skill.level] || skill.color }}>{skill.level}</span>}
                              {showYears && <span>• {skill.yearsExperience}y</span>}
                            </div>
                          )}
                        </div>
                      </div>
                    </a>
                  ))}
                </motion.div>
              </div>
            )
          })}
        </div>
      </section>
    )
  }

  // ============ GRID LAYOUT ============
  if (layout === 'grid') {
    return (
      <section id="skills" className="py-20 md:py-32 px-4 md:px-12 relative z-10">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-20"
          >
            <h2 className="text-4xl md:text-7xl font-bold mb-4 md:mb-6">
              My <span className="text-[var(--accent)]">Skills</span>
            </h2>
            <p className="text-[var(--muted)] text-base md:text-lg max-w-2xl mx-auto">
              Technologies and tools I use to bring ideas to life
            </p>
          </motion.div>

          {categories.map((cat, catIdx) => {
            const catSkills = skills.filter(s => s.category === cat.name)
            if (catSkills.length === 0) return null

            return (
              <div key={cat.name} className="mb-12 md:mb-16">
                <div className="flex items-center gap-3 mb-6">
                  <div 
                    className="w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center text-2xl md:text-3xl"
                    style={{ backgroundColor: `${cat.color}20`, border: `2px solid ${cat.color}` }}
                  >
                    {cat.icon}
                  </div>
                  <div>
                    <h3 className="text-xl md:text-3xl font-bold" style={{ color: cat.color }}>{cat.name}</h3>
                    {cat.description && <p className="text-xs md:text-sm text-[var(--muted)]">{cat.description}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                  {catSkills.map((skill, i) => (
                    <motion.a
                      key={skill.id}
                      href={skill.linkUrl || undefined}
                      target={skill.linkUrl ? '_blank' : undefined}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                      whileHover={{ scale: 1.03, y: -5 }}
                      className="p-4 md:p-5 rounded-2xl backdrop-blur-sm bg-white/5 border hover:shadow-lg transition-all duration-300 group block"
                      style={{ borderColor: `${skill.color}30` }}
                    >
                      <div className="flex items-start gap-3 mb-3">
                        {skill.icon && <span className="text-2xl md:text-3xl">{skill.icon}</span>}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h4 className="font-bold text-base md:text-lg truncate" style={{ color: skill.color }}>{skill.name}</h4>
                            {skill.featured && <span className="text-xs">⭐</span>}
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            {showLevel && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ 
                                backgroundColor: `${LEVEL_COLORS[skill.level]}20`,
                                color: LEVEL_COLORS[skill.level],
                              }}>
                                {skill.level}
                              </span>
                            )}
                            {showYears && <span className="text-xs text-[var(--muted)]"> {skill.yearsExperience}y</span>}
                          </div>
                        </div>
                      </div>

                      {showDescription && skill.description && (
                        <p className="text-xs md:text-sm text-[var(--muted)] mb-3 line-clamp-2">{skill.description}</p>
                      )}

                      {showProficiency && (
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-[var(--muted)]">Proficiency</span>
                            <span style={{ color: skill.color }}>{skill.proficiency}%</span>
                          </div>
                          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${skill.proficiency}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1, delay: i * 0.05 }}
                              className="h-full rounded-full"
                              style={{ background: `linear-gradient(90deg, ${skill.color}, ${skill.color}80)` }}
                            />
                          </div>
                        </div>
                      )}
                    </motion.a>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </section>
    )
  }

  // ============ LIST LAYOUT ============
  return (
    <section id="skills" className="py-20 md:py-32 px-4 md:px-12 relative z-10">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-20"
        >
          <h2 className="text-4xl md:text-7xl font-bold mb-4 md:mb-6">
            My <span className="text-[var(--accent)]">Skills</span>
          </h2>
        </motion.div>

        {categories.map((cat) => {
          const catSkills = skills.filter(s => s.category === cat.name)
          if (catSkills.length === 0) return null

          return (
            <div key={cat.name} className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{cat.icon}</span>
                <h3 className="text-xl font-bold" style={{ color: cat.color }}>{cat.name}</h3>
              </div>
              <div className="space-y-2">
                {catSkills.map((skill, i) => (
                  <motion.a
                    key={skill.id}
                    href={skill.linkUrl || undefined}
                    target={skill.linkUrl ? '_blank' : undefined}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.03 }}
                    whileHover={{ x: 10 }}
                    className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl backdrop-blur-sm bg-white/5 border border-white/10 hover:border-[var(--accent)]/30 transition-all block"
                  >
                    {skill.icon && <span className="text-xl md:text-2xl">{skill.icon}</span>}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-bold text-sm md:text-base" style={{ color: skill.color }}>{skill.name}</span>
                        {showLevel && (
                          <span className="text-xs px-2 py-0.5 rounded-full" style={{ 
                            backgroundColor: `${LEVEL_COLORS[skill.level]}20`,
                            color: LEVEL_COLORS[skill.level],
                          }}>
                            {skill.level}
                          </span>
                        )}
                        {showYears && <span className="text-xs text-[var(--muted)]">{skill.yearsExperience}y</span>}
                      </div>
                      {showDescription && skill.description && (
                        <p className="text-xs text-[var(--muted)] truncate">{skill.description}</p>
                      )}
                    </div>
                    {showProficiency && (
                      <div className="w-24 md:w-32 flex-shrink-0">
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${skill.proficiency}%`, background: skill.color }} />
                        </div>
                        <div className="text-xs text-right mt-1" style={{ color: skill.color }}>{skill.proficiency}%</div>
                      </div>
                    )}
                  </motion.a>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}