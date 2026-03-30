import axios from 'axios'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
const backendBaseUrl = apiBaseUrl.replace(/\/api\/?$/, '')

const api = axios.create({ baseURL: apiBaseUrl })

export const fetchPortfolio = async () => {
  const { data } = await api.get('/portfolio')
  return data
}

export const submitContactForm = async (payload) => {
  const { data } = await api.post('/contact', payload)
  return data
}

export const getAssetUrl = (path) => {
  if (!path) return ''
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  return `${backendBaseUrl}${path}`
}
