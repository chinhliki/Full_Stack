import api from './axios'

export const readerApi = {
  getAll(params) {
    return api.get('/api/identity/readers', { params })
  },

  getMe() {
    return api.get('/api/identity/readers/me')
  },

  getById(id) {
    return api.get(`/api/identity/readers/${id}`)
  }
}