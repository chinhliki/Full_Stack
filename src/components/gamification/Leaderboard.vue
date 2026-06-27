<template>
  <v-card class="lb-card pa-5" rounded="xl">
    <!-- Header -->
    <div class="d-flex align-center flex-wrap ga-3 mb-5">
      <div class="d-flex align-center">
        <v-icon icon="mdi-trophy" color="amber-darken-2" class="mr-2" />
        <span class="font-weight-black text-subtitle-1 text-secondary">Bảng xếp hạng</span>
      </div>
      <v-spacer />

      <!-- Period toggle -->
      <v-btn-toggle
        :model-value="store.period"
        density="compact"
        variant="tonal"
        rounded="pill"
        mandatory
        @update:model-value="store.fetchLeaderboard($event)"
      >
        <v-btn value="month" size="small" prepend-icon="mdi-calendar-month">Tháng này</v-btn>
        <v-btn value="year"  size="small" prepend-icon="mdi-calendar">Năm nay</v-btn>
      </v-btn-toggle>

      <v-btn
        icon="mdi-refresh"
        size="x-small"
        variant="tonal"
        :loading="store.lbLoading"
        @click="store.fetchLeaderboard(store.period)"
      />
    </div>

    <!-- Podium (top 3) -->
    <div v-if="!store.lbLoading && top3.length === 3" class="podium-row d-flex align-end justify-center ga-3 mb-6">
      <!-- 2nd place -->
      <div class="podium-item d-flex flex-column align-center">
        <v-avatar size="52" class="mb-2 podium-avatar silver-avatar">
          <v-img v-if="top3[1].avatarUrl" :src="top3[1].avatarUrl" />
          <v-icon v-else icon="mdi-account" color="white" />
        </v-avatar>
        <div class="text-caption font-weight-black text-truncate" style="max-width:72px">{{ top3[1].readerName }}</div>
        <div class="text-caption text-grey">{{ top3[1].totalXP }} XP</div>
        <div class="podium-stand stand-2">
          <v-icon icon="mdi-medal" color="grey-lighten-1" size="22" />
          <div class="podium-num">2</div>
        </div>
      </div>

      <!-- 1st place -->
      <div class="podium-item d-flex flex-column align-center">
        <v-icon icon="mdi-crown" color="amber-darken-2" size="22" class="mb-1" style="animation: crown-bob 2s ease-in-out infinite alternate;" />
        <v-avatar size="64" class="mb-2 podium-avatar gold-avatar">
          <v-img v-if="top3[0].avatarUrl" :src="top3[0].avatarUrl" />
          <v-icon v-else icon="mdi-account" color="white" />
        </v-avatar>
        <div class="text-caption font-weight-black text-truncate" style="max-width:80px">{{ top3[0].readerName }}</div>
        <div class="text-caption text-amber-darken-2 font-weight-bold">{{ top3[0].totalXP }} XP</div>
        <div class="podium-stand stand-1">
          <v-icon icon="mdi-trophy" color="amber-darken-2" size="24" />
          <div class="podium-num">1</div>
        </div>
      </div>

      <!-- 3rd place -->
      <div class="podium-item d-flex flex-column align-center">
        <v-avatar size="52" class="mb-2 podium-avatar bronze-avatar">
          <v-img v-if="top3[2].avatarUrl" :src="top3[2].avatarUrl" />
          <v-icon v-else icon="mdi-account" color="white" />
        </v-avatar>
        <div class="text-caption font-weight-black text-truncate" style="max-width:72px">{{ top3[2].readerName }}</div>
        <div class="text-caption text-grey">{{ top3[2].totalXP }} XP</div>
        <div class="podium-stand stand-3">
          <v-icon icon="mdi-medal" color="brown-lighten-1" size="20" />
          <div class="podium-num">3</div>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="store.lbLoading">
      <v-skeleton-loader v-for="i in 7" :key="i" type="list-item-avatar" class="mb-1" />
    </div>

    <!-- Empty -->
    <div v-else-if="store.leaderboard.length === 0" class="text-center pa-8 text-grey">
      <v-icon icon="mdi-podium" size="52" color="grey-lighten-1" class="mb-2" />
      <div class="text-subtitle-2">Chưa có dữ liệu xếp hạng</div>
    </div>

    <!-- Ranks 4-10 list -->
    <v-list v-else nav density="comfortable" class="lb-list pa-0">
      <v-list-item
        v-for="entry in restOfList"
        :key="entry.readerId"
        class="lb-item mb-1"
        :class="{ 'lb-me': entry.isCurrentUser }"
        rounded="lg"
      >
        <!-- Rank number -->
        <template #prepend>
          <div class="rank-bubble mr-3" :class="'rank-' + entry.rank">
            {{ entry.rank }}
          </div>
        </template>

        <!-- Avatar + Name -->
        <div class="d-flex align-center ga-3">
          <v-avatar size="36">
            <v-img v-if="entry.avatarUrl" :src="entry.avatarUrl" />
            <v-icon v-else icon="mdi-account" />
          </v-avatar>
          <div>
            <div class="text-body-2 font-weight-bold">
              {{ entry.readerName }}
              <v-chip v-if="entry.isCurrentUser" size="x-small" color="primary" variant="tonal" class="ml-1">Bạn</v-chip>
            </div>
          </div>
        </div>

        <!-- XP -->
        <template #append>
          <div class="text-right">
            <div class="text-body-2 font-weight-black text-primary">{{ entry.totalXP }}</div>
            <div class="text-caption text-grey">XP</div>
          </div>
        </template>
      </v-list-item>
    </v-list>

    <!-- Current user rank if not in top 10 -->
    <div v-if="myRankOutside" class="my-rank-card d-flex align-center ga-3 pa-3 mt-3">
      <div class="rank-bubble">{{ myRankOutside.rank }}</div>
      <v-avatar size="36">
        <v-icon icon="mdi-account" />
      </v-avatar>
      <div class="flex-grow-1">
        <div class="text-body-2 font-weight-bold">{{ myRankOutside.readerName }} <v-chip size="x-small" color="primary" variant="tonal">Bạn</v-chip></div>
      </div>
      <div class="text-body-2 font-weight-black text-primary">{{ myRankOutside.totalXP }} XP</div>
    </div>
  </v-card>
</template>

<script setup>
import { computed } from 'vue'
import { useGamificationStore } from '../../stores/gamificationStore'
import { useAuthStore } from '../../stores/authStore'

const store = useGamificationStore()
const auth  = useAuthStore()

const enriched = computed(() =>
  store.leaderboard.map((e, i) => ({
    ...e,
    rank: e.rank ?? (i + 1),
    isCurrentUser: e.readerId === (auth.user?.id || auth.user?.readerId || auth.user?.userId)
  }))
)

const top3       = computed(() => enriched.value.slice(0, 3))
const restOfList = computed(() => enriched.value.slice(3))
const myRankOutside = computed(() => {
  const me = enriched.value.find(e => e.isCurrentUser)
  return me && me.rank > 10 ? me : null
})
</script>

<style scoped>
.lb-card {
  border: 1px solid rgba(226, 232, 240, 0.9) !important;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.07) !important;
}

/* Podium */
.podium-avatar { border: 3px solid transparent; }
.gold-avatar   { border-color: #f59e0b; box-shadow: 0 0 14px rgba(245,158,11,0.4); }
.silver-avatar { border-color: #94a3b8; }
.bronze-avatar { border-color: #b45309; }

.podium-stand {
  border-radius: 10px 10px 0 0;
  padding: 8px 16px;
  text-align: center;
  margin-top: 6px;
}

.stand-1 { height: 72px; background: linear-gradient(180deg, rgba(251,191,36,0.25), rgba(245,158,11,0.1)); border: 1px solid rgba(245,158,11,0.3); }
.stand-2 { height: 52px; background: linear-gradient(180deg, rgba(148,163,184,0.2), rgba(148,163,184,0.08)); border: 1px solid rgba(148,163,184,0.25); }
.stand-3 { height: 42px; background: linear-gradient(180deg, rgba(180,83,9,0.2), rgba(180,83,9,0.08)); border: 1px solid rgba(180,83,9,0.2); }

.podium-num { font-size: 11px; font-weight: 800; color: #64748b; }

/* List items */
.lb-item {
  transition: background 0.2s ease;
  border: 1px solid transparent;
}

.lb-me {
  background: linear-gradient(90deg, rgba(99,102,241,0.07), rgba(168,85,247,0.04)) !important;
  border-color: rgba(99, 102, 241, 0.2) !important;
}

/* Rank bubble */
.rank-bubble {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: rgba(148, 163, 184, 0.15);
  color: #64748b;
  font-size: 12px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.my-rank-card {
  background: linear-gradient(90deg, rgba(99,102,241,0.08), rgba(168,85,247,0.05));
  border-radius: 12px;
  border: 1px dashed rgba(99, 102, 241, 0.3);
}

@keyframes crown-bob {
  0%   { transform: translateY(0); }
  100% { transform: translateY(-4px); }
}
</style>
