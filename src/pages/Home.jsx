import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { DishaLogoFull } from '../components/ui/DishaLogo'
import { useTheme } from '../context/ThemeContext'
import { Play, Shield, Zap, Users, BookOpen, ChevronRight, Star, Lock, Video, FileText, Award, Target, Clock } from 'lucide-react'
import './home.css'

const EXAMS = [
  { name: 'SSC CGL', full: 'Combined Graduate Level', posts: '17,727', icon: '🏛️', color: 'blue' },
  { name: 'SSC CHSL', full: 'Combined Higher Secondary', posts: '3,712', icon: '📋', color: 'green' },
  { name: 'Delhi Police', full: 'Constable & Head Constable', posts: '5,000+', icon: '🚔', color: 'accent' },
  { name: 'UP Police', full: 'Constable Bharti', posts: '60,244', icon: '🛡️', color: 'amber' },
  { name: 'Haryana Police', full: 'Constable Bharti', posts: '6,000+', icon: '⭐', color: 'blue' },
  { name: 'Chandigarh Police', full: 'Constable Bharti', posts: '500+', icon: '🔵', color: 'green' },
  { name: 'Railway RRB', full: 'NTPC & Group D', posts: '11,558', icon: '🚂', color: 'accent' },
  { name: 'DSSSB', full: 'Delhi Sub Ordinate Services', posts: '1,000+', icon: '🏢', color: 'amber' },
]

const SUBJECTS = [
  { name: 'Mathematics', icon: '📐', desc: 'Arithmetic, Algebra, Geometry, Mensuration, DI', chapters: 24 },
  { name: 'Reasoning', icon: '🧠', desc: 'Verbal & Non-Verbal, Puzzles, Coding-Decoding, Series', chapters: 20 },
  { name: 'English', icon: '📝', desc: 'Grammar, Vocabulary, Reading Comprehension, Error Detection', chapters: 18 },
  { name: 'General Studies', icon: '🌏', desc: 'History, Geography, Polity, Economy, Current Affairs, Science', chapters: 32 },
]

const FEATURES = [
  { icon: <Video size={20} />, title: 'Live Classes', desc: 'HD live classes directly in the app — no external links, no screen recording possible.' },
  { icon: <Shield size={20} />, title: 'DRM Protected', desc: 'Your content is watermarked with your Student ID. Recording is blocked at hardware level.' },
  { icon: <Lock size={20} />, title: 'Payment Gated', desc: 'Only verified paid students access content. Pay via GPay, PhonePe or Paytm instantly.' },
  { icon: <FileText size={20} />, title: 'Study Material', desc: 'PDF notes, previous year papers, practice sets — organized chapter-wise.' },
  { icon: <Zap size={20} />, title: 'Mock Tests', desc: 'Full-length & sectional tests with detailed analysis and all-India rank.' },
  { icon: <Users size={20} />, title: 'Doubt Clearing', desc: 'Post doubts to teachers anytime. Get answers with text and image support.' },
]

const TESTIMONIALS = [
  { name: 'Rahul Kumar', sub: 'SSC CGL 2024 — Selected', text: 'Disha Academy ke notes aur mock tests ne meri preparation complete kar di. Best platform for SSC.', rating: 5 },
  { name: 'Priya Sharma', sub: 'Delhi Police 2024 — Selected', text: 'Live classes bahut helpful hain. Teacher real exam pattern ke according padhate hain.', rating: 5 },
  { name: 'Amit Yadav', sub: 'UP Police 2024 — Selected', text: 'Payment ke baad turant access mil gaya. GPay se 2 second mein payment ho gayi.', rating: 5 },
]

export default function Home() {
  const { user } = useAuth()
  const { isDark } = useTheme()

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="container">
          <div className="hero-logo-wrap fade-up">
            <DishaLogoFull dark={isDark} width={320} />
          </div>

          <div className="hero-badge fade-up-1">
            <span className="hero-badge-dot" />
            GTB Nagar, Delhi · Offline + Online Classes
          </div>

          <h1 className="hero-title fade-up-2">
            Sarkari Naukri Ki<br />
            <span className="hero-accent">Pakki Taiyari</span>
          </h1>

          <p className="hero-subtitle fade-up-3">
            SSC · Delhi Police · UP Police · Haryana Police · Railway — sabki preparation<br />
            ek hi platform pe. Live classes, notes, mock tests — sab kuch DRM protected.
          </p>

          <div className="hero-actions fade-up-4">
            {user ? (
              <Link to="/dashboard" className="btn-hero-primary">
                Go to Dashboard <ChevronRight size={18} />
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn-hero-primary">
                  Abhi Enroll Karo <ChevronRight size={18} />
                </Link>
                <Link to="/login" className="btn-hero-secondary">Login</Link>
              </>
            )}
          </div>

          <div className="hero-stats fade-up-4">
            <div className="hero-stat"><span className="hero-stat-num">15,000+</span><span className="hero-stat-label">Students Enrolled</span></div>
            <div className="hero-stat-divider" />
            <div className="hero-stat"><span className="hero-stat-num">500+</span><span className="hero-stat-label">Selections 2024</span></div>
            <div className="hero-stat-divider" />
            <div className="hero-stat"><span className="hero-stat-num">8+</span><span className="hero-stat-label">Exams Covered</span></div>
            <div className="hero-stat-divider" />
            <div className="hero-stat"><span className="hero-stat-num">97%</span><span className="hero-stat-label">Student Satisfaction</span></div>
          </div>
        </div>
      </section>

      {/* Exams Grid */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <p className="section-eyebrow">Exams We Cover</p>
            <h2 className="section-title">8 Exams, Ek Platform</h2>
          </div>
          <div className="exams-grid">
            {EXAMS.map((e, i) => (
              <Link to="/courses" className="exam-card" key={i} style={{ animationDelay: `${i * 0.06}s` }}>
                <div className="exam-icon">{e.icon}</div>
                <div className="exam-name">{e.name}</div>
                <div className="exam-full">{e.full}</div>
                <div className="exam-posts">{e.posts} Posts</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Subjects */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <p className="section-eyebrow">Subjects</p>
            <h2 className="section-title">4 Subjects, Complete Syllabus</h2>
          </div>
          <div className="subjects-grid">
            {SUBJECTS.map((s, i) => (
              <div className="subject-card" key={i}>
                <div className="subject-icon">{s.icon}</div>
                <h3 className="subject-name">{s.name}</h3>
                <p className="subject-desc">{s.desc}</p>
                <div className="subject-chapters">
                  <BookOpen size={13} /> {s.chapters} chapters
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <p className="section-eyebrow">Platform Features</p>
            <h2 className="section-title">Kya milega aapko?</h2>
          </div>
          <div className="features-grid">
            {FEATURES.map((f, i) => (
              <div className="feature-card" key={i} style={{ animationDelay: `${i * 0.07}s` }}>
                <div className="feature-icon">{f.icon}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Payment section */}
      <section className="section section-alt">
        <div className="container">
          <div className="payment-section">
            <div className="payment-left">
              <p className="section-eyebrow">Seamless Payments</p>
              <h2 className="section-title" style={{ fontSize: '2rem', textAlign: 'left' }}>Pay karo, turant<br />access pao</h2>
              <p style={{ color: 'var(--text-secondary)', marginTop: '1rem', lineHeight: 1.7, fontSize: '15px' }}>
                Payment ke baad automatically aapka course unlock ho jata hai — koi waiting nahi, koi manual approval nahi. GPay, PhonePe, Paytm sab support karta hai.
              </p>
              <div className="payment-methods">
                <div className="payment-pill">GPay</div>
                <div className="payment-pill">PhonePe</div>
                <div className="payment-pill">Paytm</div>
                <div className="payment-pill">UPI</div>
                <div className="payment-pill">Debit Card</div>
                <div className="payment-pill">Net Banking</div>
              </div>
              <div className="contact-info">
                <div className="contact-label">Contact / Admission</div>
                <div className="contact-numbers">
                  <a href="tel:9354888970" className="contact-num">9354888970</a>
                  <a href="tel:8076724488" className="contact-num">8076724488</a>
                  <a href="tel:79829902988" className="contact-num">79829902988</a>
                </div>
                <div className="contact-addr">104, Mall Road, GTB Nagar Metro, Gate No. 3, Delhi</div>
              </div>
            </div>
            <div className="payment-right">
              <div className="payment-card-mock">
                <div className="mock-badge">Most Popular</div>
                <div className="mock-header">
                  <BookOpen size={16} style={{ color: 'var(--accent)' }} />
                  <span>SSC CGL — Complete Batch</span>
                </div>
                <div className="mock-price">₹4,999 <span>/ 6 months</span></div>
                <div className="mock-features">
                  <div className="mock-feat">✓ 200+ Live Classes</div>
                  <div className="mock-feat">✓ All 4 Subjects Covered</div>
                  <div className="mock-feat">✓ PDF Notes + PYQ Papers</div>
                  <div className="mock-feat">✓ 50 Full Mock Tests</div>
                  <div className="mock-feat">✓ Doubt Clearing Sessions</div>
                </div>
                <Link to="/courses" className="mock-btn">Enroll Now — Pay via UPI →</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <p className="section-eyebrow">Student Reviews</p>
            <h2 className="section-title">Humne select karwaya, wo bole</h2>
          </div>
          <div className="testimonials-grid">
            {TESTIMONIALS.map((t, i) => (
              <div className="testimonial-card" key={i}>
                <div className="testimonial-stars">
                  {[...Array(t.rating)].map((_, j) => <Star size={14} key={j} fill="var(--accent)" color="var(--accent)" />)}
                </div>
                <p className="testimonial-text">"{t.text}"</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">{t.name[0]}</div>
                  <div>
                    <div className="testimonial-name">{t.name}</div>
                    <div className="testimonial-sub" style={{ color: 'var(--accent)', fontSize: '11px', fontWeight: 600 }}>{t.sub}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container">
          <div className="cta-section">
            <Award size={40} style={{ color: 'var(--accent)', marginBottom: '1rem' }} />
            <h2 className="cta-title">Aaj hi shuru karo apni taiyari</h2>
            <p className="cta-sub">15,000+ students already is platform pe hain</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '2rem' }}>
              <Link to="/register" className="btn-hero-primary">
                Abhi Enroll Karo <ChevronRight size={18} />
              </Link>
              <Link to="/courses" className="btn-hero-secondary">
                Courses Dekho
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-inner">
            <DishaLogoFull dark={isDark} width={220} />
            <div className="footer-links">
              <Link to="/courses" className="footer-link">Courses</Link>
              <Link to="/login" className="footer-link">Login</Link>
              <Link to="/register" className="footer-link">Register</Link>
            </div>
          </div>
          <div className="footer-bottom">
            <p className="footer-copy">© 2025 Disha Academy. 104, Mall Road, GTB Nagar Metro, Gate No. 3, Delhi. Payments secured by Razorpay.</p>
            <p className="footer-copy" style={{ marginTop: '4px' }}>📞 9354888970 · 8076724488 · 79829902988</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
