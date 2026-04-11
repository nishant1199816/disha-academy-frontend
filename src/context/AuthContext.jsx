import { createContext, useContext, useState, useEffect } from 'react'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('edtech_token')
    if (!token) { setLoading(false); return }
    fetch(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
    })
      .then(r => r.json())
      .then(d => { if (d.success) setUser(d.user) })
      .catch(() => { localStorage.removeItem('edtech_token'); localStorage.removeItem('edtech_user') })
      .finally(() => setLoading(false))
  }, [])

  const login = (userData, token) => {
    localStorage.setItem('edtech_token', token)
    localStorage.setItem('edtech_user', JSON.stringify(userData))
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('edtech_token')
    localStorage.removeItem('edtech_user')
    setUser(null)
  }

  const refreshUser = async () => {
    const token = localStorage.getItem('edtech_token')
    if (!token) return
    try {
      const res  = await fetch(`${BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
      })
      const data = await res.json()
      if (data.success) setUser(data.user)
    } catch {}
  }

  const isEnrolled = (courseId) =>
    user?.enrollments?.some(e =>
      (typeof e === 'string' ? e : e.course_id) === courseId
    ) || false

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, refreshUser, isEnrolled, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
