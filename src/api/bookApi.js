import api from './axios'

export const bookApi = {
  getAll(params) {
    return api.get('/api/catalog/books', { params })
  },

  getById(id) {
    return api.get(`/api/catalog/books/${id}`)
  },

  getCategoryMap() {
    return api.get('/api/catalog/books/category-map')
  },

  create(data) {
    return api.post('/api/catalog/books', data)
  },

  update(id, data) {
    return api.put(`/api/catalog/books/${id}`, data)
  },

  remove(id) {
    return api.delete(`/api/catalog/books/${id}`)
  },

  importExcel(formData) {
    return api.post('/api/catalog/books/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}