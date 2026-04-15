import { useState, useEffect } from 'react'
import { Plus, Trash2, Video, X, Play, Square, Upload } from 'lucide-react'
import { Badge } from '../components/ui'
import './dashboard.css'
import './admin.css'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const getToken = () => localStorage.getItem('edtech_token')
const authFetch = (url, opts = {}) => fetch(url, {
  ...opts,
  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}`, ...opts.headers }
})

// ── IST Timezone Helpers ──────────────────────────────────────────
// datetime-local input ke liye IST default value
const nowISTInput = () => {
  const now = new Date()
  const istOffset = 5.5 * 60 * 60000 // IST = UTC + 5:30
  const ist = new Date(now.getTime() + istOffset)
  return ist.toISOString().slice(0, 16)
}

// User ka IST input → UTC ISO (DB ke liye)
const istToUTC = (localVal) => {
  // localVal = "2025-04-15T14:30" — IST mein daala hai user ne
  const [date, time] = localVal.split('T')
  const [y, m, d] = date.split('-').map(Number)
  const [h, min] = time.split(':').map(Number)
  const istMs = Date.UTC(y, m - 1, d, h, min)
  const utcMs = istMs - 330 * 60000 // IST - 5:30 = UTC
  return new Date(utcMs).toISOString()
}

// DB UTC → IST readable string
const fmtIST = (iso) => {
  if (!iso) return ''
  return new Date(iso).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }) + ' IST'
}

// ── Recording Modal ───────────────────────────────────────────────
function RecordingModal({ cls, onClose, onSave }) {
  const [url, setUrl] = useState(cls.recording_url || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const save = async () => {
    if (!url.trim()) return setError('URL required hai')
    setLoading(true)
    try {
      const res = await authFetch(`${BASE_URL}/admin/live-classes/${cls.id}/recording`, {
        method: 'POST', body: JSON.stringify({ recording_url: url.trim() })
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.message)
      onSave(); onClose()
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '460px' }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Recording Add Karo</h2>
          <button className="modal-close" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="modal-form">
          <div className="modal-field">
            <label style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Class: <strong>{cls.title}</strong>
            </label>
          </div>
          <div className="modal-field">
            <label>Recording URL *</label>
            <input className="modal-input"
              placeholder="YouTube unlisted link ya Google Drive video link"
              value={url} onChange={e => setUrl(e.target.value)} />
            <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '6px' }}>
              💡 YouTube → Upload → Share → <strong>Unlisted</strong> → Link copy karo
            </div>
          </div>
          {error && <div className="auth-error">{error}</div>}
          <div className="modal-actions">
            <button className="btn btn-secondary btn-md" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary btn-md" disabled={loading} onClick={save}>
              {loading ? 'Saving...' : 'Save Recording'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Schedule Modal ────────────────────────────────────────────────
function ScheduleModal({ courses, onClose, onSave }) {
  const [form, setForm] = useState({
    course_id: '',
    title: '',
    subject: '',
    teacher_name: 'Disha Faculty',
    scheduled_at: nowISTInput(),   // default = IST abhi
    duration_min: 90
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const set = k => e => setForm({ ...form, [k]: e.target.value })
  const SUBJECTS = ['Mathematics', 'Reasoning', 'English', 'General Studies']

  const submit = async (e) => {
    e.preventDefault()
    if (!form.course_id || !form.title || !form.subject || !form.scheduled_at)
      return setError('Course, Title, Subject aur Time sab required hain')
    setLoading(true)
    try {
      const utcTime = istToUTC(form.scheduled_at)   // IST → UTC
      const res = await authFetch(`${BASE_URL}/admin/live-classes`, {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          scheduled_at: utcTime,
          duration_min: parseInt(form.duration_min)
        })
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.message)
      onSave(); onClose()
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Live Class Schedule Karo</h2>
          <button className="modal-close" onClick={onClose}><X size={18} /></button>
        </div>
        <form onSubmit={submit} className="modal-form">
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
              <input className="modal-input" value={form.teacher_name} onChange={set('teacher_name')} />
            </div>
          </div>
          <div className="modal-row">
            <div className="modal-field">
              <label>Date &amp; Time (IST) *</label>
              <input className="modal-input" type="datetime-local"
                value={form.scheduled_at} onChange={set('scheduled_at')} />
              <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '4px' }}>
                🕐 Indian Standard Time (IST) mein daalo — auto convert hoga
              </div>
            </div>
            <div className="modal-field">
              <label>Duration (minutes)</label>
              <input className="modal-input" type="number"
                value={form.duration_min} onChange={set('duration_min')} />
            </div>
          </div>

          <div className="live-class-info">
            <Video size={14} style={{ flexShrink: 0 }} />
            <div>
              Class <strong>website ke andar</strong> hogi — students bina platform chhode join kar sakte hain.
              Teacher ko sirf <strong>Start</strong> dabana hai. ✅
            </div>
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

// ── Main Page ─────────────────────────────────────────────────────
export default function AdminLiveClass() {
  const [classes, setClasses] = useState([])
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showSchedule, setShowSchedule] = useState(false)
  const [recordModal, setRecordModal] = useState(null)

  const load = async () => {
    setLoading(true)
    try {
      const [r1, r2] = await Promise.all([
        authFetch(`${BASE_URL}/admin/live-classes`),
        fetch(`${BASE_URL}/courses`)
      ])
      const [d1, d2] = await Promise.all([r1.json(), r2.json()])
      if (d1.success) setClasses(d1.classes || [])
      if (d2.success) setCourses(d2.courses || [])
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const setLive = async id => { await authFetch(`${BASE_URL}/admin/live-classes/${id}/start`, { method: 'POST' }); load() }
  const endCls = async id => { await authFetch(`${BASE_URL}/admin/live-classes/${id}/end`, { method: 'POST' }); load() }
  const deleteCls = async id => {
    if (!window.confirm('Is class ko delete karna chahte ho?')) return
    await authFetch(`${BASE_URL}/admin/live-classes/${id}`, { method: 'DELETE' })
    load()
  }

  const live = classes.filter(c => c.status === 'live')
  const upcoming = classes.filter(c => c.status === 'scheduled')
  const ended = classes.filter(c => c.status === 'ended')

  return (
    <div className="dashboard-page container fade-up">
      {showSchedule && <ScheduleModal courses={courses} onClose={() => setShowSchedule(false)} onSave={load} />}
      {recordModal && <RecordingModal cls={recordModal} onClose={() => setRecordModal(null)} onSave={load} />}

      <div className="dashboard-header">
        <div>
          <h1 className="page-title">Live Classes</h1>
          <p className="page-sub">Schedule, manage aur recordings add karo</p>
        </div>
        <button className="btn btn-primary btn-md" onClick={() => setShowSchedule(true)}>
          <Plus size={16} /> Schedule Class
        </button>
      </div>

      {/* How it works */}
      <div className="how-it-works">
        <h3>📡 Live Class System</h3>
        <div className="how-steps">
          <div className="how-step"><div className="how-num">1</div><div>Class schedule karo — IST time mein daalo, auto convert hoga</div></div>
          <div className="how-step"><div className="how-num">2</div><div>Time pe <strong>Start Now</strong> dabao → class LIVE ho jaati hai</div></div>
          <div className="how-step"><div className="how-num">3</div><div>Students dashboard pe <strong>Join Now</strong> dikhta hai → website ke andar video call</div></div>
          <div className="how-step"><div className="how-num">4</div><div>Khatam hone pe <strong>End</strong> dabao → YouTube recording URL add karo</div></div>
        </div>
      </div>

      {loading && <div style={{ padding: '2rem', color: 'var(--text-secondary)', textAlign: 'center' }}>Loading...</div>}

      {/* LIVE NOW */}
      {live.length > 0 && (
        <div className="card" style={{ marginTop: '1.5rem', borderColor: 'rgba(239,68,68,0.3)' }}>
          <div className="section-head">
            <h2 className="section-heading" style={{ color: 'var(--red)' }}>🔴 Live Now ({live.length})</h2>
          </div>
          {live.map(cls => (
            <div key={cls.id} className="class-item class-live" style={{ marginBottom: '8px' }}>
              <div className="class-info" style={{ flex: 1 }}>
                <div className="class-top">
                  <span className="class-subject">{cls.subject}</span>
                  <Badge color="red">🔴 LIVE</Badge>
                </div>
                <p className="class-topic">{cls.title}</p>
                <p className="class-teacher">{cls.teacher_name} · {cls.course_title}</p>
              </div>
              <button className="btn btn-danger btn-sm" onClick={() => endCls(cls.id)}>
                <Square size={13} /> End Class
              </button>
              <button
                className="btn btn-success btn-sm"
                onClick={() => {
                  const room = cls.stream_url || `disha-class-${cls.id}`
                  window.open(`https://meet.jit.si/${room}`, '_blank')
                }}
              >
                🎥 Enter Class
              </button>
            </div>
          ))}
        </div>
      )}

      {/* UPCOMING */}
      <div className="card" style={{ marginTop: '1.5rem' }}>
        <div className="section-head">
          <h2 className="section-heading">Upcoming ({upcoming.length})</h2>
        </div>
        {upcoming.length === 0
          ? <div style={{ padding: '1.5rem', color: 'var(--text-secondary)', textAlign: 'center' }}>Koi class nahi. Schedule karo!</div>
          : upcoming.map(cls => (
            <div key={cls.id} className="class-item" style={{ marginBottom: '8px' }}>
              <div className="class-info" style={{ flex: 1 }}>
                <div className="class-top">
                  <span className="class-subject">{cls.subject}</span>
                  <Badge color="gray">{fmtIST(cls.scheduled_at)}</Badge>
                </div>
                <p className="class-topic">{cls.title}</p>
                <p className="class-teacher">{cls.teacher_name} · {cls.course_title}</p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn btn-primary btn-sm" onClick={() => setLive(cls.id)}>
                  <Play size={13} /> Start Now
                </button>
                <button className="icon-action icon-action-danger" onClick={() => deleteCls(cls.id)}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
      </div>

      {/* ENDED + RECORDINGS */}
      <div className="card" style={{ marginTop: '1.5rem' }}>
        <div className="section-head">
          <h2 className="section-heading">Ended — Recordings ({ended.length})</h2>
        </div>
        {ended.length === 0
          ? <div style={{ padding: '1.5rem', color: 'var(--text-secondary)', textAlign: 'center' }}>Koi ended class nahi.</div>
          : ended.map(cls => (
            <div key={cls.id} className="class-item" style={{ marginBottom: '8px' }}>
              <div className="class-info" style={{ flex: 1 }}>
                <div className="class-top">
                  <span className="class-subject">{cls.subject}</span>
                  <Badge color="green">Ended</Badge>
                  {cls.recording_url && <Badge color="blue">📹 Recording</Badge>}
                </div>
                <p className="class-topic">{cls.title}</p>
                <p className="class-teacher">{cls.teacher_name} · {fmtIST(cls.scheduled_at)}</p>
                {cls.recording_url && (
                  <a href={cls.recording_url} target="_blank" rel="noreferrer"
                    style={{ fontSize: '12px', color: 'var(--accent)', marginTop: '4px', display: 'block' }}>
                    🔗 Recording dekho
                  </a>
                )}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn btn-secondary btn-sm" onClick={() => setRecordModal(cls)}>
                  <Upload size={13} /> {cls.recording_url ? 'Update' : 'Add'} Recording
                </button>
                <button className="icon-action icon-action-danger" onClick={() => deleteCls(cls.id)}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}
