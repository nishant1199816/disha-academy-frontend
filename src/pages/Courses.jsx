import { useState, useEffect } from 'react'  // 👈 useEffect add
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { BookOpen, Clock, Users, Lock, ChevronRight, Star, FileText, Target } from 'lucide-react'
import { courseAPI } from '../api/api'   // 👈 add this
import './courses.css'

// ❌ REMOVE THIS COMPLETELY
// const COURSES = [...]

const FILTERS = ['All', 'SSC CGL', 'SSC CHSL', 'Delhi Police', 'UP Police', 'Railway', 'DSSSB']

export default function Courses() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [courses, setCourses] = useState([])   // 👈 new state
  const [filter, setFilter] = useState('All')

  // ✅ FETCH FROM BACKEND
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await courseAPI.getAll()
        console.log("Backend courses:", res.courses) // debug
        setCourses(res.courses || [])
      } catch (err) {
        console.error("Error:", err.message)
      }
    }

    fetchCourses()
  }, [])

  // 🔁 SAME LOGIC (just COURSES → courses)
  const filtered = filter === 'All' ? courses : courses.filter(c => c.name === filter)

  return (
    <div className="courses-page container fade-up">
      <div className="courses-header">
        <h1 className="page-title">Sabhi Courses</h1>
        <p className="page-sub">GPay · PhonePe · Paytm — pay karo aur turant access pao</p>
      </div>

      <div className="filter-tabs">
        {FILTERS.map(f => (
          <button key={f} className={`filter-tab ${filter === f ? 'filter-tab-active' : ''}`} onClick={() => setFilter(f)}>
            {f}
          </button>
        ))}
      </div>

      <div className="courses-grid">
        {filtered.map((c, i) => (
          <div className="course-card fade-up" key={c.id} style={{ animationDelay: `${i * 0.08}s` }}>
            <div className="course-thumb">
              <div className="course-thumb-icon"><BookOpen size={28} /></div>
              {c.tag && <div className="course-tag-badge">{c.tag}</div>}
              {!user?.paid && <div className="lock-icon"><Lock size={13} /></div>}
            </div>

            <div className="course-body">
              <h3 className="course-title">{c.title}</h3>
              <p className="course-desc">{c.desc}</p>

              <div className="course-subjects">
                {(c.subjects || []).map(s => <span key={s} className="subj-pill">{s}</span>)}
              </div>

              <div className="course-stats">
                <span className="course-stat"><Clock size={12} /> {c.duration}</span>
                <span className="course-stat"><Target size={12} /> {c.lectures} classes</span>
                <span className="course-stat"><Users size={12} /> {c.students}</span>
                <span className="course-stat"><Star size={12} fill="var(--accent)" color="var(--accent)" /> {c.rating}</span>
              </div>

              <div className="course-footer">
                <div className="course-price">
                  <span className="price-amount">₹{c.price}</span>
                  <span className="price-period">/ course</span>
                </div>

                {/* ✅ IMPORTANT: UUID yahi se jayega */}
                <button
                  className="enroll-btn"
                  onClick={() => navigate(`/payment/${c.id}`, { state: { course: c } })}
                >
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