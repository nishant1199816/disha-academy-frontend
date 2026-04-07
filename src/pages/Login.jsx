import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authAPI } from '../utils/api'
import { Button } from '../components/ui'
import { BookOpen, Eye, EyeOff, Mail, Lock } from 'lucide-react'
import { DishaLogoIcon } from '../components/ui/DishaLogo'
import './auth.css'

export default function Login() {
  const [form, setForm]       = useState({ email: '', password: '' })
  const [showPw, setShowPw]   = useState(false)
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const { login }  = useAuth()
  const navigate   = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.email || !form.password) return setError('Please fill all fields')
    setLoading(true)
    try {
      const data = await authAPI.login(form)
      login(data.user, data.token)
      navigate(data.user.role === 'admin' ? '/admin' : '/dashboard')
    } catch (err) {
      setError(err.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-glow" />
      <div className="auth-card fade-up">
        <div className="auth-logo">
          <DishaLogoIcon size={40} />
          <span className="auth-brand">Disha Academy</span>
        </div>
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-sub">Login to continue your preparation</p>
        <div className="demo-hint">
          <p><strong>Student:</strong> student@disha.com / student123</p>
          <p><strong>Admin:</strong> admin@disha.com / admin123</p>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="field">
            <label className="field-label">Email address</label>
            <div className="field-input-wrap">
              <Mail size={16} className="field-icon" />
              <input type="email" className="field-input" placeholder="you@example.com"
                value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
            </div>
          </div>
          <div className="field">
            <label className="field-label">
              Password
              <Link to="/forgot-password" className="field-link">Forgot?</Link>
            </label>
            <div className="field-input-wrap">
              <Lock size={16} className="field-icon" />
              <input type={showPw ? 'text' : 'password'} className="field-input" placeholder="••••••••"
                value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
              <button type="button" className="field-toggle" onClick={() => setShowPw(!showPw)}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          {error && <div className="auth-error">{error}</div>}
          <Button type="submit" fullWidth loading={loading} size="lg">
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
        <p className="auth-footer">
          Don't have an account? <Link to="/register" className="auth-link">Register here</Link>
        </p>
      </div>
    </div>
  )
}
