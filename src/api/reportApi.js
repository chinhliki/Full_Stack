import api from './axios'

export const reportApi = {
  dashboard() {
    return api.get('/api/identity/reports/dashboard')
  },

  topBooks(take = 10) {
    return api.get('/api/identity/reports/top-books', {
      params: { take }
    })
  },

  topReaders(take = 10) {
    return api.get('/api/identity/reports/top-readers', {
      params: { take }
    })
  },

  borrowReturn(params) {
    return api.get('/api/identity/reports/borrow-return', { params })
  }
}