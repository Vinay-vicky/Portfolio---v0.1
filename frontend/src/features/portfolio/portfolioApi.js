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

export const submitContactForm = async (payload) => {
  const { data } = await api.post('/contact', payload)
  return data
}

export const loginAdmin = async (credentials) => {
  const { data } = await api.post('/auth/login', credentials)
  return data
}

export const getAssetUrl = (path) => {
  if (!path) return ''
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  return `${backendBaseUrl}${path}`
}
