import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Button } from '../components/ui'
import { Shield, Check, Lock, BookOpen, Smartphone, CreditCard, Building2, AlertCircle } from 'lucide-react'
import './payment.css'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const METHODS = [
  { id: 'upi',        label: 'UPI / GPay / PhonePe / Paytm', icon: <Smartphone size={18} />, desc: 'Instant — most popular' },
  { id: 'card',       label: 'Credit / Debit Card',           icon: <CreditCard size={18} />,  desc: 'Visa, Mastercard, RuPay' },
  { id: 'netbanking', label: 'Net Banking',                   icon: <Building2 size={18} />,   desc: 'All major banks' },
]

export default function Payment() {
  const { state }   = useLocation()
  const navigate    = useNavigate()
  const { user, refreshUser } = useAuth()
  const course = state?.course

  const [method, setMethod]   = useState('upi')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  useEffect(() => {
    if (window.Razorpay) return
    const s = document.createElement('script')
    s.src = 'https://checkout.razorpay.com/v1/checkout.js'
    document.body.appendChild(s)
  }, [])

  if (!course) return (
    <div className="payment-page container" style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
      <div style={{ textAlign: 'center' }}>
        <AlertCircle size={48} color="var(--amber)" style={{ marginBottom: '1rem' }} />
        <h2>Course not found</h2>
        <button className="btn btn-primary btn-md" style={{ marginTop: '1rem' }} onClick={() => navigate('/courses')}>Browse Courses</button>
      </div>
    </div>
  )

  const gst   = Math.round(course.price * 0.18)
  const total = course.price + gst

  const handlePayment = async () => {
    if (!user) return navigate('/login')
    setLoading(true); setError('')
    const token = localStorage.getItem('edtech_token')

    try {
      // Step 1: Create order
      const res = await fetch(`${BASE_URL}/payments/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ courseId: course.id }),
      })
      const orderData = await res.json()
      if (!orderData.success) throw new Error(orderData.message || 'Order create failed')

      // Step 2: Open Razorpay
      await new Promise((resolve, reject) => {
        const options = {
          key:         orderData.key,
          amount:      orderData.order.amount,
          currency:    orderData.order.currency,
          name:        'Disha Academy',
          description: course.title,
          order_id:    orderData.order.id,
          prefill: {
            name:    user.name,
            email:   user.email,
            contact: user.phone || '',
          },
          theme: { color: '#1e3a8a' },
          handler: async (response) => {
            // Step 3: Verify payment
            const verifyRes = await fetch(`${BASE_URL}/payments/verify`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
              body: JSON.stringify({
                razorpay_order_id:   response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature:  response.razorpay_signature,
              }),
            })
            const verifyData = await verifyRes.json()
            if (!verifyData.success) throw new Error(verifyData.message)
            await refreshUser()
            navigate('/payment/success', { state: { course, paymentId: response.razorpay_payment_id } })
            resolve()
          },
          modal: { ondismiss: () => { setLoading(false); reject(new Error('cancelled')) } },
        }

        if (window.Razorpay) {
          new window.Razorpay(options).open()
        } else {
          // Demo mode (no real Razorpay key)
          setTimeout(async () => {
            await refreshUser()
            navigate('/payment/success', { state: { course, paymentId: 'demo_' + Date.now() } })
            resolve()
          }, 1500)
        }
      })
    } catch (err) {
      if (err.message !== 'cancelled') setError(err.message || 'Payment failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="payment-page container fade-up">
      <div className="payment-layout">
        <div className="payment-form-col">
          <h1 className="page-title" style={{ marginBottom: '0.5rem' }}>Complete your enrollment</h1>
          <p className="page-sub" style={{ marginBottom: '2rem' }}>You're one step away from accessing all content</p>

          <div className="pay-section">
            <h3 className="pay-section-title">Choose payment method</h3>
            <div className="method-list">
              {METHODS.map(m => (
                <div key={m.id} className={`method-card ${method === m.id ? 'method-active' : ''}`} onClick={() => setMethod(m.id)}>
                  <div className="method-radio">{method === m.id && <div className="method-radio-dot" />}</div>
                  <div className="method-icon">{m.icon}</div>
                  <div className="method-info">
                    <div className="method-label">{m.label}</div>
                    <div className="method-desc">{m.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {method === 'upi' && (
            <div className="upi-apps">
              {['GPay', 'PhonePe', 'Paytm', 'BHIM'].map(app => (
                <div key={app} className="upi-app-pill">{app}</div>
              ))}
            </div>
          )}

          {error && (
            <div style={{ background: 'var(--red-dim)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: 'var(--red)', marginBottom: '1rem' }}>
              {error}
            </div>
          )}

          <Button fullWidth size="lg" loading={loading} onClick={handlePayment} icon={<Lock size={16} />}>
            Pay ₹{total.toLocaleString()} Securely
          </Button>

          <div className="secure-note">
            <Shield size={14} />
            <span>256-bit SSL encrypted · Powered by Razorpay · GPay · PhonePe · Paytm</span>
          </div>
        </div>

        {/* Order Summary */}
        <div className="order-summary">
          <h3 className="pay-section-title">Order Summary</h3>
          <div className="order-course">
            <div className="order-thumb"><BookOpen size={24} /></div>
            <div className="order-info">
              <div className="order-course-title">{course.title}</div>
              <div className="order-course-meta">Disha Academy Faculty</div>
            </div>
          </div>
          <div className="order-breakdown">
            <div className="order-row"><span>Course fee</span><span>₹{Number(course.price).toLocaleString()}</span></div>
            <div className="order-row"><span>GST (18%)</span><span>₹{gst.toLocaleString()}</span></div>
            <div className="order-divider" />
            <div className="order-row order-total"><span>Total</span><span>₹{total.toLocaleString()}</span></div>
          </div>
          <div className="order-includes">
            <p className="order-includes-title">What you get:</p>
            {['Live + recorded lectures', 'PDF notes & practice sets', 'Previous year papers', 'Doubt clearing support', 'Mock tests with analysis'].map((item, i) => (
              <div key={i} className="order-include-item">
                <Check size={14} color="var(--green)" /><span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
