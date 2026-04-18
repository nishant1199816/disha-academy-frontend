import { useEffect, useState, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { Shield, AlertCircle, BookOpen, Play, Video, Users, Clock, Calendar, PhoneOff } from 'lucide-react'
import { Badge } from '../components/ui'
import './live.css'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// UTC ISO → IST readable
const fmtIST = (iso) => {
  if (!iso) return ''
  return new Date(iso).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit', month: 'short',
    hour: '2-digit', minute: '2-digit', hour12: true
  }) + ' IST'
}

const fmtTime = (iso) => {
  if (!iso) return ''
  return new Date(iso).toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: true
  })
}

const fmtDate = (iso) => {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short'
  })
}

export default function LiveClass() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [classes, setClasses] = useState([])
  const [recordings, setRecordings] = useState([])
  const [selected, setSelected] = useState(null)
  const [inClass, setInClass] = useState(false)
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('live')

  const isAdmin = user?.role === 'admin' || user?.role === 'teacher'
  const hasAccess = (user?.enrollments?.length > 0) || isAdmin

  // Fetch classes
  useEffect(() => {
    if (!user) return
    const token = localStorage.getItem('edtech_token')
    const url = isAdmin
      ? `${BASE_URL}/admin/live-classes`
      : `${BASE_URL}/dashboard`

    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => {
        if (isAdmin) {
          setClasses((d.classes || []).filter(c => c.status === 'live' || c.status === 'scheduled'))
        } else {
          setClasses(d.upcoming_classes || [])
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [user])

  // Fetch recordings
  useEffect(() => {
    if (!user) return
    const token = localStorage.getItem('edtech_token')
    fetch(`${BASE_URL}/live-classes/recordings`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(d => { if (d.success) setRecordings(d.classes || []) })
      .catch(() => { })
  }, [user])

  // Security
  useEffect(() => {
    const noCtx = e => e.preventDefault()
    const noKeys = e => {
      if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key)))
        e.preventDefault()
    }
    document.addEventListener('contextmenu', noCtx)
    document.addEventListener('keydown', noKeys)
    return () => {
      document.removeEventListener('contextmenu', noCtx)
      document.removeEventListener('keydown', noKeys)
    }
  }, [])

  const joinClass = (cls) => {
    const url = getJitsiUrl(cls)

    if (isMobile) {
      window.location.href = url   // mobile direct open
    } else {
      setSelected(cls)
      setInClass(true)             // desktop iframe
    }
  }
  const leaveClass = () => { setSelected(null); setInClass(false) }

  // Jitsi Meet URL — completely free, no account needed
  const getJitsiUrl = (cls) => {
    // Room name = unique per class using class id
    const room = cls.stream_url || `disha-class-${cls.id}`
    const name = encodeURIComponent(user?.name || 'Student')
    // meet.jit.si is 100% free, no signup, embeds via iframe
    return `https://web-production-2f860.up.railway.app/${room}#displayName=${name}&config.prejoinPageEnabled=false&config.startWithAudioMuted=true&interfaceConfig.SHOW_JITSI_WATERMARK=false`
  }

  // ── Not logged in ──
  if (!user) return (
    <div className="live-gate container">
      <div className="gate-card">
        <AlertCircle size={48} color="var(--amber)" />
        <h2>Login Required</h2>
        <p>Please login to access live classes.</p>
        <Link to="/login" className="btn btn-primary btn-md">Login</Link>
      </div>
    </div>
  )

  // ── Not enrolled ──
  if (!hasAccess) return (
    <div className="live-gate container">
      <div className="gate-card">
        <AlertCircle size={48} color="var(--amber)" />
        <h2>Access Restricted</h2>
        <p>Course purchase karo to access live classes.</p>
        <button className="btn btn-primary btn-md" onClick={() => navigate('/courses')}>Browse Courses</button>
      </div>
    </div>
  )

  // ── In class — Jitsi Meet iframe ──
  if (inClass && selected) return (
    <div className="live-page" onContextMenu={e => e.preventDefault()}>
      {/* Watermarks */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 50 }}>
        <div className="wm-text" style={{ top: '70px', left: '12px' }}>
          {user.name} · {user.email} · Disha Academy
        </div>
        <div className="wm-text wm-center">
          {user.name} · {user.email} · Disha Academy
        </div>
        <div className="wm-text" style={{ bottom: '60px', right: '16px' }}>
          {user.name} · Disha Academy
        </div>
      </div>

      {/* Top bar */}
      <div className="live-topbar">
        <div className="live-topbar-info">
          <Badge color="red">🔴 Live</Badge>
          <span className="live-topbar-title">{selected.subject} — {selected.title}</span>
          <span className="live-topbar-teacher">{selected.teacher_name}</span>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div className="drm-badge"><Shield size={13} /> DRM Protected</div>
          <button className="leave-btn" onClick={leaveClass}>
            <PhoneOff size={14} /> Leave
          </button>
        </div>
      </div>

      {/* Jitsi Meet iframe — 100% free, no account needed */}
      <div className="jitsi-wrap">
        <iframe
          src={getJitsiUrl(selected)}
          allow="camera; microphone; fullscreen; speaker; display-capture; autoplay; clipboard-read; clipboard-write"
          style={{ width: '100%', height: '100%', border: 'none' }}
          title="Live Class"
        />
      </div>
    </div>
  )

  // ── Class list ──
  const liveNow = classes.filter(c => c.status === 'live')
  const upcoming = classes.filter(c => c.status === 'scheduled')

  return (
    <div className="live-list-page container fade-up">
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">Classes</h1>
          <p className="page-sub">Live classes aur recorded lectures</p>
        </div>
        {isAdmin && (
          <Link to="/admin/live" className="btn btn-primary btn-md">Manage Classes →</Link>
        )}
      </div>

      {/* Tabs */}
      <div className="admin-tabs" style={{ marginTop: 0, marginBottom: '1.5rem' }}>
        <button className={`admin-tab ${activeTab === 'live' ? 'admin-tab-active' : ''}`}
          onClick={() => setActiveTab('live')}>
          Live &amp; Upcoming
          {liveNow.length > 0 && (
            <span style={{
              marginLeft: '6px', background: 'var(--red)', color: '#fff',
              borderRadius: '999px', padding: '1px 7px', fontSize: '10px'
            }}>
              {liveNow.length} LIVE
            </span>
          )}
        </button>
        <button className={`admin-tab ${activeTab === 'recorded' ? 'admin-tab-active' : ''}`}
          onClick={() => setActiveTab('recorded')}>
          Recorded Lectures ({recordings.length})
        </button>
      </div>

      {/* Live & Upcoming tab */}
      {activeTab === 'live' && (
        loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>Loading...</div>
        ) : classes.length === 0 ? (
          <div className="no-classes-card">
            <BookOpen size={40} style={{ color: 'var(--text-tertiary)', marginBottom: '1rem' }} />
            <h3>Koi upcoming class nahi</h3>
            <p>Jab admin class schedule karega, yahan dikhegi.</p>
          </div>
        ) : (
          <div className="classes-schedule-list">
            {[...liveNow, ...upcoming].map((cls, i) => {
              const isLive = cls.status === 'live'
              return (
                <div key={cls.id || i} className={`schedule-card ${isLive ? 'schedule-live' : ''}`}>
                  <div className="schedule-left">
                    <div className="schedule-subject-badge">{cls.subject?.[0] || 'C'}</div>
                  </div>
                  <div className="schedule-info">
                    <div className="schedule-top">
                      <span className="schedule-subject">{cls.subject}</span>
                      {isLive
                        ? <Badge color="red">🔴 Live Now</Badge>
                        : <Badge color="gray">{fmtIST(cls.scheduled_at)}</Badge>
                      }
                    </div>
                    <h3 className="schedule-title">{cls.title}</h3>
                    <div className="schedule-meta">
                      <span><Users size={13} /> {cls.teacher_name}</span>
                      <span><Clock size={13} /> {fmtTime(cls.scheduled_at)}</span>
                      <span><Calendar size={13} /> {fmtDate(cls.scheduled_at)}</span>
                    </div>
                    {cls.course_title && <span className="schedule-course">{cls.course_title}</span>}
                  </div>
                  <div className="schedule-action">
                    {isLive ? (
                      <button className="join-live-btn" onClick={() => joinClass(cls)}>
                        Join Now →
                      </button>
                    ) : (
                      <button className="remind-btn-schedule" disabled>Upcoming</button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )
      )}

      {/* Recordings tab */}
      {activeTab === 'recorded' && (
        <div className="classes-schedule-list">
          {recordings.length === 0 ? (
            <div className="no-classes-card">
              <Video size={40} style={{ color: 'var(--text-tertiary)', marginBottom: '1rem' }} />
              <h3>Koi recording nahi abhi</h3>
              <p>Class khatam hone ke baad teacher recording add karega.</p>
            </div>
          ) : recordings.map((cls, i) => (
            <div key={cls.id || i} className="schedule-card">
              <div className="schedule-left">
                <div className="schedule-subject-badge"
                  style={{ background: 'var(--green-dim)', color: 'var(--green)' }}>
                  <Play size={18} />
                </div>
              </div>
              <div className="schedule-info">
                <div className="schedule-top">
                  <span className="schedule-subject">{cls.subject}</span>
                  <Badge color="green">Recorded</Badge>
                </div>
                <h3 className="schedule-title">{cls.title}</h3>
                <div className="schedule-meta">
                  <span><Users size={13} /> {cls.teacher_name}</span>
                  <span><Calendar size={13} /> {fmtDate(cls.scheduled_at)}</span>
                </div>
                {cls.course_title && <span className="schedule-course">{cls.course_title}</span>}
              </div>
              <div className="schedule-action">
                <a href={cls.recording_url} target="_blank" rel="noreferrer"
                  className="join-live-btn"
                  style={{
                    background: 'var(--green)', textDecoration: 'none',
                    display: 'inline-flex', alignItems: 'center', gap: '6px'
                  }}>
                  <Play size={14} /> Watch
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="live-info-box" style={{ marginTop: '2rem' }}>
        <Shield size={16} style={{ color: 'var(--accent)', flexShrink: 0 }} />
        <div>Classes DRM protected hain. Aapka naam screen pe watermark dikhega. Recording banned hai.</div>
      </div>
    </div>
  )
}
