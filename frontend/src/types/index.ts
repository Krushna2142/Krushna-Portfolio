export interface Project {
  id: string
  title: string
  description: string
  longDescription?: string
  techStack: string[]
  category: string
  thumbnail?: string
  images?: string[]
  liveUrl?: string
  githubUrl?: string
  featured: boolean
  visible: boolean
  order: number
  created_at?: string
  updated_at?: string
}

export interface Skill {
  id: string
  name: string
  category: string
  proficiency: number
  icon?: string
  color?: string
  level?: string
  yearsExperience?: number
  description?: string
  linkUrl?: string
  featured: boolean
  visible: boolean
  order: number
  marqueeRow: number
  created_at?: string
  updated_at?: string
}

export interface Certification {
  id: string
  title: string
  issuer: string
  issueDate?: string
  expiryDate?: string
  credentialId?: string
  credentialUrl?: string
  thumbnail?: string
  visible: boolean
  order: number
  created_at?: string
  updated_at?: string
}

export interface Contact {
  id: string
  name: string
  email: string
  subject: string
  message: string
  isRead: boolean
  isReplied: boolean
  repliedAt?: string
  ipAddress?: string
  created_at: string
  updated_at?: string
}