import axios from "axios"
import { useAuthStore } from "../store/authStore"

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/v1",
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error)
    else prom.resolve(token)
  })
  failedQueue = []
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const store = useAuthStore.getState()

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      store.refreshToken
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          return api(originalRequest)
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const res = await axios.post(`${"http://127.0.0.1:8000/api/v1"}/auth/refresh`, { refresh_token: store.refreshToken })
        store.setAccessToken(res.data.access_token)
        store.setRefreshToken(res.data.refresh_token)

        processQueue(null, res.data.access_token)
        originalRequest.headers.Authorization = `Bearer ${res.data.access_token}`
        return api(originalRequest)
      } catch (err) {
        processQueue(err, null)
        store.logout()
        window.location.href = "/login"
        return Promise.reject(err)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default api
