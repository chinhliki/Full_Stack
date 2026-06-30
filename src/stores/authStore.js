import { defineStore } from 'pinia'
import { authApi } from '../api/authApi'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('accessToken') || '',
    user: JSON.parse(localStorage.getItem('user') || 'null')
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
    role: (state) => state.user?.role || '',
    fullName: (state) => state.user?.fullName || '',
    email: (state) => state.user?.email || '',
    userId: (state) => state.user?.userId || state.user?.id || ''
  },

  actions: {
    async login(email, password) {
      const response = await authApi.login({ email, password })

      // Support both flat {token, fullName, role} and nested {accessToken, user} responses
      const token = response.data.token || response.data.accessToken
      this.token = token
      localStorage.setItem('accessToken', this.token)

      let user = null
      if (response.data.user) {
        user = response.data.user
      } else {
        try {
          const meRes = await authApi.me()
          user = meRes.data
        } catch {
          user = {
            fullName: response.data.fullName,
            role: response.data.role
          }
        }
      }

      this.user = user
      localStorage.setItem('user', JSON.stringify(this.user))

      return user
    },

    logout() {
      this.token = ''
      this.user = null
      localStorage.removeItem('accessToken')
      localStorage.removeItem('user')
    }
  }
})