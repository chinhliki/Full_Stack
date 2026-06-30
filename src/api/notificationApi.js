import api from './axios'

export const notificationApi = {
  // GET /api/identity/notifications?page=1&limit=30
  getAll(params = {}) {
    return api.get('/api/identity/notifications', { params: { limit: 30, ...params } })
  },

  // PATCH /api/identity/notifications/{id}/read
  markAsRead(id) {
    return api.patch(`/api/identity/notifications/${id}/read`)
  },

  // PATCH /api/identity/notifications/read-all
  markAllAsRead() {
    return api.patch('/api/identity/notifications/read-all')
  },

  // DELETE /api/identity/notifications/{id}
  remove(id) {
    return api.delete(`/api/identity/notifications/${id}`)
  }
}
