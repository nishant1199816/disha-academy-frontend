import { useEffect, useState, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { Shield, Users, AlertCircle, Calendar, Clock, BookOpen, Play, Video } from 'lucide-react'
import { Badge } from '../components/ui'
import './live.css'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function LiveClass() {
  const { user }  = useAuth()
  const navigate  = useNavigate()
  const jitsiRef  = useRef(null)
  const apiRef    = useRef(null)

  const [classes, setClasses]   = useState([])
  const [selected, setSelected] = useState(null)
  const [inClass, setInClass]   = useState(false)
  const [loading, setLoading]   = useState(true)
  const [activeTab, setActiveTab] = useState('live')

  const hasAccess = user?.enrollments?.length > 0 || user?.role === 'admin' || user?.role === 'teacher'

  useEffect(() => {
    if (!user) return
    const token = localStorage.getItem('edtech_token')
    fetch(`${BASE_URL}/dashboard`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(d => { if (d.success) setClasses(d.upcoming_classes || []) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [user])

  // Also fetch ended classes with recordings
  const [recordings, setRecordings] = useState([])
  useEffect(() => {
    if (!user) return
    const token = localStorage.getItem('edtech_token')
    fetch(`${BASE_URL}/live-classes/recordings`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(d => { if (d.success) setRecordings(d.classes || []) })
      .catch(() => {})
  }, [user])

  // Load Jitsi
  useEffect(() => {
    if (window.JitsiMeetExternalAPI) return
    const s   = document.createElement('script')
    s.src     = 'https://meet.jit.si/external_api.js'
    s.async   = true
    document.head.appendChild(s)
  }, [])

  const joinClass = (cls) => {
    setSelected(cls)
    setInClass(true)
    setTimeout(() => {
      if (!window.JitsiMeetExternalAPI || !jitsiRef.current) return
      if (apiRef.current) { apiRef.current.dispose(); apiRef.current = null }

      const roomName = `disha-${cls.id?.slice(0,8)}-${(cls.subject||'class').replace(/\s+/g,'').toLowerCase()}`

      apiRef.current = new window.JitsiMeetExternalAPI('meet.jit.si', {
        roomName,
        parentNode: jitsiRef.current,
        width: '100%',
        height: '100%',
        userInfo: { displayName: user?.name, email: user?.email },
        configOverwrite: {
          startWithAudioMuted: true,
          startWithVideoMuted: true,
          disableDeepLinking:  true,
          prejoinPageEnabled:  false,
          toolbarButtons: ['microphone','camera','chat','raisehand','tileview','hangup'],
        },
        interfaceConfigOverwrite: {
          SHOW_JITSI_WATERMARK:       false,
          SHOW_WATERMARK_FOR_GUESTS:  false,
          MOBILE_APP_PROMO:           false,
          HIDE_DEEP_LINKING_LOGO:     true,
          SHOW_CHROME_EXTENSION_BANNER: false,
        },
      })
      apiRef.current.addEventListener('readyToClose',         leaveClass)
      apiRef.current.addEventListener('videoConferenceLeft',  leaveClass)
    }, 500)
  }

  const leaveClass = () => {
    if (apiRef.current) { apiRef.current.dispose(); apiRef.current = null }
    setInClass(false); setSelected(null)
  }

  useEffect(() => {
    const noCtx  = e => e.preventDefault()
    const noKeys = e => {
      if (e.key==='F12'||(e.ctrlKey&&e.shiftKey&&['I','J','C'].includes(e.key))) e.preventDefault()
    }
    document.addEventListener('contextmenu', noCtx)
    document.addEventListener('keydown', noKeys)
    return () => { document.removeEventListener('contextmenu', noCtx); document.removeEventListener('keydown', noKeys) }
  }, [])

  useEffect(() => () => { if (apiRef.current) apiRef.current.dispose() }, [])

  const fmt = (iso) => iso ? new Date(iso).toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'}) : ''
  const fmtDate = (iso) => iso ? new Date(iso).toLocaleDateString('en-IN',{day:'numeric',month:'short'}) : ''

  // Not logged in
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

  // Not enrolled
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

  // In class
  if (inClass && selected) return (
    <div className="live-page">
      <div className="wm-overlay">
        <div className="wm-text" style={{ top:'12px', left:'12px' }}>{user?.name} · {user?.email} · Disha Academy</div>
        <div className="wm-text wm-center">{user?.name} · {user?.email} · Disha Academy</div>
        <div className="wm-text" style={{ bottom:'60px', right:'16px' }}>{user?.name} · {user?.email}</div>
      </div>
      <div className="live-topbar">
        <div className="live-topbar-info">
          <Badge color="red">🔴 Live</Badge>
          <span className="live-topbar-title">{selected.subject} — {selected.title}</span>
          <span className="live-topbar-teacher">{selected.teacher_name}</span>
        </div>
        <div style={{ display:'flex', gap:'10px', alignItems:'center' }}>
          <div className="drm-badge"><Shield size={13} /> DRM Protected</div>
          <button className="leave-btn" onClick={leaveClass}>Leave Class</button>
        </div>
      </div>
      <div className="jitsi-wrap" ref={jitsiRef} />
    </div>
  )

  const liveClasses   = classes.filter(c => c.status === 'live')
  const upcomingCls   = classes.filter(c => c.status !== 'live')

  return (
    <div className="live-list-page container fade-up">
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">Classes</h1>
          <p className="page-sub">Live classes aur recorded lectures</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="admin-tabs" style={{ marginTop:'0', marginBottom:'1.5rem' }}>
        <button className={`admin-tab ${activeTab==='live'?'admin-tab-active':''}`} onClick={() => setActiveTab('live')}>
          Live &amp; Upcoming {liveClasses.length > 0 && `(${liveClasses.length} Live)`}
        </button>
        <button className={`admin-tab ${activeTab==='recorded'?'admin-tab-active':''}`} onClick={() => setActiveTab('recorded')}>
          Recorded Lectures ({recordings.length})
        </button>
      </div>

      {/* Live & Upcoming */}
      {activeTab === 'live' && (
        <>
          {loading ? (
            <div style={{ textAlign:'center', padding:'3rem', color:'var(--text-secondary)' }}>Loading...</div>
          ) : classes.length === 0 ? (
            <div className="no-classes-card">
              <BookOpen size={40} style={{ color:'var(--text-tertiary)', marginBottom:'1rem' }} />
              <h3>Koi upcoming class nahi</h3>
              <p>Jab admin class schedule karega, yahan dikhegi.</p>
            </div>
          ) : (
            <div className="classes-schedule-list">
              {[...liveClasses, ...upcomingCls].map((cls, i) => {
                const isLive = cls.status === 'live'
                return (
                  <div key={cls.id||i} className={`schedule-card ${isLive?'schedule-live':''}`}>
                    <div className="schedule-left">
                      <div className="schedule-subject-badge">{cls.subject?.[0]||'C'}</div>
                    </div>
                    <div className="schedule-info">
                      <div className="schedule-top">
                        <span className="schedule-subject">{cls.subject}</span>
                        {isLive && <Badge color="red">🔴 Live Now</Badge>}
                        {!isLive && <Badge color="gray">{fmtDate(cls.scheduled_at)} · {fmt(cls.scheduled_at)}</Badge>}
                      </div>
                      <h3 className="schedule-title">{cls.title}</h3>
                      <div className="schedule-meta">
                        <span><Users size={13} /> {cls.teacher_name}</span>
                        <span><Clock size={13} /> {fmt(cls.scheduled_at)}</span>
                        <span><Calendar size={13} /> {fmtDate(cls.scheduled_at)}</span>
                      </div>
                    </div>
                    <div className="schedule-action">
                      {isLive ? (
                        <button className="join-live-btn" onClick={() => joinClass(cls)}>Join Now →</button>
                      ) : (
                        <button className="remind-btn-schedule" disabled>Upcoming</button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}

      {/* Recorded Lectures */}
      {activeTab === 'recorded' && (
        <div className="classes-schedule-list">
          {recordings.length === 0 ? (
            <div className="no-classes-card">
              <Video size={40} style={{ color:'var(--text-tertiary)', marginBottom:'1rem' }} />
              <h3>Koi recording nahi abhi</h3>
              <p>Class khatam hone ke baad teacher recording add karega.</p>
            </div>
          ) : (
            recordings.map((cls, i) => (
              <div key={cls.id||i} className="schedule-card">
                <div className="schedule-left">
                  <div className="schedule-subject-badge" style={{ background:'var(--green-dim)', color:'var(--green)' }}>
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
                    className="join-live-btn" style={{ background:'var(--green)', textDecoration:'none', display:'inline-flex', alignItems:'center', gap:'6px' }}>
                    <Play size={14} /> Watch
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <div className="live-info-box" style={{ marginTop:'2rem' }}>
        <Shield size={16} style={{ color:'var(--accent)', flexShrink:0 }} />
        <div>Classes DRM protected hain. Aapka naam screen pe visible hoga. Recording/screenshot banned hai.</div>
      </div>
    </div>
  )
}
