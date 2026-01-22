import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Token getter function - set by AuthContext
let getAccessToken: (() => string | null) | null = null

export function setAuthTokenGetter(getter: () => string | null) {
  getAccessToken = getter
}

// Request interceptor to add auth header
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken?.()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error || error.message
    return Promise.reject(new Error(message))
  }
)
