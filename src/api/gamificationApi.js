import api from './axios'

export const gamificationApi = {
  // GET /api/gamification/xp  → { totalXP, level, xpToNextLevel, history[] }
  getMyXP() {
    return api.get('/api/gamification/xp')
  },

  // GET /api/gamification/badges  → Badge[]
  getBadges() {
    return api.get('/api/gamification/badges')
  },

  // GET /api/gamification/leaderboard?period=month|year&limit=10  → LeaderboardEntry[]
  getLeaderboard(period = 'month', limit = 10) {
    return api.get('/api/gamification/leaderboard', { params: { period, limit } })
  }
}
