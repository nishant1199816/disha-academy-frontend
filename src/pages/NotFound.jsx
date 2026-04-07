import { Link } from 'react-router-dom'
import { BookOpen } from 'lucide-react'

export default function NotFound() {
  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
      <div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '6rem', fontWeight: 800, color: 'var(--text-tertiary)', lineHeight: 1 }}>404</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, margin: '1rem 0 0.5rem' }}>Page not found</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>The page you're looking for doesn't exist.</p>
        <Link to="/" className="btn btn-primary btn-md"><BookOpen size={16} /> Go Home</Link>
      </div>
    </div>
  )
}
