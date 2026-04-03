import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT token on every request if present
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('admin_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle 401 — redirect to admin login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('admin_token')
      window.location.href = '/admin/login'
    }
    return Promise.reject(err)
  }
)

// ── Public Portfolio Endpoints ──────────────────────────────
export const portfolioApi = {
  getProjects:       () => api.get('/projects'),
  getSkills:         () => api.get('/skills'),
  getCertifications: () => api.get('/certifications'),
  getSiteConfig:     () => api.get('/config'),
  sendContact:       (data: object) => api.post('/contact', data),
  trackVisit:        (data: object) => api.post('/analytics/track', data),
}

// ── Admin Endpoints ─────────────────────────────────────────
export const adminApi = {
  // Auth
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),

  // Projects
  getProjects:    () => api.get('/admin/projects'),
  createProject:  (data: object) => api.post('/admin/projects', data),
  updateProject:  (id: string, data: object) => api.put(`/admin/projects/${id}`, data),
  deleteProject:  (id: string) => api.delete(`/admin/projects/${id}`),

  // Skills
  getSkills:   () => api.get('/admin/skills'),
  createSkill: (data: object) => api.post('/admin/skills', data),
  updateSkill: (id: string, data: object) => api.put(`/admin/skills/${id}`, data),
  deleteSkill: (id: string) => api.delete(`/admin/skills/${id}`),

  // Certifications
  getCerts:    () => api.get('/admin/certifications'),
  createCert:  (data: object) => api.post('/admin/certifications', data),
  updateCert:  (id: string, data: object) => api.put(`/admin/certifications/${id}`, data),
  deleteCert:  (id: string) => api.delete(`/admin/certifications/${id}`),

  // Contact
  getMessages: () => api.get('/admin/contact'),
  markRead:    (id: string) => api.patch(`/admin/contact/${id}/read`),
  deleteMsg:   (id: string) => api.delete(`/admin/contact/${id}`),

  // Analytics
  getAnalytics: () => api.get('/admin/analytics'),

  // Config
  getConfig:    () => api.get('/admin/config'),
  updateConfig: (key: string, value: unknown) =>
    api.patch(`/admin/config/${key}`, { value }),
}

export default api