import axios from 'axios'

// In development: use http://localhost:8000
// In production/Docker: use /api/ which is proxied to backend:8000
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (typeof window !== 'undefined' && window.location.hostname === 'localhost' && window.location.port === '5173'
    ? 'http://localhost:8000'
    : '/api')

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Products API
export const productAPI = {
  getAll: (page = 1, limit = 10) =>
    api.get(`/products?skip=${(page - 1) * limit}&limit=${limit}`),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
}

// Customers API
export const customerAPI = {
  getAll: (page = 1, limit = 10) =>
    api.get(`/customers?skip=${(page - 1) * limit}&limit=${limit}`),
  getById: (id) => api.get(`/customers/${id}`),
  create: (data) => api.post('/customers', data),
  update: (id, data) => api.put(`/customers/${id}`, data),
  delete: (id) => api.delete(`/customers/${id}`),
}

// Orders API
export const orderAPI = {
  getAll: (page = 1, limit = 10) =>
    api.get(`/orders?skip=${(page - 1) * limit}&limit=${limit}`),
  getById: (id) => api.get(`/orders/${id}`),
  create: (data) => api.post('/orders', data),
  delete: (id) => api.delete(`/orders/${id}`),
}

// Dashboard API
export const dashboardAPI = {
  getMetrics: () => api.get('/dashboard'),
}

export default api
