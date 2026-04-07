import { StatCard, Badge, Card } from '../components/ui'
import { Users, BookOpen, IndianRupee, TrendingUp, Plus, Eye, Trash2 } from 'lucide-react'
import './dashboard.css'
import './admin.css'

const RECENT_STUDENTS = [
  { name: 'Priya Sharma', email: 'priya@ex.com', batch: 'JEE 2025', paid: true, joined: '2 hrs ago' },
  { name: 'Rohit Verma', email: 'rohit@ex.com', batch: 'NEET 2025', paid: true, joined: '5 hrs ago' },
  { name: 'Anjali Singh', email: 'anjali@ex.com', batch: 'JEE 2025', paid: false, joined: '1 day ago' },
  { name: 'Amit Kumar', email: 'amit@ex.com', batch: 'Class 12', paid: true, joined: '2 days ago' },
]

const RECENT_PAYMENTS = [
  { name: 'Priya Sharma', course: 'JEE Advanced Batch', amount: 4999, method: 'GPay', status: 'success' },
  { name: 'Rohit Verma', course: 'NEET Full Course', amount: 5999, method: 'PhonePe', status: 'success' },
  { name: 'Karan Mehta', course: 'JEE Advanced Batch', amount: 4999, method: 'Paytm', status: 'pending' },
  { name: 'Sneha Rao', course: 'Class 12 Bundle', amount: 2999, method: 'UPI', status: 'success' },
]

export default function AdminDashboard() {
  return (
    <div className="dashboard-page container fade-up">
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="page-sub">Platform overview — last 30 days</p>
        </div>
        <button className="btn btn-primary btn-md">
          <Plus size={16} /> Add Course
        </button>
      </div>

      <div className="stats-grid">
        <StatCard label="Total Students" value="1,284" sub="+48 this week" icon={<Users size={18} />} color="blue" />
        <StatCard label="Revenue (MTD)" value="₹6.4L" sub="+12% vs last month" icon={<IndianRupee size={18} />} color="green" />
        <StatCard label="Active Courses" value="8" sub="3 with live classes" icon={<BookOpen size={18} />} color="accent" />
        <StatCard label="Attendance Rate" value="79%" sub="avg across all batches" icon={<TrendingUp size={18} />} color="amber" />
      </div>

      <div className="admin-grid">
        {/* Recent Students */}
        <Card>
          <div className="section-head">
            <h2 className="section-heading">Recent Enrollments</h2>
            <button className="btn btn-ghost btn-sm">View all</button>
          </div>
          <div className="admin-table">
            <div className="table-head">
              <span>Student</span><span>Batch</span><span>Status</span><span>Joined</span><span></span>
            </div>
            {RECENT_STUDENTS.map((s, i) => (
              <div className="table-row" key={i}>
                <div className="table-student">
                  <div className="mini-avatar">{s.name[0]}</div>
                  <div>
                    <div className="table-name">{s.name}</div>
                    <div className="table-email">{s.email}</div>
                  </div>
                </div>
                <span className="table-batch">{s.batch}</span>
                <span>{s.paid ? <Badge color="green">Paid</Badge> : <Badge color="amber">Unpaid</Badge>}</span>
                <span className="table-date">{s.joined}</span>
                <div className="table-actions">
                  <button className="icon-action"><Eye size={14} /></button>
                  <button className="icon-action icon-action-danger"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Payments */}
        <Card>
          <div className="section-head">
            <h2 className="section-heading">Payment History</h2>
            <button className="btn btn-ghost btn-sm">Export</button>
          </div>
          <div className="payments-list">
            {RECENT_PAYMENTS.map((p, i) => (
              <div className="payment-row" key={i}>
                <div className="mini-avatar">{p.name[0]}</div>
                <div className="payment-info">
                  <div className="payment-name">{p.name}</div>
                  <div className="payment-course">{p.course}</div>
                </div>
                <div className="payment-right-col">
                  <div className="payment-amount">₹{p.amount.toLocaleString()}</div>
                  <div className="payment-meta">
                    <span className="payment-method">{p.method}</span>
                    <Badge color={p.status === 'success' ? 'green' : 'amber'}>{p.status}</Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
