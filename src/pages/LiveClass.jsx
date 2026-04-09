import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Badge } from '../components/ui'
import { Shield, Users, Mic, MicOff, Hand, MessageSquare, AlertCircle } from 'lucide-react'
import './live.css'

export default function LiveClass() {
  const { user, isEnrolled } = useAuth()
  const navigate = useNavigate()
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [muted, setMuted] = useState(false)
  const [handRaised, setHandRaised] = useState(false)
  const [chatMsg, setChatMsg] = useState('')
  const [messages, setMessages] = useState([
    { user: 'Prof. Kumar', text: 'Welcome everyone! Today we cover Capacitors.', time: '3:02 PM', isTeacher: true },
    { user: 'Priya S.', text: 'Sir ready hai! 🙌', time: '3:03 PM' },
    { user: 'Rohit V.', text: 'Sir please slow down a bit', time: '3:04 PM' },
  ])
  const [viewers] = useState(142)

  // Security: Disable right-click
  useEffect(() => {
    const noContext = (e) => e.preventDefault()
    document.addEventListener('contextmenu', noContext)

    // Disable F12 / DevTools shortcuts
    const noDevTools = (e) => {
      if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key))) {
        e.preventDefault()
      }
    }
    document.addEventListener('keydown', noDevTools)

    // Detect DevTools open via size
    const devToolsCheck = setInterval(() => {
      if (window.outerWidth - window.innerWidth > 160 || window.outerHeight - window.innerHeight > 160) {
        document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;color:#fff;background:#0a0a0f;text-align:center"><div><h2>⚠️ Developer tools detected</h2><p>Please close DevTools to continue watching.</p></div></div>'
      }
    }, 1000)

    return () => {
      document.removeEventListener('contextmenu', noContext)
      document.removeEventListener('keydown', noDevTools)
      clearInterval(devToolsCheck)
    }
  }, [])

  // Watermark overlay
  const watermarkText = `${user?.name} · ${user?.id} · EduPlatform`

  // Redirect if not paid
  const hasAccess = user?.enrollments?.length > 0 || user?.role === "admin"
  if (!hasAccess) {
    return (
      <div className="live-gate container">
        <div className="gate-card">
          <AlertCircle size={48} color="var(--amber)" />
          <h2>Access Restricted</h2>
          <p>You need to purchase a course to access live classes.</p>
          <button className="btn btn-primary btn-md" onClick={() => navigate('/courses')}>
            Browse Courses
          </button>
        </div>
      </div>
    )
  }

  const sendMessage = (e) => {
    e.preventDefault()
    if (!chatMsg.trim()) return
    setMessages(prev => [...prev, {
      user: user.name?.split(' ')[0] || 'You',
      text: chatMsg,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }])
    setChatMsg('')
  }

  return (
    <div className="live-page">
      <div className="live-layout">
        {/* Video area */}
        <div className="live-main">
          <div className="video-container" onContextMenu={e => e.preventDefault()}>
            {/* Watermark */}
            <div className="watermark watermark-tl">{watermarkText}</div>
            <div className="watermark watermark-br">{watermarkText}</div>
            <div className="watermark watermark-center">{watermarkText}</div>

            {/* Video placeholder — replace src with actual stream URL */}
            <div className="video-placeholder">
              <div className="video-play-icon">▶</div>
              <p className="video-placeholder-text">
                Live stream loads here<br />
                <span>(Cloudflare Stream / Mux HLS embed)</span>
              </p>
            </div>

            {/* Live overlay info */}
            <div className="video-overlay-top">
              <Badge color="red">🔴 Live</Badge>
              <span className="viewer-count"><Users size={13} /> {viewers} watching</span>
            </div>

            {/* DRM notice */}
            <div className="drm-notice">
              <Shield size={12} /> Recording protected
            </div>
          </div>

          {/* Class info */}
          <div className="class-info-bar">
            <div className="class-info-left">
              <h2 className="live-title">Physics — Electrostatics: Capacitors</h2>
              <p className="live-teacher">Prof. Rajesh Kumar · JEE Advanced Batch 2025</p>
            </div>
            <div className="live-controls">
              <button
                className={`ctrl-btn ${muted ? 'ctrl-active' : ''}`}
                onClick={() => setMuted(!muted)}
                title={muted ? 'Unmute' : 'Mute'}
              >
                {muted ? <MicOff size={16} /> : <Mic size={16} />}
              </button>
              <button
                className={`ctrl-btn ${handRaised ? 'ctrl-active' : ''}`}
                onClick={() => setHandRaised(!handRaised)}
                title="Raise Hand"
              >
                <Hand size={16} />
                {handRaised && <span className="ctrl-indicator" />}
              </button>
            </div>
          </div>
        </div>

        {/* Chat sidebar */}
        <div className="live-sidebar">
          <div className="chat-header">
            <MessageSquare size={16} />
            <span>Live Chat</span>
            <span className="chat-count">{messages.length}</span>
          </div>

          <div className="chat-messages">
            {messages.map((m, i) => (
              <div key={i} className={`chat-msg ${m.isTeacher ? 'chat-teacher' : ''}`}>
                <div className="chat-meta">
                  <span className="chat-user">{m.user}</span>
                  {m.isTeacher && <Badge color="accent">Teacher</Badge>}
                  <span className="chat-time">{m.time}</span>
                </div>
                <p className="chat-text">{m.text}</p>
              </div>
            ))}
          </div>

          <form className="chat-input-wrap" onSubmit={sendMessage}>
            <input
              className="chat-input"
              placeholder="Type a message..."
              value={chatMsg}
              onChange={e => setChatMsg(e.target.value)}
            />
            <button type="submit" className="chat-send">Send</button>
          </form>
        </div>
      </div>
    </div>
  )
}
