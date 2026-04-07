import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authAPI } from '../utils/api'
import { Button } from '../components/ui'
import { Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react'
import { DishaLogoIcon } from '../components/ui/DishaLogo'
import './auth.css'

export default function Register() {
  const [form, setForm]       = useState({ name:'', email:'', phone:'', password:'', confirm:'' })
  const [showPw, setShowPw]   = useState(false)
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const { login }  = useAuth()
  const navigate   = useNavigate()
  const set = k => e => setForm({ ...form, [k]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.name || !form.email || !form.phone || !form.password) return setError('Please fill all fields')
    if (form.password !== form.confirm) return setError('Passwords do not match')
    if (form.password.length < 8) return setError('Password must be at least 8 characters')
    setLoading(true)
    try {
      const data = await authAPI.register({ name: form.name, email: form.email, phone: form.phone, password: form.password })
      login(data.user, data.token)
      navigate('/courses')
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.')
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
        <h1 className="auth-title">Create your account</h1>
        <p className="auth-sub">Start your Sarkari Naukri preparation today</p>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="field">
            <label className="field-label">Full Name</label>
            <div className="field-input-wrap">
              <User size={16} className="field-icon" />
              <input type="text" className="field-input" placeholder="Rahul Sharma" value={form.name} onChange={set('name')} />
            </div>
          </div>
          <div className="field">
            <label className="field-label">Email address</label>
            <div className="field-input-wrap">
              <Mail size={16} className="field-icon" />
              <input type="email" className="field-input" placeholder="you@example.com" value={form.email} onChange={set('email')} />
            </div>
          </div>
          <div className="field">
            <label className="field-label">Phone number</label>
            <div className="field-input-wrap">
              <Phone size={16} className="field-icon" />
              <input type="tel" className="field-input" placeholder="+91 98765 43210" value={form.phone} onChange={set('phone')} />
            </div>
          </div>
          <div className="fields-row">
            <div className="field">
              <label className="field-label">Password</label>
              <div className="field-input-wrap">
                <Lock size={16} className="field-icon" />
                <input type={showPw ? 'text' : 'password'} className="field-input" placeholder="Min 8 chars" value={form.password} onChange={set('password')} />
                <button type="button" className="field-toggle" onClick={() => setShowPw(!showPw)}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div className="field">
              <label className="field-label">Confirm Password</label>
              <div className="field-input-wrap">
                <Lock size={16} className="field-icon" />
                <input type={showPw ? 'text':'password'} className="field-input" placeholder="••••••••" value={form.confirm} onChange={set('confirm')} />
              </div>
            </div>
          </div>
          {error && <div className="auth-error">{error}</div>}
          <Button type="submit" fullWidth loading={loading} size="lg">
            {loading ? 'Creating account...' : 'Create Account'}
          </Button>
          <p className="auth-terms">
            By registering you agree to our <a href="#" className="auth-link">Terms</a> and <a href="#" className="auth-link">Privacy Policy</a>
          </p>
        </form>
        <p className="auth-footer">
          Already have an account? <Link to="/login" className="auth-link">Login here</Link>
        </p>
      </div>
    </div>
  )
}
