import axios from 'axios'

// 🔥 NEVER fallback to localhost in production
const API_URL = process.env.NEXT_PUBLIC_API_URL as string

if (!API_URL) {
  throw new Error('❌ NEXT_PUBLIC_API_URL is not defined')
}

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

// ── Request Interceptor ──────────────────────────────────────
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('admin_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ── Response Interceptor ─────────────────────────────────────
api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error('❌ API ERROR:', err?.response?.data || err.message)

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

// ── Admin Endpoints (FIXED PATHS) ────────────────────────────
export const adminApi = {
  // Auth
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),

  // Projects
  getProjects:    () => api.get('/projects/admin'),
  createProject:  (data: object) => api.post('/projects', data),
  updateProject:  (id: string, data: object) => api.put(`/projects/${id}`, data),
  deleteProject:  (id: string) => api.delete(`/projects/${id}`),

  // Skills
  getSkills:   () => api.get('/skills/admin'),
  createSkill: (data: object) => api.post('/skills', data),
  updateSkill: (id: string, data: object) => api.put(`/skills/${id}`, data),
  deleteSkill: (id: string) => api.delete(`/skills/${id}`),

  // Certifications
  getCerts:    () => api.get('/certifications/admin'),
  createCert:  (data: object) => api.post('/certifications', data),
  updateCert:  (id: string, data: object) => api.put(`/certifications/${id}`, data),
  deleteCert:  (id: string) => api.delete(`/certifications/${id}`),

  // Contact
  getMessages: () => api.get('/contact'),
  markRead:    (id: string) => api.patch(`/contact/${id}/read`),
  deleteMsg:   (id: string) => api.delete(`/contact/${id}`),

  // Analytics
  getAnalytics: () => api.get('/analytics/dashboard'),

  // Config
  getConfig:    () => api.get('/config'),
  updateConfig: (key: string, value: unknown) =>
    api.patch(`/config/${key}`, { value }),
}

export default api