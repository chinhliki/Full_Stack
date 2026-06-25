import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }

    // Gắn thông báo timeout vào error object để component hiển thị đúng
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      error.isTimeout = true
      if (!error.response) {
        error.response = { data: { message: 'Yêu cầu bị timeout. Máy chủ phản hồi quá chậm — vui lòng thử lại.' } }
      }
    }

    return Promise.reject(error)
  }
)

export default api