import api from './axios'

export const libraryCardApi = {
  getMyCard() {
    return api.get('/api/identity/library-cards/me')
  },

  getCard(userId) {
    return api.get(`/api/identity/library-cards/${userId}`)
  },

  renewCard(userId) {
    return api.put(`/api/identity/library-cards/${userId}/renew`)
  },

  lockCard(userId) {
    return api.put(`/api/identity/library-cards/${userId}/lock`)
  },

  unlockCard(userId) {
    return api.put(`/api/identity/library-cards/${userId}/unlock`)
  }
}