// src/api/axios.js
// Centralized axios instance — automatically attaches JWT token to requests

import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// ─── Request Interceptor: Attach JWT ─────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('travel_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ─── Response Interceptor: Handle 401 ────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login on auth failure
      localStorage.removeItem('travel_token')
      localStorage.removeItem('travel_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
