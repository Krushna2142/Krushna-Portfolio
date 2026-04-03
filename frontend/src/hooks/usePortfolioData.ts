'use client'
import { useState, useEffect } from 'react'
import { portfolioApi } from '@/lib/api'
import type { Project, Skill, Certification } from '@/types'

export const usePortfolioData = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [skills,   setSkills]   = useState<Skill[]>([])
  const [certs,    setCerts]    = useState<Certification[]>([])
  const [config,   setConfig]   = useState<Record<string, any>>({})
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState<string | null>(null)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [p, s, c, cfg] = await Promise.all([
          portfolioApi.getProjects(),
          portfolioApi.getSkills(),
          portfolioApi.getCertifications(),
          portfolioApi.getSiteConfig(),
        ])
        setProjects(p.data.data   || [])
        setSkills(s.data.data     || [])
        setCerts(c.data.data      || [])
        setConfig(cfg.data.data   || {})
      } catch (e: any) {
        setError(e.message)
        console.error('Portfolio data fetch error:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  return { projects, skills, certs, config, loading, error }
}