<template>
  <div>
    <!-- Page header -->
    <div class="action-bar mb-0">
      <div>
        <div class="page-title">Thành tích của tôi</div>
        <div class="page-subtitle">Xem điểm XP, huy hiệu và thứ hạng trong cộng đồng thư viện</div>
      </div>
      <v-spacer />
      <v-btn
        color="primary"
        variant="tonal"
        prepend-icon="mdi-refresh"
        :loading="store.xpLoading || store.badgesLoading || store.lbLoading"
        @click="store.loadAll()"
      >
        Làm mới
      </v-btn>
    </div>

    <!-- XP Summary hero strip -->
    <div class="hero-strip d-flex align-center ga-5 pa-5 mb-6">
      <div
        class="hero-icon-wrap"
        :style="{ background: store.currentLevel.bg, border: `2px solid ${store.currentLevel.color}30` }"
      >
        <v-icon :icon="store.currentLevel.icon" :color="store.currentLevel.color" size="38" />
      </div>

      <div>
        <div class="text-caption text-grey font-weight-bold text-uppercase">Cấp độ hiện tại</div>
        <div class="hero-level font-weight-black" :style="{ color: store.currentLevel.color }">
          {{ store.currentLevel.name }}
        </div>
      </div>

      <v-divider vertical class="mx-2" />

      <div class="text-center">
        <div class="hero-xp font-weight-black text-primary">{{ store.totalXP.toLocaleString('vi-VN') }}</div>
        <div class="text-caption text-grey">Tổng XP</div>
      </div>

      <v-divider vertical class="mx-2" />

      <div class="text-center">
        <div class="hero-xp font-weight-black text-amber-darken-2">{{ store.achievedCount }}</div>
        <div class="text-caption text-grey">Huy hiệu</div>
      </div>

      <v-divider vertical class="mx-2" />

      <div class="text-center">
        <div class="hero-xp font-weight-black text-secondary">{{ myRank ?? '—' }}</div>
        <div class="text-caption text-grey">Hạng tháng</div>
      </div>

      <v-spacer />

      <!-- Mini XP progress bar -->
      <div style="width: 200px" class="d-none d-md-block">
        <div class="d-flex justify-space-between mb-1">
          <span class="text-caption text-grey">Tiến độ lên cấp</span>
          <span class="text-caption font-weight-bold" :style="{ color: store.currentLevel.color }">{{ store.xpProgress }}%</span>
        </div>
        <v-progress-linear
          :model-value="store.xpProgress"
          :color="store.currentLevel.color"
          bg-color="rgba(148,163,184,0.2)"
          height="8"
          rounded="pill"
        />
        <div v-if="store.xpToNextLevel > 0" class="text-caption text-grey mt-1 text-right">
          còn {{ store.xpToNextLevel }} XP
        </div>
      </div>
    </div>

    <!-- Tab navigation -->
    <v-tabs v-model="tab" color="primary" class="mb-5" grow>
      <v-tab value="xp" prepend-icon="mdi-lightning-bolt">
        Điểm XP
      </v-tab>
      <v-tab value="badges" prepend-icon="mdi-medal">
        Huy hiệu
        <v-badge
          v-if="store.achievedCount > 0"
          :content="store.achievedCount"
          color="amber-darken-2"
          inline
          class="ml-1"
        />
      </v-tab>
      <v-tab value="leaderboard" prepend-icon="mdi-trophy">
        Bảng xếp hạng
      </v-tab>
    </v-tabs>

    <!-- Tab panels -->
    <v-window v-model="tab" @update:model-value="onTabChange">
      <!-- XP tab -->
      <v-window-item value="xp">
        <v-row>
          <v-col cols="12" lg="8">
            <XPProgress />
          </v-col>
          <v-col cols="12" lg="4">
            <!-- XP earning guide -->
            <v-card class="xp-guide-card pa-5" rounded="xl">
              <div class="d-flex align-center mb-4">
                <v-icon icon="mdi-lightning-bolt" color="amber-darken-2" class="mr-2" />
                <span class="font-weight-black text-subtitle-2 text-secondary">Cách kiếm XP</span>
              </div>
              <v-list density="compact" class="pa-0">
                <v-list-item
                  v-for="rule in XP_RULES"
                  :key="rule.action"
                  class="xp-rule-item mb-2 px-3"
                  rounded="lg"
                >
                  <template #prepend>
                    <v-icon :icon="rule.icon" :color="rule.color" size="18" class="mr-3" />
                  </template>
                  <v-list-item-title class="text-body-2">{{ rule.action }}</v-list-item-title>
                  <template #append>
                    <v-chip size="x-small" :color="rule.color" variant="tonal" class="font-weight-bold">
                      +{{ rule.xp }} XP
                    </v-chip>
                  </template>
                </v-list-item>
              </v-list>
            </v-card>
          </v-col>
        </v-row>
      </v-window-item>

      <!-- Badges tab -->
      <v-window-item value="badges">
        <BadgeList />
      </v-window-item>

      <!-- Leaderboard tab -->
      <v-window-item value="leaderboard">
        <Leaderboard />
      </v-window-item>
    </v-window>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useGamificationStore } from '../../stores/gamificationStore'
import { useAuthStore } from '../../stores/authStore'
import XPProgress from '../../components/gamification/XPProgress.vue'
import BadgeList from '../../components/gamification/BadgeList.vue'
import Leaderboard from '../../components/gamification/Leaderboard.vue'

const store = useGamificationStore()
const auth  = useAuthStore()
const tab   = ref('xp')

const myRank = computed(() => {
  const me = store.leaderboard.find(e =>
    e.readerId === (auth.user?.id || auth.user?.readerId || auth.user?.userId)
  )
  return me?.rank ?? null
})

// Lazy-load tab data on first open
const loaded = ref({ xp: false, badges: false, leaderboard: false })

async function onTabChange(newTab) {
  if (loaded.value[newTab]) return
  loaded.value[newTab] = true
  if (newTab === 'xp')          await store.fetchMyXP()
  if (newTab === 'badges')      await store.fetchBadges()
  if (newTab === 'leaderboard') await store.fetchLeaderboard()
}

onMounted(async () => {
  // Load XP tab on mount (default tab)
  await store.loadAll()
  loaded.value = { xp: true, badges: true, leaderboard: true }
})

// XP earning rules shown in guide card
const XP_RULES = [
  { action: 'Mượn sách',              xp: 10,  icon: 'mdi-book-plus',           color: 'primary'        },
  { action: 'Trả sách đúng hạn',       xp: 15,  icon: 'mdi-clock-check-outline', color: 'success'        },
  { action: 'Không có phiếu quá hạn trong tháng', xp: 50, icon: 'mdi-shield-check',  color: 'teal'     },
  { action: 'Mượn sách thể loại mới',  xp: 20,  icon: 'mdi-compass-outline',     color: 'info'           },
  { action: 'Đạt huy hiệu mới',        xp: '?', icon: 'mdi-medal',               color: 'amber-darken-2' },
  { action: 'Top 10 bảng xếp hạng',    xp: 30,  icon: 'mdi-trophy-outline',      color: 'orange'         }
]
</script>

<style scoped>
.hero-strip {
  background: linear-gradient(135deg, rgba(238,242,255,0.8), rgba(245,243,255,0.6));
  border: 1px solid rgba(226,232,240,0.8);
  border-radius: 20px;
}

.hero-icon-wrap {
  width: 72px;
  height: 72px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.hero-level { font-size: 20px; letter-spacing: -0.03em; }
.hero-xp    { font-size: 26px; letter-spacing: -0.04em; }

.xp-guide-card {
  border: 1px solid rgba(226, 232, 240, 0.9) !important;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.07) !important;
}

.xp-rule-item {
  background: rgba(248, 250, 252, 0.7);
  border: 1px solid rgba(226, 232, 240, 0.5);
}
</style>
