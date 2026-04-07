import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../utils/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('edtech_token')
    if (!token) { setLoading(false); return }
    authAPI.me()
      .then(data => setUser(data.user))
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
    try { const d = await authAPI.me(); setUser(d.user) } catch {}
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
