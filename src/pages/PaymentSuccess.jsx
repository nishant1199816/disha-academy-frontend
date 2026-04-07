import { useLocation, Link } from 'react-router-dom'
import { CheckCircle, BookOpen, ChevronRight } from 'lucide-react'
import './payment.css'

export default function PaymentSuccess() {
  const { state } = useLocation()
  const course = state?.course
  const paymentId = state?.paymentId

  return (
    <div className="success-page container fade-up">
      <div className="success-card">
        <div className="success-icon-wrap">
          <CheckCircle size={52} color="var(--green)" />
        </div>
        <h1 className="success-title">Payment Successful! 🎉</h1>
        <p className="success-sub">
          You're now enrolled in <strong>{course?.title || 'the course'}</strong>.<br />
          Your access has been activated immediately.
        </p>
        {paymentId && (
          <div className="success-pid">
            Payment ID: <code>{paymentId}</code>
          </div>
        )}
        <div className="success-actions">
          <Link to="/dashboard" className="btn btn-primary btn-lg">
            Go to Dashboard <ChevronRight size={18} />
          </Link>
          <Link to="/courses" className="btn btn-secondary btn-lg">
            Browse More Courses
          </Link>
        </div>
      </div>
    </div>
  )
}
