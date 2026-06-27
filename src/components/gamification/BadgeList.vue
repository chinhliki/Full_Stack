<template>
  <v-card class="badge-card pa-5" rounded="xl">
    <!-- Header -->
    <div class="d-flex align-center mb-4">
      <v-icon icon="mdi-medal" color="amber-darken-2" class="mr-2" />
      <span class="font-weight-black text-subtitle-1 text-secondary">Huy hiệu của tôi</span>
      <v-spacer />
      <v-chip size="small" color="amber-darken-2" variant="tonal" class="font-weight-bold">
        {{ store.achievedCount }}/{{ store.badges.length }} đạt được
      </v-chip>
    </div>

    <!-- Filter tabs -->
    <v-btn-toggle v-model="filter" density="compact" variant="tonal" rounded="pill" class="mb-4" mandatory>
      <v-btn value="all"      size="small">Tất cả</v-btn>
      <v-btn value="achieved" size="small">Đã đạt</v-btn>
      <v-btn value="locked"   size="small">Chưa đạt</v-btn>
    </v-btn-toggle>

    <!-- Loading skeleton -->
    <v-row v-if="store.badgesLoading">
      <v-col v-for="i in 6" :key="i" cols="6" sm="4" md="3">
        <v-skeleton-loader type="card" height="140" rounded="xl" />
      </v-col>
    </v-row>

    <!-- Badge grid -->
    <v-row v-else>
      <v-col
        v-for="badge in filteredBadges"
        :key="badge.id"
        cols="6" sm="4" md="3"
      >
        <v-tooltip :text="badge.description" location="top">
          <template #activator="{ props: tip }">
            <div
              v-bind="tip"
              class="badge-item d-flex flex-column align-center pa-4"
              :class="{ 'badge-achieved': badge.achieved, 'badge-locked': !badge.achieved }"
              @click="badge.achieved && openDetail(badge)"
            >
              <!-- Icon ring -->
              <div class="badge-ring" :class="badge.achieved ? 'ring-glow' : 'ring-locked'">
                <v-icon
                  :icon="badge.achieved ? badge.icon : 'mdi-lock-outline'"
                  :size="badge.achieved ? 30 : 26"
                  :color="badge.achieved ? 'amber-darken-2' : '#94a3b8'"
                />

                <!-- Achieved checkmark -->
                <div v-if="badge.achieved" class="badge-check">
                  <v-icon icon="mdi-check-circle" color="success" size="16" />
                </div>
              </div>

              <div class="badge-name text-center font-weight-bold mt-2" :class="badge.achieved ? 'text-amber-darken-2' : 'text-grey'">
                {{ badge.name }}
              </div>

              <div v-if="badge.achieved && badge.xpReward" class="mt-1">
                <v-chip size="x-small" color="success" variant="tonal">+{{ badge.xpReward }} XP</v-chip>
              </div>

              <div v-if="badge.achieved && badge.achievedAt" class="text-caption text-grey mt-1">
                {{ formatDate(badge.achievedAt) }}
              </div>
            </div>
          </template>
        </v-tooltip>
      </v-col>

      <v-col v-if="filteredBadges.length === 0" cols="12">
        <div class="text-center pa-8 text-grey">
          <v-icon icon="mdi-medal-outline" size="48" color="grey-lighten-1" class="mb-2" />
          <div class="text-subtitle-2">Không có huy hiệu nào</div>
        </div>
      </v-col>
    </v-row>

    <!-- Progress toward next badges -->
    <v-divider class="my-4" v-if="store.badges.some(b => !b.achieved)" />
    <div v-if="store.badges.some(b => !b.achieved)" class="text-caption text-grey font-weight-bold mb-2">
      <v-icon icon="mdi-target" size="14" class="mr-1" />
      MỤC TIÊU TIẾP THEO
    </div>
    <div
      v-for="badge in nextTargets"
      :key="badge.id"
      class="next-target d-flex align-center ga-3 mb-2 pa-3"
    >
      <v-icon :icon="badge.icon" color="grey" size="20" />
      <div class="flex-grow-1">
        <div class="text-body-2 font-weight-bold">{{ badge.name }}</div>
        <div class="text-caption text-grey">{{ badge.description }}</div>
      </div>
      <v-chip v-if="badge.xpReward" size="x-small" variant="tonal" color="amber-darken-2">
        +{{ badge.xpReward }} XP
      </v-chip>
    </div>
  </v-card>

  <!-- Detail dialog (for achieved badges) -->
  <v-dialog v-model="detailDialog" max-width="360">
    <v-card v-if="selectedBadge" rounded="xl" class="text-center pa-6">
      <div class="badge-ring ring-glow mx-auto mb-4" style="width:80px;height:80px;border-radius:24px">
        <v-icon :icon="selectedBadge.icon" size="40" color="amber-darken-2" />
        <div class="badge-check"><v-icon icon="mdi-check-circle" color="success" size="20" /></div>
      </div>
      <div class="text-h6 font-weight-black text-amber-darken-2 mb-1">{{ selectedBadge.name }}</div>
      <div class="text-body-2 text-grey mb-3">{{ selectedBadge.description }}</div>
      <v-chip v-if="selectedBadge.xpReward" color="success" variant="tonal" class="mb-3">+{{ selectedBadge.xpReward }} XP</v-chip>
      <div v-if="selectedBadge.achievedAt" class="text-caption text-grey">Đạt được: {{ formatDate(selectedBadge.achievedAt) }}</div>
      <v-btn class="mt-4" variant="tonal" color="primary" block @click="detailDialog = false">Đóng</v-btn>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useGamificationStore } from '../../stores/gamificationStore'

const store = useGamificationStore()
const filter = ref('all')
const detailDialog = ref(false)
const selectedBadge = ref(null)

const filteredBadges = computed(() => {
  if (filter.value === 'achieved') return store.badges.filter(b => b.achieved)
  if (filter.value === 'locked')   return store.badges.filter(b => !b.achieved)
  return store.badges
})

const nextTargets = computed(() =>
  store.badges.filter(b => !b.achieved).slice(0, 3)
)

function openDetail(badge) {
  selectedBadge.value = badge
  detailDialog.value = true
}

function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}
</script>

<style scoped>
.badge-card {
  border: 1px solid rgba(226, 232, 240, 0.9) !important;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.07) !important;
}

.badge-item {
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.25s ease;
  border: 1px solid transparent;
  min-height: 130px;
}

.badge-achieved {
  background: linear-gradient(135deg, rgba(251,191,36,0.06), rgba(245,158,11,0.04));
  border-color: rgba(245, 158, 11, 0.2);
}

.badge-achieved:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(245, 158, 11, 0.15);
  border-color: rgba(245, 158, 11, 0.4);
}

.badge-locked {
  background: rgba(248, 250, 252, 0.6);
  border-color: rgba(226, 232, 240, 0.5);
  cursor: default;
  opacity: 0.65;
}

/* Badge icon ring */
.badge-ring {
  position: relative;
  width: 60px;
  height: 60px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ring-glow {
  background: linear-gradient(135deg, rgba(251,191,36,0.18), rgba(245,158,11,0.12));
  border: 2px solid rgba(245, 158, 11, 0.4);
  box-shadow: 0 4px 16px rgba(245, 158, 11, 0.2);
}

.ring-locked {
  background: rgba(148, 163, 184, 0.08);
  border: 2px solid rgba(148, 163, 184, 0.2);
}

.badge-check {
  position: absolute;
  bottom: -6px;
  right: -6px;
  background: #fff;
  border-radius: 50%;
  line-height: 0;
}

.badge-name {
  font-size: 12px;
  line-height: 1.3;
}

.next-target {
  background: rgba(248, 250, 252, 0.7);
  border-radius: 10px;
  border: 1px solid rgba(226, 232, 240, 0.6);
}
</style>
