import api from './axios'

export const userApi = {
  lockUser(id) {
    return api.put(`/api/identity/users/${id}/lock`)
  },

  unlockUser(id) {
    return api.put(`/api/identity/users/${id}/unlock`)
  }
}