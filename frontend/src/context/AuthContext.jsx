// src/context/AuthContext.jsx
// Global authentication state — provides user, login, logout, isAdmin

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '../api/axios'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Load user from localStorage on mount (persists across refreshes)
  useEffect(() => {
    const token = localStorage.getItem('travel_token')
    const savedUser = localStorage.getItem('travel_user')
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch {
        logout()
      }
    }
    setLoading(false)
  }, [])

  const login = useCallback(async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password })
    localStorage.setItem('travel_token', data.token)
    localStorage.setItem('travel_user', JSON.stringify(data.user))
    setUser(data.user)
    return data.user
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('travel_token')
    localStorage.removeItem('travel_user')
    setUser(null)
  }, [])

  const updateUser = useCallback((updatedUser) => {
    localStorage.setItem('travel_user', JSON.stringify(updatedUser))
    setUser(updatedUser)
  }, [])

  const isAdmin = user?.role === 'admin'
  const isAuthenticated = !!user

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser, isAdmin, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook for easy access
export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
