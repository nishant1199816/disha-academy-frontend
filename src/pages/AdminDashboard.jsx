import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { StatCard, Badge } from '../components/ui'
import { Users, BookOpen, IndianRupee, TrendingUp, Plus, Eye, Trash2, X, Check } from 'lucide-react'
import './dashboard.css'
import './admin.css'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const getToken  = () => localStorage.getItem('edtech_token')
const authFetch = (url, opts = {}) => fetch(url, {
  ...opts,
  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}`, ...opts.headers }
})

// ── Add Course Modal ──────────────────────────────────────────────
function AddCourseModal({ onClose, onSave }) {
  const [form, setForm] = useState({
    title: '', exam_type: '', price: '', duration: '', lectures: '', description: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const set = k => e => setForm({ ...form, [k]: e.target.value })

  const EXAMS = ['SSC CGL','SSC CHSL','Delhi Police','UP Police','Haryana Police','Chandigarh Police','Railway','DSSSB']

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title || !form.exam_type || !form.price) return setError('Title, Exam type aur Price required hain')
    setLoading(true)
    try {
      const slug = form.title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'') + '-' + Date.now()
      const res  = await authFetch(`${BASE_URL}/admin/courses`, {
        method: 'POST',
        body: JSON.stringify({ ...form, slug, price: parseInt(form.price), lectures: parseInt(form.lectures) || 0 })
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.message)
      onSave()
      onClose()
    } catch (err) {
      setError(err.message || 'Course add nahi ho saka')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>New Course Add Karo</h2>
          <button className="modal-close" onClick={onClose}><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="modal-field">
            <label>Course Title *</label>
            <input className="modal-input" placeholder="e.g. SSC CGL Complete Batch 2025" value={form.title} onChange={set('title')} />
          </div>
          <div className="modal-row">
            <div className="modal-field">
              <label>Exam Type *</label>
              <select className="modal-input" value={form.exam_type} onChange={set('exam_type')}>
                <option value="">Select exam</option>
                {EXAMS.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
            <div className="modal-field">
              <label>Price (₹) *</label>
              <input className="modal-input" type="number" placeholder="4999" value={form.price} onChange={set('price')} />
            </div>
          </div>
          <div className="modal-row">
            <div className="modal-field">
              <label>Duration</label>
              <input className="modal-input" placeholder="6 months" value={form.duration} onChange={set('duration')} />
            </div>
            <div className="modal-field">
              <label>Total Lectures</label>
              <input className="modal-input" type="number" placeholder="200" value={form.lectures} onChange={set('lectures')} />
            </div>
          </div>
          <div className="modal-field">
            <label>Description</label>
            <textarea className="modal-input" rows={3} placeholder="Course description..." value={form.description} onChange={set('description')} />
          </div>
          {error && <div className="auth-error">{error}</div>}
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary btn-md" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary btn-md" disabled={loading}>
              {loading ? 'Adding...' : 'Add Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Main Admin Dashboard ──────────────────────────────────────────
export default function AdminDashboard() {
  const location  = useLocation()
  const navigate  = useNavigate()
  const tab       = location.pathname.includes('/courses') ? 'courses'
                  : location.pathname.includes('/students') ? 'students'
                  : 'dashboard'

  const [stats, setStats]         = useState(null)
  const [students, setStudents]   = useState([])
  const [payments, setPayments]   = useState([])
  const [courses, setCourses]     = useState([])
  const [loading, setLoading]     = useState(true)
  const [showModal, setShowModal] = useState(false)

  const loadDashboard = async () => {
    try {
      const res  = await authFetch(`${BASE_URL}/admin/dashboard`)
      const data = await res.json()
      if (data.success) {
        setStats(data.stats)
        setStudents(data.recent_students || [])
        setPayments(data.recent_payments || [])
      }
    } catch (err) { console.error(err) }
  }

  const loadCourses = async () => {
    try {
      const res  = await fetch(`${BASE_URL}/courses`)
      const data = await res.json()
      if (data.success) setCourses(data.courses || [])
    } catch (err) { console.error(err) }
  }

  useEffect(() => {
    setLoading(true)
    Promise.all([loadDashboard(), loadCourses()]).finally(() => setLoading(false))
  }, [])

  const deleteCourse = async (id) => {
    if (!window.confirm('Yeh course delete karna chahte ho?')) return
    try {
      await authFetch(`${BASE_URL}/admin/courses/${id}`, { method: 'DELETE' })
      loadCourses()
    } catch {}
  }

  const deleteStudent = async (id) => {
    if (!window.confirm('Yeh student delete karna chahte ho?')) return
    try {
      await authFetch(`${BASE_URL}/admin/students/${id}`, { method: 'DELETE' })
      loadDashboard()
    } catch {}
  }

  return (
    <div className="dashboard-page container fade-up">
      {showModal && <AddCourseModal onClose={() => setShowModal(false)} onSave={loadCourses} />}

      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="page-sub">Platform overview — last 30 days</p>
        </div>
        <button className="btn btn-primary btn-md" onClick={() => setShowModal(true)}>
          <Plus size={16} /> Add Course
        </button>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <StatCard label="Total Students" value={String(stats?.total_students || 0)} sub="+48 this week"       icon={<Users size={18} />}       color="blue" />
        <StatCard label="Revenue (MTD)"  value={`₹${Math.round((stats?.monthly_revenue || 0)/100)*100}`} sub="+12% vs last month" icon={<IndianRupee size={18} />} color="green" />
        <StatCard label="Active Courses" value={String(courses.length || 0)} sub="total courses"          icon={<BookOpen size={18} />}    color="accent" />
        <StatCard label="Enrollments"    value={String(stats?.total_enrollments || 0)} sub="all time"     icon={<TrendingUp size={18} />}  color="amber" />
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        <button className={`admin-tab ${tab === 'dashboard' ? 'admin-tab-active' : ''}`}  onClick={() => navigate('/admin')}>Dashboard</button>
        <button className={`admin-tab ${tab === 'courses'   ? 'admin-tab-active' : ''}`}  onClick={() => navigate('/admin/courses')}>Courses ({courses.length})</button>
        <button className={`admin-tab ${tab === 'students'  ? 'admin-tab-active' : ''}`}  onClick={() => navigate('/admin/students')}>Students ({stats?.total_students || 0})</button>
      </div>

      {/* Dashboard Tab */}
      {tab === 'dashboard' && (
        <div className="admin-grid">
          {/* Recent Students */}
          <div className="card">
            <div className="section-head">
              <h2 className="section-heading">Recent Enrollments</h2>
              <button className="btn btn-ghost btn-sm" onClick={() => navigate('/admin/students')}>View all</button>
            </div>
            <div className="admin-table">
              <div className="table-head"><span>Student</span><span>Joined</span><span>Status</span><span></span></div>
              {loading ? <div style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Loading...</div>
              : students.length === 0 ? <div style={{ padding: '1rem', color: 'var(--text-secondary)' }}>No students yet</div>
              : students.map((s, i) => (
                <div className="table-row" key={i}>
                  <div className="table-student">
                    <div className="mini-avatar">{s.name?.[0]}</div>
                    <div>
                      <div className="table-name">{s.name}</div>
                      <div className="table-email">{s.email}</div>
                    </div>
                  </div>
                  <span className="table-date">{new Date(s.created_at).toLocaleDateString('en-IN')}</span>
                  <span>{s.courses_enrolled > 0 ? <Badge color="green">Enrolled</Badge> : <Badge color="amber">Free</Badge>}</span>
                  <div className="table-actions">
                    <button className="icon-action" onClick={() => deleteStudent(s.id)}><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment History */}
          <div className="card">
            <div className="section-head">
              <h2 className="section-heading">Payment History</h2>
            </div>
            <div className="payments-list">
              {loading ? <div style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Loading...</div>
              : payments.length === 0 ? <div style={{ padding: '1rem', color: 'var(--text-secondary)' }}>No payments yet</div>
              : payments.map((p, i) => (
                <div className="payment-row" key={i}>
                  <div className="mini-avatar">{p.student_name?.[0]}</div>
                  <div className="payment-info">
                    <div className="payment-name">{p.student_name}</div>
                    <div className="payment-course">{p.course_title}</div>
                  </div>
                  <div className="payment-right-col">
                    <div className="payment-amount">₹{Number(p.amount).toLocaleString()}</div>
                    <div className="payment-meta">
                      <span className="payment-method">{p.payment_method || 'UPI'}</span>
                      <Badge color={p.status === 'captured' ? 'green' : p.status === 'pending' ? 'amber' : 'red'}>
                        {p.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Courses Tab */}
      {tab === 'courses' && (
        <div className="card" style={{ marginTop: '1rem' }}>
          <div className="section-head">
            <h2 className="section-heading">All Courses ({courses.length})</h2>
            <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}><Plus size={14} /> Add Course</button>
          </div>
          <div className="admin-table">
            <div className="table-head" style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 80px' }}>
              <span>Course</span><span>Exam</span><span>Price</span><span>Lectures</span><span></span>
            </div>
            {courses.length === 0
              ? <div style={{ padding: '1rem', color: 'var(--text-secondary)' }}>No courses. Add one!</div>
              : courses.map((c, i) => (
              <div className="table-row" key={i} style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 80px' }}>
                <div className="table-student">
                  <div className="mini-avatar"><BookOpen size={14} /></div>
                  <div>
                    <div className="table-name">{c.title}</div>
                    <div className="table-email">{c.duration}</div>
                  </div>
                </div>
                <span><Badge color="blue">{c.exam_type}</Badge></span>
                <span className="table-name">₹{Number(c.price).toLocaleString()}</span>
                <span className="table-date">{c.lectures} classes</span>
                <div className="table-actions">
                  <button className="icon-action icon-action-danger" onClick={() => deleteCourse(c.id)}><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Students Tab */}
      {tab === 'students' && (
        <div className="card" style={{ marginTop: '1rem' }}>
          <div className="section-head">
            <h2 className="section-heading">All Students</h2>
          </div>
          <div className="admin-table">
            <div className="table-head" style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 60px' }}>
              <span>Student</span><span>Phone</span><span>Courses</span><span>Joined</span><span></span>
            </div>
            {loading
              ? <div style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Loading...</div>
              : students.length === 0
              ? <div style={{ padding: '1rem', color: 'var(--text-secondary)' }}>No students yet</div>
              : students.map((s, i) => (
              <div className="table-row" key={i} style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 60px' }}>
                <div className="table-student">
                  <div className="mini-avatar">{s.name?.[0]}</div>
                  <div>
                    <div className="table-name">{s.name}</div>
                    <div className="table-email">{s.email}</div>
                  </div>
                </div>
                <span className="table-date">{s.phone || '—'}</span>
                <span>{s.courses_enrolled > 0 ? <Badge color="green">{s.courses_enrolled} course</Badge> : <Badge color="gray">None</Badge>}</span>
                <span className="table-date">{new Date(s.created_at).toLocaleDateString('en-IN')}</span>
                <div className="table-actions">
                  <button className="icon-action icon-action-danger" onClick={() => deleteStudent(s.id)}><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
