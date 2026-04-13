import { useState, useEffect } from 'react'
import { Plus, Trash2, Video, Calendar, Clock, X } from 'lucide-react'
import { Badge } from '../components/ui'
import './dashboard.css'
import './admin.css'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const getToken  = () => localStorage.getItem('edtech_token')
const authFetch = (url, opts={}) => fetch(url, {
  ...opts,
  headers: { 'Content-Type':'application/json', Authorization:`Bearer ${getToken()}`, ...opts.headers }
})

function AddClassModal({ courses, onClose, onSave }) {
  const [form, setForm] = useState({
    course_id: '', title: '', subject: '', teacher_name: '',
    scheduled_at: '', duration_min: 90
  })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const set = k => e => setForm({ ...form, [k]: e.target.value })

  const SUBJECTS = ['Mathematics', 'Reasoning', 'English', 'General Studies']

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.course_id || !form.title || !form.subject || !form.scheduled_at) {
      return setError('Course, Title, Subject aur Time required hain')
    }
    setLoading(true)
    try {
      const res  = await authFetch(`${BASE_URL}/admin/live-classes`, {
        method: 'POST',
        body: JSON.stringify({ ...form, duration_min: parseInt(form.duration_min) })
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.message)
      onSave(); onClose()
    } catch (err) {
      setError(err.message || 'Class add nahi ho saki')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Live Class Schedule Karo</h2>
          <button className="modal-close" onClick={onClose}><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="modal-field">
            <label>Course *</label>
            <select className="modal-input" value={form.course_id} onChange={set('course_id')}>
              <option value="">Course select karo</option>
              {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
          </div>
          <div className="modal-field">
            <label>Class Topic *</label>
            <input className="modal-input" placeholder="e.g. Number System — HCF & LCM"
              value={form.title} onChange={set('title')} />
          </div>
          <div className="modal-row">
            <div className="modal-field">
              <label>Subject *</label>
              <select className="modal-input" value={form.subject} onChange={set('subject')}>
                <option value="">Select</option>
                {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="modal-field">
              <label>Teacher Name</label>
              <input className="modal-input" placeholder="Disha Faculty"
                value={form.teacher_name} onChange={set('teacher_name')} />
            </div>
          </div>
          <div className="modal-row">
            <div className="modal-field">
              <label>Date & Time *</label>
              <input className="modal-input" type="datetime-local"
                value={form.scheduled_at} onChange={set('scheduled_at')} />
            </div>
            <div className="modal-field">
              <label>Duration (minutes)</label>
              <input className="modal-input" type="number" placeholder="90"
                value={form.duration_min} onChange={set('duration_min')} />
            </div>
          </div>

          <div className="live-class-info">
            <Video size={14} />
            <span>Class automatically <strong>Jitsi Meet</strong> ke through platform pe host hogi.
            Koi external link nahi — students seedha yahan join karenge. ✅</span>
          </div>

          {error && <div className="auth-error">{error}</div>}
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary btn-md" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary btn-md" disabled={loading}>
              {loading ? 'Scheduling...' : 'Schedule Class'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function AdminLiveClass() {
  const [classes, setClasses]   = useState([])
  const [courses, setCourses]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [showModal, setShowModal] = useState(false)

  const load = async () => {
    try {
      const [classRes, courseRes] = await Promise.all([
        authFetch(`${BASE_URL}/admin/live-classes`),
        fetch(`${BASE_URL}/courses`)
      ])
      const [classData, courseData] = await Promise.all([classRes.json(), courseRes.json()])
      if (classData.success)  setClasses(classData.classes || [])
      if (courseData.success) setCourses(courseData.courses || [])
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const deleteClass = async (id) => {
    if (!window.confirm('Yeh class delete karni hai?')) return
    await authFetch(`${BASE_URL}/admin/live-classes/${id}`, { method: 'DELETE' })
    load()
  }

  const setLive = async (id) => {
    await authFetch(`${BASE_URL}/admin/live-classes/${id}/start`, { method: 'POST' })
    load()
  }

  const endClass = async (id) => {
    await authFetch(`${BASE_URL}/admin/live-classes/${id}/end`, { method: 'POST' })
    load()
  }

  const formatDateTime = (iso) => {
    if (!iso) return ''
    return new Date(iso).toLocaleString('en-IN', {
      day:'numeric', month:'short', hour:'2-digit', minute:'2-digit'
    })
  }

  return (
    <div className="dashboard-page container fade-up">
      {showModal && <AddClassModal courses={courses} onClose={() => setShowModal(false)} onSave={load} />}

      <div className="dashboard-header">
        <div>
          <h1 className="page-title">Live Classes</h1>
          <p className="page-sub">Schedule karo aur manage karo saari live classes</p>
        </div>
        <button className="btn btn-primary btn-md" onClick={() => setShowModal(true)}>
          <Plus size={16} /> Schedule Class
        </button>
      </div>

      {/* How it works box */}
      <div className="how-it-works">
        <h3>📡 Live Class kaise kaam karta hai?</h3>
        <div className="how-steps">
          <div className="how-step">
            <div className="how-num">1</div>
            <div>Admin yahan class schedule kare — subject, topic, time</div>
          </div>
          <div className="how-step">
            <div className="how-num">2</div>
            <div>Scheduled time pe class "Live" mark karo (Start button)</div>
          </div>
          <div className="how-step">
            <div className="how-num">3</div>
            <div>Students dashboard pe "Join" button dikhega — click karte hi class mein aa jayenge</div>
          </div>
          <div className="how-step">
            <div className="how-num">4</div>
            <div>Class platform ke andar hi hogi (Jitsi) — koi external link nahi, sirf enrolled students join kar sakte hain</div>
          </div>
        </div>
      </div>

      {/* Classes list */}
      <div className="card" style={{ marginTop:'1.5rem' }}>
        <div className="section-head">
          <h2 className="section-heading">Scheduled Classes ({classes.length})</h2>
        </div>

        {loading ? (
          <div style={{ padding:'1rem', color:'var(--text-secondary)' }}>Loading...</div>
        ) : classes.length === 0 ? (
          <div style={{ padding:'2rem', textAlign:'center', color:'var(--text-secondary)' }}>
            Koi class scheduled nahi. Pehli class schedule karo! 👆
          </div>
        ) : (
          <div className="admin-table">
            <div className="table-head" style={{ gridTemplateColumns:'2fr 1fr 1fr 1fr 1fr 120px' }}>
              <span>Class Topic</span><span>Subject</span><span>Course</span><span>Scheduled</span><span>Status</span><span>Actions</span>
            </div>
            {classes.map((cls, i) => (
              <div className="table-row" key={cls.id||i} style={{ gridTemplateColumns:'2fr 1fr 1fr 1fr 1fr 120px' }}>
                <div>
                  <div className="table-name">{cls.title}</div>
                  <div className="table-email">{cls.teacher_name} · {cls.duration_min} min</div>
                </div>
                <span><Badge color="blue">{cls.subject}</Badge></span>
                <span className="table-date" style={{ fontSize:'11px' }}>{cls.course_title || '—'}</span>
                <span className="table-date">{formatDateTime(cls.scheduled_at)}</span>
                <span>
                  {cls.status === 'live'      && <Badge color="red">🔴 Live</Badge>}
                  {cls.status === 'scheduled' && <Badge color="gray">Scheduled</Badge>}
                  {cls.status === 'ended'     && <Badge color="green">Ended</Badge>}
                </span>
                <div className="table-actions" style={{ gap:'4px' }}>
                  {cls.status === 'scheduled' && (
                    <button className="btn btn-primary btn-sm" style={{ fontSize:'11px', padding:'5px 10px' }}
                      onClick={() => setLive(cls.id)}>
                      Start
                    </button>
                  )}
                  {cls.status === 'live' && (
                    <button className="btn btn-danger btn-sm" style={{ fontSize:'11px', padding:'5px 10px' }}
                      onClick={() => endClass(cls.id)}>
                      End
                    </button>
                  )}
                  <button className="icon-action icon-action-danger" onClick={() => deleteClass(cls.id)}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
