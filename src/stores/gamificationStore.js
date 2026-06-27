import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { gamificationApi } from '../api/gamificationApi'

// ── XP level ladder ───────────────────────────────────────────────────────
export const XP_LEVELS = [
  { rank: 1, name: 'Tân sinh viên',  min: 0,    max: 99,    icon: 'mdi-seedling',         color: '#64748b', bg: 'rgba(100,116,139,0.12)' },
  { rank: 2, name: 'Độc giả mới',    min: 100,  max: 299,   icon: 'mdi-book-open-outline', color: '#0891b2', bg: 'rgba(8,145,178,0.12)'   },
  { rank: 3, name: 'Học giả',         min: 300,  max: 699,   icon: 'mdi-school-outline',    color: '#16a34a', bg: 'rgba(22,163,74,0.12)'   },
  { rank: 4, name: 'Tri thức',        min: 700,  max: 1499,  icon: 'mdi-star-outline',      color: '#d97706', bg: 'rgba(217,119,6,0.12)'   },
  { rank: 5, name: 'Bậc thầy',        min: 1500, max: 2999,  icon: 'mdi-crown-outline',     color: '#9333ea', bg: 'rgba(147,51,234,0.12)'  },
  { rank: 6, name: 'Huyền thoại',     min: 3000, max: Infinity, icon: 'mdi-trophy',          color: '#dc2626', bg: 'rgba(220,38,38,0.12)'  }
]

// Front-end badge definitions — merged with backend `achieved` flag
export const BADGE_DEFS = [
  { id: 'first_borrow',  name: 'Khởi đầu',        icon: 'mdi-book-plus',           description: 'Mượn sách lần đầu tiên',              xpReward: 20 },
  { id: 'bookworm_5',    name: 'Mọt sách',          icon: 'mdi-bookshelf',           description: 'Mượn 5 quyển sách',                  xpReward: 50 },
  { id: 'bookworm_10',   name: 'Đại mọt sách',      icon: 'mdi-library',             description: 'Mượn 10 quyển sách',                 xpReward: 100 },
  { id: 'on_time_3',     name: 'Đúng giờ',          icon: 'mdi-clock-check-outline', description: 'Trả sách đúng hạn 3 lần liên tiếp',   xpReward: 30 },
  { id: 'on_time_10',    name: 'Cực kỳ đúng giờ',   icon: 'mdi-clock-star-four-points', description: 'Trả sách đúng hạn 10 lần',        xpReward: 80 },
  { id: 'explorer',      name: 'Khám phá',          icon: 'mdi-compass-outline',     description: 'Mượn sách từ 5 thể loại khác nhau',  xpReward: 60 },
  { id: 'scholar',       name: 'Học giả',            icon: 'mdi-school',              description: 'Đạt 300 XP',                          xpReward: 0  },
  { id: 'streak_week',   name: 'Hoạt động liên tục', icon: 'mdi-fire',               description: 'Mượn sách 4 tuần liên tiếp',          xpReward: 70 },
  { id: 'top3',          name: 'Top 3 xuất sắc',    icon: 'mdi-podium-gold',         description: 'Đứng top 3 bảng xếp hạng tháng',     xpReward: 150 },
  { id: 'legend',        name: 'Huyền thoại',        icon: 'mdi-trophy',              description: 'Đạt cấp độ Huyền thoại (3000 XP)',   xpReward: 0  }
]

function calcLevel(xp) {
  return XP_LEVELS.findLast(l => xp >= l.min) ?? XP_LEVELS[0]
}

function calcProgress(xp) {
  const level = calcLevel(xp)
  if (level.max === Infinity) return 100
  const range = level.max - level.min + 1
  const earned = xp - level.min
  return Math.min(100, Math.round((earned / range) * 100))
}

// ── Store ─────────────────────────────────────────────────────────────────
export const useGamificationStore = defineStore('gamification', () => {
  // XP
  const totalXP    = ref(0)
  const xpHistory  = ref([])         // [{ action, xp, earnedAt }]
  const xpLoading  = ref(false)

  // Badges
  const badges     = ref([])         // merged BADGE_DEFS + achieved flag
  const badgesLoading = ref(false)

  // Leaderboard
  const leaderboard = ref([])        // [{ rank, readerId, readerName, totalXP, avatarUrl }]
  const period      = ref('month')   // 'month' | 'year'
  const lbLoading   = ref(false)

  // ── Computed ────────────────────────────────────────────────
  const currentLevel    = computed(() => calcLevel(totalXP.value))
  const xpProgress      = computed(() => calcProgress(totalXP.value))
  const achievedCount   = computed(() => badges.value.filter(b => b.achieved).length)
  const xpToNextLevel   = computed(() => {
    const level = currentLevel.value
    return level.max === Infinity ? 0 : level.max - totalXP.value + 1
  })

  // ── Actions ─────────────────────────────────────────────────
  async function fetchMyXP() {
    xpLoading.value = true
    try {
      const res = await gamificationApi.getMyXP()
      totalXP.value   = res.data?.totalXP   ?? res.data?.xp ?? 0
      xpHistory.value = Array.isArray(res.data?.history) ? res.data.history : []
    } catch (err) {
      console.warn('[Gamification] fetchMyXP failed:', err?.response?.status)
    } finally {
      xpLoading.value = false
    }
  }

  async function fetchBadges() {
    badgesLoading.value = true
    try {
      const res = await gamificationApi.getBadges()
      const fromApi = Array.isArray(res.data) ? res.data : (res.data?.items ?? [])
      // Merge frontend defs with backend achieved status
      badges.value = BADGE_DEFS.map(def => {
        const apiEntry = fromApi.find(b => b.id === def.id || b.badgeId === def.id)
        return { ...def, achieved: apiEntry?.achieved ?? apiEntry?.isAchieved ?? false, achievedAt: apiEntry?.achievedAt ?? null }
      })
    } catch {
      // If API not ready, show all as locked (still useful to display)
      badges.value = BADGE_DEFS.map(def => ({ ...def, achieved: false }))
    } finally {
      badgesLoading.value = false
    }
  }

  async function fetchLeaderboard(newPeriod) {
    if (newPeriod) period.value = newPeriod
    lbLoading.value = true
    try {
      const res = await gamificationApi.getLeaderboard(period.value)
      leaderboard.value = Array.isArray(res.data) ? res.data : (res.data?.items ?? [])
    } catch {
      leaderboard.value = []
    } finally {
      lbLoading.value = false
    }
  }

  async function loadAll() {
    await Promise.allSettled([fetchMyXP(), fetchBadges(), fetchLeaderboard()])
  }

  return {
    totalXP, xpHistory, xpLoading,
    badges, badgesLoading,
    leaderboard, period, lbLoading,
    currentLevel, xpProgress, xpToNextLevel, achievedCount,
    fetchMyXP, fetchBadges, fetchLeaderboard, loadAll
  }
})
