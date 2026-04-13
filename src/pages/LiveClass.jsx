import { useEffect, useState, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { Shield, Users, AlertCircle, Calendar, Clock, BookOpen, ExternalLink } from 'lucide-react'
import { Badge } from '../components/ui'
import './live.css'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function LiveClass() {
  const { user } = useAuth()
  const navigate  = useNavigate()
  const jitsiRef  = useRef(null)
  const apiRef    = useRef(null)

  const [classes, setClasses]     = useState([])
  const [selected, setSelected]   = useState(null)
  const [inClass, setInClass]     = useState(false)
  const [loading, setLoading]     = useState(true)

  // Access check
  const hasAccess = user?.enrollments?.length > 0 || user?.role === 'admin' || user?.role === 'teacher'

  // Load upcoming classes from all enrolled courses
  useEffect(() => {
    if (!user) return
    const token = localStorage.getItem('edtech_token')

    // Fetch dashboard to get upcoming classes
    fetch(`${BASE_URL}/dashboard`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(d => {
        if (d.success) setClasses(d.upcoming_classes || [])
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [user])

  // Load Jitsi script
  useEffect(() => {
    if (window.JitsiMeetExternalAPI) return
    const script = document.createElement('script')
    script.src = 'https://meet.jit.si/external_api.js'
    script.async = true
    document.head.appendChild(script)
  }, [])

  // Join class with Jitsi
  const joinClass = (cls) => {
    setSelected(cls)
    setInClass(true)

    // Wait for Jitsi to load + DOM
    setTimeout(() => {
      if (!window.JitsiMeetExternalAPI || !jitsiRef.current) return

      // Cleanup old instance
      if (apiRef.current) { apiRef.current.dispose(); apiRef.current = null }

      // Room name = class ID (unique, hard to guess)
      const roomName = `disha-${cls.id?.slice(0, 8) || 'class'}-${cls.subject?.replace(/\s+/g,'').toLowerCase()}`

      apiRef.current = new window.JitsiMeetExternalAPI('meet.jit.si', {
        roomName,
        parentNode: jitsiRef.current,
        width:  '100%',
        height: '100%',
        userInfo: {
          displayName: user?.name || 'Student',
          email:       user?.email || '',
        },
        configOverwrite: {
          startWithAudioMuted:  true,
          startWithVideoMuted:  true,
          disableDeepLinking:   true,
          enableWelcomePage:    false,
          prejoinPageEnabled:   false,
          // Disable recording options for students
          toolbarButtons: user?.role === 'admin' || user?.role === 'teacher'
            ? ['microphone','camera','desktop','chat','raisehand','tileview','hangup']
            : ['microphone','camera','chat','raisehand','tileview','hangup'],
        },
        interfaceConfigOverwrite: {
          SHOW_JITSI_WATERMARK:       false,
          SHOW_WATERMARK_FOR_GUESTS:  false,
          SHOW_BRAND_WATERMARK:       false,
          TOOLBAR_ALWAYS_VISIBLE:     false,
          DISABLE_JOIN_LEAVE_NOTIFICATIONS: false,
          MOBILE_APP_PROMO:           false,
          HIDE_DEEP_LINKING_LOGO:     true,
          SHOW_CHROME_EXTENSION_BANNER: false,
        },
      })

      // Leave event
      apiRef.current.addEventListener('readyToClose', () => {
        leaveClass()
      })

      apiRef.current.addEventListener('videoConferenceLeft', () => {
        leaveClass()
      })
    }, 500)
  }

  const leaveClass = () => {
    if (apiRef.current) { apiRef.current.dispose(); apiRef.current = null }
    setInClass(false)
    setSelected(null)
  }

  // Security: disable right-click + devtools
  useEffect(() => {
    const noCtx  = e => e.preventDefault()
    const noKeys = e => {
      if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && ['I','J','C'].includes(e.key))) e.preventDefault()
    }
    document.addEventListener('contextmenu', noCtx)
    document.addEventListener('keydown', noKeys)
    return () => {
      document.removeEventListener('contextmenu', noCtx)
      document.removeEventListener('keydown', noKeys)
    }
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => { if (apiRef.current) apiRef.current.dispose() }
  }, [])

  const formatTime = (iso) => {
    if (!iso) return ''
    return new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
  }

  const formatDate = (iso) => {
    if (!iso) return ''
    return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
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
        <p>You need to purchase a course to access live classes.</p>
        <button className="btn btn-primary btn-md" onClick={() => navigate('/courses')}>Browse Courses</button>
      </div>
    </div>
  )

  // ── In class (Jitsi embed) ──
  if (inClass && selected) return (
    <div className="live-page">
      {/* Watermark overlay */}
      <div className="wm-overlay">
        <div className="wm-text">{user?.name} · {user?.email} · Disha Academy</div>
        <div className="wm-text wm-center">{user?.name} · {user?.email} · Disha Academy</div>
        <div className="wm-text wm-br">{user?.name} · {user?.email} · Disha Academy</div>
      </div>

      {/* Top bar */}
      <div className="live-topbar">
        <div className="live-topbar-info">
          <Badge color="red">🔴 Live</Badge>
          <span className="live-topbar-title">{selected.subject} — {selected.title}</span>
          <span className="live-topbar-teacher">{selected.teacher_name}</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
          <div className="drm-badge"><Shield size={13} /> DRM Protected</div>
          <button className="leave-btn" onClick={leaveClass}>Leave Class</button>
        </div>
      </div>

      {/* Jitsi container */}
      <div className="jitsi-wrap" ref={jitsiRef} />
    </div>
  )

  // ── Classes list ──
  return (
    <div className="live-list-page container fade-up">
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">Live Classes</h1>
          <p className="page-sub">Apne enrolled courses ki upcoming aur live classes</p>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign:'center', padding:'3rem', color:'var(--text-secondary)' }}>Loading classes...</div>
      ) : classes.length === 0 ? (
        <div className="no-classes-card">
          <BookOpen size={40} style={{ color:'var(--text-tertiary)', marginBottom:'1rem' }} />
          <h3>Koi upcoming class nahi</h3>
          <p>Jab teacher class schedule karega, yahan dikhegi.</p>
          {user?.enrollments?.length === 0 && (
            <Link to="/courses" className="btn btn-primary btn-md" style={{ marginTop:'1rem' }}>
              Course Enroll Karo
            </Link>
          )}
        </div>
      ) : (
        <div className="classes-schedule-list">
          {classes.map((cls, i) => {
            const isLive = cls.status === 'live'
            const scheduledDate = new Date(cls.scheduled_at)
            const now = new Date()
            const minutesUntil = Math.round((scheduledDate - now) / 60000)

            return (
              <div key={cls.id || i} className={`schedule-card ${isLive ? 'schedule-live' : ''}`}>
                <div className="schedule-left">
                  <div className={`schedule-subject-badge subject-${cls.subject?.toLowerCase().replace(/\s+/g,'')}`}>
                    {cls.subject?.[0] || 'C'}
                  </div>
                </div>
                <div className="schedule-info">
                  <div className="schedule-top">
                    <span className="schedule-subject">{cls.subject}</span>
                    {isLive && <Badge color="red">🔴 Live Now</Badge>}
                    {!isLive && minutesUntil > 0 && minutesUntil < 60 && (
                      <Badge color="amber">⏰ {minutesUntil} min mein</Badge>
                    )}
                    {!isLive && minutesUntil >= 60 && (
                      <Badge color="gray">{formatDate(cls.scheduled_at)} · {formatTime(cls.scheduled_at)}</Badge>
                    )}
                  </div>
                  <h3 className="schedule-title">{cls.title}</h3>
                  <div className="schedule-meta">
                    <span><Users size={13} /> {cls.teacher_name}</span>
                    <span><Clock size={13} /> {formatTime(cls.scheduled_at)}</span>
                    <span><Calendar size={13} /> {formatDate(cls.scheduled_at)}</span>
                  </div>
                  {cls.course_title && (
                    <span className="schedule-course">{cls.course_title}</span>
                  )}
                </div>
                <div className="schedule-action">
                  {isLive ? (
                    <button className="join-live-btn" onClick={() => joinClass(cls)}>
                      Join Now →
                    </button>
                  ) : (
                    <button className="remind-btn-schedule" disabled={minutesUntil > 30}>
                      {minutesUntil <= 30 ? 'Join Soon' : 'Upcoming'}
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Info box */}
      <div className="live-info-box">
        <Shield size={16} style={{ color:'var(--accent)', flexShrink:0 }} />
        <div>
          <strong>Security Notice:</strong> Saari classes DRM protected hain.
          Aapka naam aur email screen pe watermark ke roop mein dikhega.
          Recording ya screenshot lena banned hai.
        </div>
      </div>
    </div>
  )
}
