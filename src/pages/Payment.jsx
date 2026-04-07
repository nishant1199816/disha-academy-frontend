import { useState, useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { paymentAPI, openRazorpay } from '../utils/api'
import { Button } from '../components/ui'
import { Shield, Check, Lock, BookOpen, Smartphone, CreditCard, Building2, AlertCircle } from 'lucide-react'
import './payment.css'

const METHODS = [
  { id:'upi',        label:'UPI / GPay / PhonePe / Paytm', icon:<Smartphone size={18}/>, desc:'Instant — most popular' },
  { id:'card',       label:'Credit / Debit Card',           icon:<CreditCard size={18}/>,  desc:'Visa, Mastercard, RuPay' },
  { id:'netbanking', label:'Net Banking',                   icon:<Building2 size={18}/>,   desc:'All major banks' },
]

export default function Payment() {
  const { state }   = useLocation()
  const { id }      = useParams()
  const navigate    = useNavigate()
  const { user, refreshUser } = useAuth()
  const course      = state?.course

  const [method, setMethod]   = useState('upi')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  // Load Razorpay SDK
  useEffect(() => {
    if (window.Razorpay) return
    const s = document.createElement('script')
    s.src   = 'https://checkout.razorpay.com/v1/checkout.js'
    document.body.appendChild(s)
  }, [])

  if (!course) return (
    <div className="payment-page container" style={{ display:'flex', justifyContent:'center', padding:'4rem 0' }}>
      <div style={{ textAlign:'center' }}>
        <AlertCircle size={48} color="var(--amber)" style={{ marginBottom:'1rem' }} />
        <h2>Course not found</h2>
        <button className="btn btn-primary btn-md" style={{ marginTop:'1rem' }} onClick={() => navigate('/courses')}>Browse Courses</button>
      </div>
    </div>
  )

  const gst   = Math.round(course.price * 0.18)
  const total = course.price + gst

  const handlePayment = async () => {
    if (!user) return navigate('/login')
    setLoading(true); setError('')
    try {
      // Step 1: Create order from backend
      const orderData = await paymentAPI.createOrder(course.id)

      // Step 2: Open Razorpay checkout
      const result = await openRazorpay({
        order:  orderData.order,
        course: orderData.course,
        user:   orderData.user,
        key:    orderData.key,
      })

      // Step 3: Refresh user enrollments
      await refreshUser()

      // Step 4: Navigate to success
      navigate('/payment/success', { state: { course, paymentId: result.paymentId } })
    } catch (err) {
      if (err.message !== 'Payment cancelled') {
        setError(err.message || 'Payment failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="payment-page container fade-up">
      <div className="payment-layout">
        <div className="payment-form-col">
          <h1 className="page-title" style={{ marginBottom:'0.5rem' }}>Complete your enrollment</h1>
          <p className="page-sub" style={{ marginBottom:'2rem' }}>You're one step away from accessing all content</p>
          <div className="pay-section">
            <h3 className="pay-section-title">Choose payment method</h3>
            <div className="method-list">
              {METHODS.map(m => (
                <div key={m.id} className={`method-card ${method===m.id?'method-active':''}`} onClick={() => setMethod(m.id)}>
                  <div className="method-radio">{method===m.id && <div className="method-radio-dot"/>}</div>
                  <div className="method-icon">{m.icon}</div>
                  <div className="method-info">
                    <div className="method-label">{m.label}</div>
                    <div className="method-desc">{m.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {method==='upi' && (
            <div className="upi-apps">
              {['GPay','PhonePe','Paytm','BHIM'].map(app => (
                <div key={app} className="upi-app-pill">{app}</div>
              ))}
            </div>
          )}
          {error && <div style={{ background:'var(--red-dim)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:'8px', padding:'10px 14px', fontSize:'13px', color:'var(--red)', marginBottom:'1rem' }}>{error}</div>}
          <Button fullWidth size="lg" loading={loading} onClick={handlePayment} icon={<Lock size={16}/>}>
            Pay ₹{total.toLocaleString()} Securely
          </Button>
          <div className="secure-note">
            <Shield size={14}/>
            <span>256-bit SSL encrypted · Powered by Razorpay · GPay · PhonePe · Paytm supported</span>
          </div>
        </div>

        <div className="order-summary">
          <h3 className="pay-section-title">Order Summary</h3>
          <div className="order-course">
            <div className="order-thumb"><BookOpen size={24}/></div>
            <div className="order-info">
              <div className="order-course-title">{course.title}</div>
              <div className="order-course-meta">{course.teacher || 'Disha Academy Faculty'}</div>
            </div>
          </div>
          <div className="order-breakdown">
            <div className="order-row"><span>Course fee</span><span>₹{course.price?.toLocaleString()}</span></div>
            <div className="order-row"><span>GST (18%)</span><span>₹{gst.toLocaleString()}</span></div>
            <div className="order-divider"/>
            <div className="order-row order-total"><span>Total</span><span>₹{total.toLocaleString()}</span></div>
          </div>
          <div className="order-includes">
            <p className="order-includes-title">What you get:</p>
            {['Live + recorded lectures', 'PDF notes & practice sets', 'Previous year papers', 'Doubt clearing support', 'Mock tests with analysis'].map((item,i) => (
              <div key={i} className="order-include-item">
                <Check size={14} color="var(--green)"/><span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
