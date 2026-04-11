import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { BookOpen, Clock, Users, Lock, ChevronRight, Star, Target } from 'lucide-react'
import './courses.css'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const FILTERS = ['All', 'SSC CGL', 'SSC CHSL', 'Delhi Police', 'UP Police', 'Railway', 'DSSSB']

export default function Courses() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [courses, setCourses] = useState([])
  const [filter, setFilter]   = useState('All')
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  useEffect(() => {
    fetch(`${BASE_URL}/courses`)
      .then(r => r.json())
      .then(d => setCourses(d.courses || []))
      .catch(() => setError('Courses load nahi hue. Backend check karo.'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'All'
    ? courses
    : courses.filter(c => c.exam_type === filter)

  if (loading) return (
    <div className="container" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
      Loading courses...
    </div>
  )

  return (
    <div className="courses-page container fade-up">
      <div className="courses-header">
        <h1 className="page-title">Sabhi Courses</h1>
        <p className="page-sub">GPay · PhonePe · Paytm — pay karo aur turant access pao</p>
      </div>

      {error && (
        <div style={{ background: 'var(--red-dim)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', padding: '12px 16px', color: 'var(--red)', marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      <div className="filter-tabs">
        {FILTERS.map(f => (
          <button key={f} className={`filter-tab ${filter === f ? 'filter-tab-active' : ''}`} onClick={() => setFilter(f)}>
            {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 && !loading && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
          Is filter mein koi course nahi mila.
        </div>
      )}

      <div className="courses-grid">
        {filtered.map((c, i) => (
          <div className="course-card fade-up" key={c.id} style={{ animationDelay: `${i * 0.08}s` }}>
            <div className="course-thumb">
              <div className="course-thumb-icon"><BookOpen size={28} /></div>
              {c.tag && <div className="course-tag-badge">{c.tag}</div>}
              {!user?.enrollments?.length && (
                <div className="lock-icon"><Lock size={13} /></div>
              )}
            </div>

            <div className="course-body">
              <h3 className="course-title">{c.title}</h3>
              <p className="course-desc">{c.description}</p>

              <div className="course-stats">
                <span className="course-stat"><Clock size={12} /> {c.duration}</span>
                <span className="course-stat"><Target size={12} /> {c.lectures} classes</span>
                <span className="course-stat"><Users size={12} /> {Number(c.enrolled_count || 0).toLocaleString()}</span>
              </div>

              <div className="course-footer">
                <div className="course-price">
                  <span className="price-amount">₹{Number(c.price).toLocaleString()}</span>
                  <span className="price-period">/ course</span>
                </div>
                <button className="enroll-btn" onClick={() => navigate(`/payment/${c.id}`, { state: { course: c } })}>
                  Enroll Now <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
