import api from './axios'

export const authApi = {
  login(data) {
    return api.post('/api/identity/auth/login', data)
  },

  register(data) {
    return api.post('/api/identity/auth/register', data)
  },

  me() {
    return api.get('/api/identity/auth/me')
  }
}