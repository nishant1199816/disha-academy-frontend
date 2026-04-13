import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { Avatar } from '../ui'
import { DishaLogoIcon } from '../ui/DishaLogo'
import { Bell, LogOut, LayoutDashboard, Settings, Sun, Moon } from 'lucide-react'
import { useState } from 'react'
import './navbar.css'

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth()
  const { theme, toggleTheme, isDark } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const handleLogout = () => { logout(); navigate('/login') }

  const navLinks = isAdmin
    ? [{ to: '/admin', label: 'Dashboard' }, { to: '/admin/courses', label: 'Courses' }, { to: '/admin/students', label: 'Students' }, { to: '/admin/live', label: 'Live Classes' }]
    : [{ to: '/dashboard', label: 'Dashboard' }, { to: '/courses', label: 'My Courses' }, { to: '/live', label: 'Live Class' }, { to: '/tests', label: 'Mock Tests' }]

  return (
    <nav className="navbar">
      <div className="navbar-inner">

        <Link to="/" className="navbar-brand">
          <DishaLogoIcon size={38} />
          <div className="brand-text">
            <span className="brand-name"><span className="brand-disha">Disha</span> <span className="brand-academy">Academy</span></span>
            <span className="brand-sub">SSC · Police · Railway</span>
          </div>
        </Link>

        {user && (
          <div className="navbar-links">
            {navLinks.map(l => (
              <Link key={l.to} to={l.to}
                className={`nav-link ${location.pathname.startsWith(l.to) ? 'nav-link-active' : ''}`}>
                {l.label}
              </Link>
            ))}
          </div>
        )}

        <div className="navbar-right">
          {/* Theme toggle */}
          <button className="theme-toggle" onClick={toggleTheme} title={isDark ? 'Switch to Light' : 'Switch to Dark'}>
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {user ? (
            <>
              <button className="icon-btn" title="Notifications">
                <Bell size={16} /><span className="notif-dot" />
              </button>
              <div className="user-menu" onClick={() => setMenuOpen(!menuOpen)}>
                <Avatar name={user.name} size="sm" />
                <span className="user-name">{user.name?.split(' ')[0]}</span>
              </div>
              {menuOpen && (
                <div className="dropdown">
                  <div className="dropdown-header">
                    <span className="dropdown-name">{user.name}</span>
                    <span className="dropdown-email">{user.email}</span>
                  </div>
                  <div className="dropdown-divider" />
                  <Link to={isAdmin ? '/admin' : '/dashboard'} className="dropdown-item" onClick={() => setMenuOpen(false)}>
                    <LayoutDashboard size={14} /> Dashboard
                  </Link>
                  <Link to="/settings" className="dropdown-item" onClick={() => setMenuOpen(false)}>
                    <Settings size={14} /> Settings
                  </Link>
                  <div className="dropdown-divider" />
                  <button className="dropdown-item dropdown-item-danger" onClick={handleLogout}>
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Enroll Now</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
