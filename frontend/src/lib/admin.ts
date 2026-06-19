import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const adminApi = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Add auth token to requests
adminApi.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Auth
export const adminAuth = {
  login: (email: string, password: string) =>
    adminApi.post('/auth/login', { email, password }),
  register: (email: string, password: string, registrationSecret: string) =>
    adminApi.post('/auth/register', { email, password, registrationSecret }),
  forgotPassword: (email: string) =>
    adminApi.post('/auth/forgot-password', { email }),
  resetPassword: (token: string, newPassword: string) =>
    adminApi.post('/auth/reset-password', { token, newPassword }),
  verify: () => adminApi.get('/auth/verify'),
  logout: () => {
    localStorage.removeItem('admin_token');
  },
};

// Projects
export const projectsApi = {
  getAll: () => adminApi.get('/projects/admin'),
  create: (data: any) => adminApi.post('/projects', data),
  update: (id: string, data: any) => adminApi.put(`/projects/${id}`, data),
  delete: (id: string) => adminApi.delete(`/projects/${id}`),
};

// Skills
export const skillsApi = {
  getAll: () => adminApi.get('/skills'),
  adminGetAll: () => adminApi.get('/skills/admin'),
  create: (data: any) => adminApi.post('/skills', data),
  update: (id: string, data: any) => adminApi.put(`/skills/${id}`, data),
  delete: (id: string) => adminApi.delete(`/skills/${id}`),
};

// Skill Categories
export const skillCategoriesApi = {
  getAll: () => adminApi.get('/skills/categories'),
  adminGetAll: () => adminApi.get('/skills/categories/admin'),
  create: (data: any) => adminApi.post('/skills/categories', data),
  update: (id: string, data: any) => adminApi.put(`/skills/categories/${id}`, data),
  delete: (id: string) => adminApi.delete(`/skills/categories/${id}`),
};

// Certifications
export const certsApi = {
  getAll: () => adminApi.get('/certifications/admin'),
  create: (data: any) => adminApi.post('/certifications', data),
  update: (id: string, data: any) => adminApi.put(`/certifications/${id}`, data),
  delete: (id: string) => adminApi.delete(`/certifications/${id}`),
};

// Contacts
export const contactsApi = {
  getAll: () => adminApi.get('/contact'),
  markRead: (id: string) => adminApi.patch(`/contact/${id}/read`),
  delete: (id: string) => adminApi.delete(`/contact/${id}`),
};

// Analytics
export const analyticsApi = {
  getDashboard: () => adminApi.get('/analytics/dashboard'),
};

// Site Config
export const configApi = {
  getAll: () => adminApi.get('/config'),
  update: (key: string, value: any) => adminApi.patch(`/config/${key}`, { value }),
};

export default adminApi;