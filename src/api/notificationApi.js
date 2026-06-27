import api from './axios'

export const notificationApi = {
  // GET /api/notifications?page=1&limit=30
  getAll(params = {}) {
    return api.get('/api/notifications', { params: { limit: 30, ...params } })
  },

  // PATCH /api/notifications/{id}/read
  markAsRead(id) {
    return api.patch(`/api/notifications/${id}/read`)
  },

  // PATCH /api/notifications/read-all
  markAllAsRead() {
    return api.patch('/api/notifications/read-all')
  },

  // DELETE /api/notifications/{id}
  remove(id) {
    return api.delete(`/api/notifications/${id}`)
  }
}
