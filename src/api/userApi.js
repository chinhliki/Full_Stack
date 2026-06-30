import api from './axios'

export const userApi = {
  lockUser(id) {
    return api.put(`/api/identity/users/${id}/lock`)
  },

  unlockUser(id) {
    return api.put(`/api/identity/users/${id}/unlock`)
  },

  setRole(userId, role) {
    return api.put(`/api/identity/users/${userId}/role`, { role })
  },

  getAll(params) {
    return api.get('/api/identity/users', { params })
  },

  create(data) {
    return api.post('/api/identity/users', data)
  },

  updateRole(id, role) {
    return api.put(`/api/identity/users/${id}/role`, { role })
  },

  resetPassword(id) {
    return api.put(`/api/identity/users/${id}/reset-password`)
  }
}
