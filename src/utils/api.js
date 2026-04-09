// Disha Academy — API Service
// Sab backend calls yahan se hain

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
console.log("API URL:", BASE_URL)

const getToken = () => localStorage.getItem('edtech_token')

const headers = (extra = {}) => ({
  'Content-Type': 'application/json',
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
  ...extra,
})

const handle = async (res) => {
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Something went wrong')
  return data
}

// ── AUTH ──────────────────────────────────────────────────────────
export const authAPI = {
  register: (body)    => fetch(`${BASE_URL}/api/auth/register`, { method: 'POST', headers: headers(), body: JSON.stringify(body) }).then(handle),
  login:    (body)    => fetch(`${BASE_URL}/api/auth/login`,    { method: 'POST', headers: headers(), body: JSON.stringify(body) }).then(handle),
  me:       ()        => fetch(`${BASE_URL}/api/auth/me`,       { headers: headers() }).then(handle),
  changePassword: (b) => fetch(`${BASE_URL}/api/auth/change-password`, { method: 'PUT', headers: headers(), body: JSON.stringify(b) }).then(handle),
}

// ── COURSES ───────────────────────────────────────────────────────
export const courseAPI = {
  getAll:        ()          => fetch(`${BASE_URL}/api/courses`,                         { headers: headers() }).then(handle),
  getOne:        (id)        => fetch(`${BASE_URL}/api/courses/${id}`,                   { headers: headers() }).then(handle),
  getLiveClasses: (courseId) => fetch(`${BASE_URL}/api/courses/${courseId}/live-classes`, { headers: headers() }).then(handle),
  getMaterials:  (courseId)  => fetch(`${BASE_URL}/api/courses/${courseId}/materials`,    { headers: headers() }).then(handle),
}

// ── DASHBOARD ─────────────────────────────────────────────────────
export const dashboardAPI = {
  student: () => fetch(`${BASE_URL}/api/dashboard`,       { headers: headers() }).then(handle),
  admin:   () => fetch(`${BASE_URL}/api/admin/dashboard`, { headers: headers() }).then(handle),
}

// ── PAYMENTS ──────────────────────────────────────────────────────
export const paymentAPI = {
  createOrder:  (courseId)  => fetch(`${BASE_URL}/api/payments/create-order`, {
    method: 'POST', headers: headers(), body: JSON.stringify({ courseId })
  }).then(handle),

  verify: (data) => fetch(`${BASE_URL}/api/payments/verify`, {
    method: 'POST', headers: headers(), body: JSON.stringify(data)
  }).then(handle),

  myHistory: () => fetch(`${BASE_URL}/api/payments/my-history`, { headers: headers() }).then(handle),
  allPayments: (params = '') => fetch(`${BASE_URL}/api/admin/payments?${params}`, { headers: headers() }).then(handle),
}

// ── Razorpay checkout helper ──────────────────────────────────────
export const openRazorpay = ({ order, course, user, key, onSuccess, onDismiss }) => {
  return new Promise((resolve, reject) => {
    const options = {
      key,
      amount:      order.amount,
      currency:    order.currency,
      name:        'Disha Academy',
      description: course.title,
      order_id:    order.id,
      image:       '/logo.png',
      prefill: {
        name:    user.name,
        email:   user.email,
        contact: user.phone || '',
      },
      theme: { color: '#1e3a8a' },
      handler: async (response) => {
        try {
          const result = await paymentAPI.verify({
            razorpay_order_id:   response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature:  response.razorpay_signature,
          })
          resolve(result)
          onSuccess?.(result)
        } catch (err) {
          reject(err)
        }
      },
      modal: {
        ondismiss: () => {
          onDismiss?.()
          reject(new Error('Payment cancelled'))
        },
      },
    }

    if (window.Razorpay) {
      new window.Razorpay(options).open()
    } else {
      reject(new Error('Razorpay SDK not loaded'))
    }
  })
}