import axios from 'axios'

const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.PROD ? 'https://portfolio-glhq.onrender.com/api' : 'http://localhost:5000/api')
const backendBaseUrl = apiBaseUrl.replace(/\/api\/?$/, '')

export const api = axios.create({ baseURL: apiBaseUrl })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const fetchPortfolio = async () => {
  const { data } = await api.get('/portfolio')
  return data
}

export const fetchResumeJson = async () => {
  const { data } = await api.get('/portfolio/resume-json')
  return data
}

export const fetchTrustPanel = async () => {
  const { data } = await api.get('/portfolio/trust-panel')
  return data
}

export const submitContactForm = async (payload) => {
  const { data } = await api.post('/contact', payload)
  return data
}

export const loginAdmin = async (credentials) => {
  const { data } = await api.post('/auth/login', credentials)
  return data
}

export const fetchAuthRecoveryStatus = async () => {
  const { data } = await api.get('/auth/recovery-status')
  return data
}

export const runSmtpHealthCheck = async (payload = { sendTestEmail: true }) => {
  const { data } = await api.post('/admin/smtp-test', payload)
  return data
}

export const fetchAdminMessages = async (params = {}) => {
  const query = new URLSearchParams()

  if (params.q) {
    query.set('q', params.q)
  }

  if (params.status && params.status !== 'all') {
    query.set('status', params.status)
  }

  if (params.limit) {
    query.set('limit', String(params.limit))
  }

  if (params.page) {
    query.set('page', String(params.page))
  }

  if (params.sort) {
    query.set('sort', String(params.sort))
  }

  const suffix = query.toString() ? `?${query.toString()}` : ''
  const { data } = await api.get(`/admin/messages${suffix}`)
  return data
}

export const deleteAdminMessage = async (id) => {
  const { data } = await api.delete(`/admin/messages/${id}`)
  return data
}

export const updateAdminMessageStatus = async (id, status) => {
  const { data } = await api.patch(`/admin/messages/${id}/status`, { status })
  return data
}

export const markAllAdminMessagesRead = async () => {
  const { data } = await api.post('/admin/messages/mark-all-read')
  return data
}

export const getAssetUrl = (path) => {
  if (!path) return ''
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  return `${backendBaseUrl}${path}`
}

export const getApiEndpointUrl = (path) => {
  if (!path) return apiBaseUrl
  return `${apiBaseUrl}${path.startsWith('/') ? path : `/${path}`}`
}

export const getResumeJsonUrl = () => getApiEndpointUrl('/portfolio/resume-json')
