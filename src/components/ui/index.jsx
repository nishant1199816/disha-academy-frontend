import './ui.css'

export function Button({ children, variant = 'primary', size = 'md', loading, disabled, onClick, type = 'button', fullWidth, icon }) {
  return (
    <button
      type={type}
      className={`btn btn-${variant} btn-${size} ${fullWidth ? 'btn-full' : ''} ${loading ? 'btn-loading' : ''}`}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? <span className="spinner-sm" /> : icon && <span className="btn-icon">{icon}</span>}
      {children}
    </button>
  )
}

export function Badge({ children, color = 'accent' }) {
  return <span className={`badge badge-${color}`}>{children}</span>
}

export function Card({ children, className = '', onClick, hoverable }) {
  return (
    <div className={`card ${hoverable ? 'card-hoverable' : ''} ${className}`} onClick={onClick}>
      {children}
    </div>
  )
}

export function Spinner() {
  return <div className="spinner" />
}

export function Avatar({ name, size = 'md' }) {
  const initials = name?.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() || 'U'
  return <div className={`avatar avatar-${size}`}>{initials}</div>
}

export function ProgressBar({ value, max = 100, color = 'accent' }) {
  const pct = Math.round((value / max) * 100)
  return (
    <div className="progress-track">
      <div className={`progress-fill progress-${color}`} style={{ width: `${pct}%` }} />
    </div>
  )
}

export function StatCard({ label, value, sub, icon, color = 'accent' }) {
  return (
    <div className={`stat-card stat-${color}`}>
      {icon && <div className={`stat-icon stat-icon-${color}`}>{icon}</div>}
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  )
}
export { DishaLogoFull, DishaLogoIcon } from './DishaLogo'
