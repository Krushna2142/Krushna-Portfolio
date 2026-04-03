// ── API Response ────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  pagination?: Pagination
}

export interface Pagination {
  page: number
  limit: number
  total: number
  pages: number
}

// ── Models ──────────────────────────────────────────────────
export interface Project {
  _id: string
  title: string
  description: string
  longDescription?: string
  techStack: string[]
  category: 'AI' | 'Web' | 'Mobile' | 'Backend' | 'Other'
  thumbnail?: string
  images?: string[]
  liveUrl?: string
  githubUrl?: string
  featured: boolean
  visible: boolean
  order: number
  createdAt: string
}

export interface Skill {
  _id: string
  name: string
  category: 'Frontend' | 'Backend' | 'Mobile' | 'Database' |
            'DevOps' | 'AI/ML' | 'Languages' | 'Tools' | 'Soft Skills'
  proficiency: number
  icon?: string
  visible: boolean
  order: number
}

export interface Certification {
  _id: string
  title: string
  issuer: string
  issueDate?: string
  expiryDate?: string
  credentialId?: string
  credentialUrl?: string
  thumbnail?: string
  visible: boolean
  order: number
}

export interface ContactMessage {
  _id: string
  name: string
  email: string
  subject: string
  message: string
  isRead: boolean
  isReplied: boolean
  repliedAt?: string
  createdAt: string
}

export interface SiteConfig {
  key: string
  value: boolean | string | number
  description?: string
}

export interface Analytics {
  totalVisits: number
  uniqueVisitors: number
  todayVisits: number
  deviceBreakdown: { desktop: number; mobile: number; tablet: number }
  topPages: { page: string; count: number }[]
  visitsByDay: { date: string; count: number }[]
}

// FIX: admin/page.tsx imported AnalyticsDashboard which didn't exist.
// Exporting as an alias of Analytics so the import resolves without
// changing the admin page's import statement.
export type AnalyticsDashboard = Analytics