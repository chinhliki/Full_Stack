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
    return api.get('/api/identity/report/borrowReturn', { params })
  },

  categoryStats(params) {
    return api.get('/api/identity/report/categoryStats', { params })
  },

  fineRevenue(params) {
    return api.get('/api/identity/report/fineRevenue', { params })
  }
}