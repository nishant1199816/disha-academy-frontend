import { useAuth } from '../context/AuthContext'
import { StatCard, Card, Badge, ProgressBar, Avatar } from '../components/ui'
import { Link } from 'react-router-dom'
import { BookOpen, Clock, TrendingUp, Calendar, Play, FileText, ChevronRight, Zap } from 'lucide-react'
import './dashboard.css'

const UPCOMING_CLASSES = [
  { subject: 'Mathematics', topic: 'Number System & Simplification', time: '3:00 PM', status: 'live', teacher: 'Disha Faculty' },
  { subject: 'Reasoning', topic: 'Syllogism & Puzzles', time: '5:00 PM', status: 'upcoming', teacher: 'Disha Faculty' },
  { subject: 'English', topic: 'Error Detection & Para Jumbles', time: '7:30 PM', status: 'upcoming', teacher: 'Disha Faculty' },
]

const PROGRESS = [
  { subject: 'Mathematics', done: 72, total: 100, color: 'blue' },
  { subject: 'Reasoning', done: 58, total: 100, color: 'accent' },
  { subject: 'English', done: 85, total: 100, color: 'green' },
]

const RECENT_MATERIAL = [
  { title: 'Electrostatics — Notes PDF', type: 'pdf', subject: 'Mathematics', date: 'Today' },
  { title: 'Integration Practice Set 5', type: 'dpp', subject: 'Reasoning', date: 'Yesterday' },
  { title: 'Organic English Mind Map', type: 'pdf', subject: 'English', date: '2 days ago' },
]

export default function Dashboard() {
  const { user } = useAuth()

  return (
    <div className="dashboard-page container fade-up">
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">Good afternoon, {user?.name?.split(' ')[0]} 👋</h1>
          <p className="page-sub">Here's what's happening with your classes today</p>
        </div>
        <div className="header-batch">
          <Badge color="accent">SSC CGL 2025 Batch</Badge>
          <span className="batch-days">84 days remaining</span>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <StatCard label="Attendance" value="84%" sub="38 of 45 classes" icon={<TrendingUp size={18} />} color="accent" />
        <StatCard label="Content Watched" value="127 hrs" sub="this month" icon={<Clock size={18} />} color="blue" />
        <StatCard label="Assignments Done" value="14/18" sub="4 pending" icon={<FileText size={18} />} color="green" />
        <StatCard label="Mock Tests" value="6" sub="avg. 71% score" icon={<Zap size={18} />} color="amber" />
      </div>

      <div className="dashboard-grid">
        {/* Today's Classes */}
        <div className="dash-col-wide">
          <div className="section-head">
            <h2 className="section-heading">Today's Classes</h2>
            <Link to="/live" className="see-all">View all <ChevronRight size={14} /></Link>
          </div>

          <div className="classes-list">
            {UPCOMING_CLASSES.map((c, i) => (
              <div className={`class-item ${c.status === 'live' ? 'class-live' : ''}`} key={i}>
                <div className="class-subject-dot" data-subject={c.subject[0]} />
                <div className="class-info">
                  <div className="class-top">
                    <span className="class-subject">{c.subject}</span>
                    {c.status === 'live' && <Badge color="red">🔴 Live Now</Badge>}
                    {c.status === 'upcoming' && <Badge color="gray">{c.time}</Badge>}
                  </div>
                  <p className="class-topic">{c.topic}</p>
                  <p className="class-teacher">{c.teacher}</p>
                </div>
                {c.status === 'live'
                  ? <Link to="/live" className="btn btn-primary btn-sm">Join</Link>
                  : <button className="btn btn-secondary btn-sm">Remind</button>
                }
              </div>
            ))}
          </div>

          {/* Recent Material */}
          <div className="section-head" style={{ marginTop: '2rem' }}>
            <h2 className="section-heading">Recent Material</h2>
            <Link to="/courses" className="see-all">View all <ChevronRight size={14} /></Link>
          </div>
          <div className="material-list">
            {RECENT_MATERIAL.map((m, i) => (
              <div className="material-item" key={i}>
                <div className="material-icon">
                  {m.type === 'pdf' ? <FileText size={16} /> : <BookOpen size={16} />}
                </div>
                <div className="material-info">
                  <p className="material-title">{m.title}</p>
                  <p className="material-meta">{m.subject} · {m.date}</p>
                </div>
                <button className="btn btn-ghost btn-sm">View</button>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="dash-col-narrow">
          {/* Progress */}
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

          {/* Quick Actions */}
          <Card style={{ marginTop: '1rem' }}>
            <h2 className="section-heading" style={{ marginBottom: '1rem' }}>Quick Actions</h2>
            <div className="quick-actions">
              <Link to="/live" className="quick-btn">
                <Play size={16} /> Watch Live
              </Link>
              <Link to="/courses" className="quick-btn">
                <BookOpen size={16} /> Browse Content
              </Link>
              <Link to="/tests" className="quick-btn">
                <Zap size={16} /> Take a Test
              </Link>
              <Link to="/doubts" className="quick-btn">
                <FileText size={16} /> Post Doubt
              </Link>
            </div>
          </Card>

          {/* Streak */}
          <Card style={{ marginTop: '1rem', textAlign: 'center' }}>
            <div className="streak-flame">🔥</div>
            <div className="streak-num">14</div>
            <div className="streak-label">Day Streak</div>
            <p className="streak-sub">Keep it up! Study today to maintain your streak.</p>
          </Card>
        </div>
      </div>
    </div>
  )
}
