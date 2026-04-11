import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { StatCard, Card, Badge, ProgressBar } from '../components/ui'
import { Link } from 'react-router-dom'
import { BookOpen, TrendingUp, FileText, ChevronRight, Zap, Play } from 'lucide-react'
import './dashboard.css'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const PROGRESS = [
  { subject: 'Mathematics', done: 72, color: 'blue' },
  { subject: 'Reasoning',   done: 58, color: 'accent' },
  { subject: 'English',     done: 85, color: 'green' },
]

const getGreeting = () => {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function Dashboard() {
  const { user } = useAuth()
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('edtech_token')
    if (!token) { setLoading(false); return }
    fetch(`${BASE_URL}/dashboard`, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
    })
      .then(r => r.json())
      .then(d => { if (d.success) setData(d) })
      .catch(err => console.error('Dashboard error:', err))
      .finally(() => setLoading(false))
  }, [])

  const upcomingClasses = data?.upcoming_classes || []
  const stats           = data?.stats || {}
  const enrolledCourses = data?.courses || []

  const formatTime = (iso) => {
    if (!iso) return ''
    return new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="dashboard-page container fade-up">
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">{getGreeting()}, {user?.name?.split(' ')[0]} 👋</h1>
          <p className="page-sub">Here's what's happening with your classes today</p>
        </div>
        <div className="header-batch">
          {enrolledCourses.length > 0
            ? <Badge color="accent">{enrolledCourses[0]?.exam_type} Batch</Badge>
            : <Badge color="gray">No Course Enrolled</Badge>
          }
          {enrolledCourses[0]?.expires_at && (
            <span className="batch-days">
              {Math.max(0, Math.ceil((new Date(enrolledCourses[0].expires_at) - new Date()) / 86400000))} days remaining
            </span>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <StatCard label="Classes Attended" value={String(stats.classes_attended || 0)} sub="total"          icon={<TrendingUp size={18} />} color="accent" />
        <StatCard label="Courses Enrolled" value={String(stats.courses_enrolled || 0)} sub="active courses" icon={<BookOpen size={18} />}    color="blue" />
        <StatCard label="Open Doubts"      value={String(stats.open_doubts || 0)}     sub="pending"         icon={<FileText size={18} />}    color="green" />
        <StatCard label="Mock Tests"       value="6"                                   sub="avg. 71% score"  icon={<Zap size={18} />}         color="amber" />
      </div>

      <div className="dashboard-grid">
        {/* Left */}
        <div className="dash-col-wide">
          <div className="section-head">
            <h2 className="section-heading">Today's Classes</h2>
            <Link to="/live" className="see-all">View all <ChevronRight size={14} /></Link>
          </div>

          <div className="classes-list">
            {loading ? (
              <p style={{ color: 'var(--text-secondary)', padding: '1rem' }}>Loading...</p>
            ) : upcomingClasses.length === 0 ? (
              <div className="class-item" style={{ display: 'block', textAlign: 'center', color: 'var(--text-secondary)' }}>
                No upcoming classes.
                {enrolledCourses.length === 0 && (
                  <span> <Link to="/courses" style={{ color: 'var(--accent)' }}>Enroll in a course</Link></span>
                )}
              </div>
            ) : (
              upcomingClasses.map((c, i) => (
                <div className={`class-item ${c.status === 'live' ? 'class-live' : ''}`} key={c.id || i}>
                  <div className="class-subject-dot" />
                  <div className="class-info">
                    <div className="class-top">
                      <span className="class-subject">{c.subject}</span>
                      {c.status === 'live'
                        ? <Badge color="red">🔴 Live Now</Badge>
                        : <Badge color="gray">{formatTime(c.scheduled_at)}</Badge>
                      }
                    </div>
                    <p className="class-topic">{c.title}</p>
                    <p className="class-teacher">{c.teacher_name}</p>
                  </div>
                  {c.status === 'live'
                    ? <Link to="/live" className="btn btn-primary btn-sm">Join</Link>
                    : <button className="btn btn-secondary btn-sm">Remind</button>
                  }
                </div>
              ))
            )}
          </div>

          {/* My Courses */}
          <div className="section-head" style={{ marginTop: '2rem' }}>
            <h2 className="section-heading">My Courses</h2>
            <Link to="/courses" className="see-all">View all <ChevronRight size={14} /></Link>
          </div>
          <div className="material-list">
            {enrolledCourses.length === 0 ? (
              <div className="material-item" style={{ display: 'block', color: 'var(--text-secondary)' }}>
                No courses yet. <Link to="/courses" style={{ color: 'var(--accent)' }}>Browse courses →</Link>
              </div>
            ) : (
              enrolledCourses.map((c, i) => (
                <div className="material-item" key={c.id || i}>
                  <div className="material-icon"><BookOpen size={16} /></div>
                  <div className="material-info">
                    <p className="material-title">{c.title}</p>
                    <p className="material-meta">{c.exam_type} · Enrolled {new Date(c.enrolled_at).toLocaleDateString('en-IN')}</p>
                  </div>
                  <button className="btn btn-ghost btn-sm">View</button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right */}
        <div className="dash-col-narrow">
          <Card>
            <h2 className="section-heading" style={{ marginBottom: '1.25rem' }}>Subject Progress</h2>
            <div className="progress-list">
              {PROGRESS.map((p, i) => (
                <div className="progress-item" key={i}>
                  <div className="progress-meta">
                    <span className="progress-subject">{p.subject}</span>
                    <span className="progress-pct">{p.done}%</span>
                  </div>
                  <ProgressBar value={p.done} color={p.color} />
                </div>
              ))}
            </div>
          </Card>

          <Card style={{ marginTop: '1rem' }}>
            <h2 className="section-heading" style={{ marginBottom: '1rem' }}>Quick Actions</h2>
            <div className="quick-actions">
              <Link to="/live"    className="quick-btn"><Play size={16} /> Watch Live</Link>
              <Link to="/courses" className="quick-btn"><BookOpen size={16} /> Browse</Link>
              <Link to="/tests"   className="quick-btn"><Zap size={16} /> Take Test</Link>
              <Link to="/doubts"  className="quick-btn"><FileText size={16} /> Post Doubt</Link>
            </div>
          </Card>

          <Card style={{ marginTop: '1rem', textAlign: 'center' }}>
            <div className="streak-flame">🔥</div>
            <div className="streak-num">14</div>
            <div className="streak-label">Day Streak</div>
            <p className="streak-sub">Study today to keep your streak!</p>
          </Card>
        </div>
      </div>
    </div>
  )
}
