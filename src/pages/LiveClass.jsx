import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { Badge } from '../components/ui'
import { Shield, Users, Mic, MicOff, Hand, MessageSquare, AlertCircle } from 'lucide-react'
import './live.css'

export default function LiveClass() {
  const { user } = useAuth()
  const navigate  = useNavigate()
  const [muted, setMuted]           = useState(false)
  const [handRaised, setHandRaised] = useState(false)
  const [chatMsg, setChatMsg]       = useState('')
  const [messages, setMessages]     = useState([
    { user: 'Disha Faculty', text: 'Welcome everyone! Aaj hum Number System cover karenge.', time: '10:02 AM', isTeacher: true },
    { user: 'Priya S.',      text: 'Sir ready hai! 🙌', time: '10:03 AM' },
    { user: 'Rohit V.',      text: 'Sir please slow down a bit', time: '10:04 AM' },
  ])
  const [viewers] = useState(142)

  // Security: disable right-click and DevTools
  useEffect(() => {
    const noCtx  = (e) => e.preventDefault()
    const noKeys = (e) => {
      if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && ['I','J','C'].includes(e.key))) e.preventDefault()
    }
    document.addEventListener('contextmenu', noCtx)
    document.addEventListener('keydown', noKeys)
    return () => {
      document.removeEventListener('contextmenu', noCtx)
      document.removeEventListener('keydown', noKeys)
    }
  }, [])

  // Access check — needs enrollment
  const hasAccess = (user?.enrollments?.length > 0) || user?.role === 'admin'

  if (!user) {
    return (
      <div className="live-gate container">
        <div className="gate-card">
          <AlertCircle size={48} color="var(--amber)" />
          <h2>Login Required</h2>
          <p>Please login to access live classes.</p>
          <Link to="/login" className="btn btn-primary btn-md">Login</Link>
        </div>
      </div>
    )
  }

  if (!hasAccess) {
    return (
      <div className="live-gate container">
        <div className="gate-card">
          <AlertCircle size={48} color="var(--amber)" />
          <h2>Access Restricted</h2>
          <p>You need to purchase a course to access live classes.</p>
          <button className="btn btn-primary btn-md" onClick={() => navigate('/courses')}>Browse Courses</button>
        </div>
      </div>
    )
  }

  const watermark = `${user?.name} · ${user?.id?.slice(0,8)} · Disha Academy`

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
        {/* Video */}
        <div className="live-main">
          <div className="video-container" onContextMenu={e => e.preventDefault()}>
            <div className="watermark watermark-tl">{watermark}</div>
            <div className="watermark watermark-br">{watermark}</div>
            <div className="watermark watermark-center">{watermark}</div>

            <div className="video-placeholder">
              <div className="video-play-icon">▶</div>
              <p className="video-placeholder-text">
                Live stream loads here<br />
                <span>(Cloudflare Stream / Mux HLS embed)</span>
              </p>
            </div>

            <div className="video-overlay-top">
              <Badge color="red">🔴 Live</Badge>
              <span className="viewer-count"><Users size={13} /> {viewers} watching</span>
            </div>
            <div className="drm-notice"><Shield size={12} /> Recording protected</div>
          </div>

          <div className="class-info-bar">
            <div className="class-info-left">
              <h2 className="live-title">Mathematics — Number System & Simplification</h2>
              <p className="live-teacher">Disha Faculty · SSC CGL Batch 2025</p>
            </div>
            <div className="live-controls">
              <button className={`ctrl-btn ${muted ? 'ctrl-active' : ''}`} onClick={() => setMuted(!muted)} title={muted ? 'Unmute' : 'Mute'}>
                {muted ? <MicOff size={16} /> : <Mic size={16} />}
              </button>
              <button className={`ctrl-btn ${handRaised ? 'ctrl-active' : ''}`} onClick={() => setHandRaised(!handRaised)} title="Raise Hand">
                <Hand size={16} />
                {handRaised && <span className="ctrl-indicator" />}
              </button>
            </div>
          </div>
        </div>

        {/* Chat */}
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
            <input className="chat-input" placeholder="Type a message..." value={chatMsg} onChange={e => setChatMsg(e.target.value)} />
            <button type="submit" className="chat-send">Send</button>
          </form>
        </div>
      </div>
    </div>
  )
}
