import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { BookOpen, Clock, Users, Lock, ChevronRight, Star, FileText, Target } from 'lucide-react'
import './courses.css'

const COURSES = [
  { id:1, name:'SSC CGL', title:'SSC CGL — Complete Batch 2025', subjects:['Maths','Reasoning','English','GS'], teacher:'Disha Academy Faculty', duration:'6 months', students:4820, lectures:200, price:4999, rating:4.9, tag:'Bestseller', desc:'SSC CGL Tier 1 & 2 ki complete preparation. All 4 subjects covered with PYQ analysis.' },
  { id:2, name:'SSC CHSL', title:'SSC CHSL — Full Course 2025', subjects:['Maths','Reasoning','English','GS'], teacher:'Disha Academy Faculty', duration:'4 months', students:3100, lectures:150, price:3999, rating:4.8, tag:'Popular', desc:'CHSL Tier 1 & 2 complete course with typing test guidance and document preparation.' },
  { id:3, name:'Delhi Police', title:'Delhi Police Constable Batch', subjects:['Maths','Reasoning','English','GS'], teacher:'Disha Academy Faculty', duration:'4 months', students:5200, lectures:160, price:3499, rating:4.9, tag:'High Demand', desc:'Delhi Police Constable & Head Constable full preparation with physical test guidance.' },
  { id:4, name:'UP Police', title:'UP Police Constable Batch', subjects:['Maths','Reasoning','Hindi','GS'], teacher:'Disha Academy Faculty', duration:'3 months', students:6100, lectures:120, price:2999, rating:4.7, tag:'New Batch', desc:'UP Police 60,244 vacancy ki taiyari. Hindi medium available. Complete syllabus coverage.' },
  { id:5, name:'Haryana Police', title:'Haryana Police Constable Batch', subjects:['Maths','Reasoning','English','GS'], teacher:'Disha Academy Faculty', duration:'3 months', students:1800, lectures:110, price:2999, rating:4.8, tag:'', desc:'Haryana Police complete preparation with Haryana GK special focus.' },
  { id:6, name:'Chandigarh Police', title:'Chandigarh Police Constable Batch', subjects:['Maths','Reasoning','English','GS'], teacher:'Disha Academy Faculty', duration:'3 months', students:900, lectures:100, price:2499, rating:4.7, tag:'', desc:'Chandigarh Police complete batch with UT specific current affairs and GK.' },
  { id:7, name:'Railway', title:'Railway RRB NTPC + Group D Batch', subjects:['Maths','Reasoning','English','GS'], teacher:'Disha Academy Faculty', duration:'5 months', students:3800, lectures:180, price:3999, rating:4.8, tag:'Popular', desc:'RRB NTPC CBT 1 & 2 + Group D complete preparation. Previous year papers included.' },
  { id:8, name:'DSSSB', title:'DSSSB — DASS Grade II / ASO Batch', subjects:['Maths','Reasoning','English','GS'], teacher:'Disha Academy Faculty', duration:'5 months', students:2200, lectures:160, price:4499, rating:4.9, tag:'New', desc:'DSSSB DASS Grade II aur ASO ke liye complete batch. 911 posts — abhi enroll karo.' },
]

const FILTERS = ['All', 'SSC CGL', 'SSC CHSL', 'Delhi Police', 'UP Police', 'Railway', 'DSSSB']

export default function Courses() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [filter, setFilter] = useState('All')

  const filtered = filter === 'All' ? COURSES : COURSES.filter(c => c.name === filter)

  return (
    <div className="courses-page container fade-up">
      <div className="courses-header">
        <h1 className="page-title">Sabhi Courses</h1>
        <p className="page-sub">GPay · PhonePe · Paytm — pay karo aur turant access pao</p>
      </div>
      <div className="filter-tabs">
        {FILTERS.map(f => (
          <button key={f} className={`filter-tab ${filter === f ? 'filter-tab-active' : ''}`} onClick={() => setFilter(f)}>
            {f}
          </button>
        ))}
      </div>
      <div className="courses-grid">
        {filtered.map((c, i) => (
          <div className="course-card fade-up" key={c.id} style={{ animationDelay: `${i * 0.08}s` }}>
            <div className="course-thumb">
              <div className="course-thumb-icon"><BookOpen size={28} /></div>
              {c.tag && <div className="course-tag-badge">{c.tag}</div>}
              {!user?.paid && <div className="lock-icon"><Lock size={13} /></div>}
            </div>
            <div className="course-body">
              <h3 className="course-title">{c.title}</h3>
              <p className="course-desc">{c.desc}</p>
              <div className="course-subjects">
                {c.subjects.map(s => <span key={s} className="subj-pill">{s}</span>)}
              </div>
              <div className="course-stats">
                <span className="course-stat"><Clock size={12} /> {c.duration}</span>
                <span className="course-stat"><Target size={12} /> {c.lectures} classes</span>
                <span className="course-stat"><Users size={12} /> {c.students.toLocaleString()}</span>
                <span className="course-stat"><Star size={12} fill="var(--accent)" color="var(--accent)" /> {c.rating}</span>
              </div>
              <div className="course-footer">
                <div className="course-price">
                  <span className="price-amount">₹{c.price.toLocaleString()}</span>
                  <span className="price-period">/ course</span>
                </div>
                <button className="enroll-btn" onClick={() => navigate(`/payment/${c.id}`, { state: { course: c } })}>
                  Enroll Now <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
