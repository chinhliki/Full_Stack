<template>
  <v-card class="xp-card pa-6" rounded="xl">
    <!-- Level badge + total XP -->
    <div class="d-flex align-center ga-4 mb-5">
      <div class="level-icon-wrap" :style="{ background: store.currentLevel.bg }">
        <v-icon :icon="store.currentLevel.icon" :color="store.currentLevel.color" size="32" />
      </div>

      <div class="flex-grow-1">
        <div class="d-flex align-center justify-space-between mb-1">
          <span class="level-name font-weight-black" :style="{ color: store.currentLevel.color }">
            {{ store.currentLevel.name }}
          </span>
          <span class="xp-total font-weight-black text-h5">
            <span ref="xpCounter" class="xp-num">{{ animatedXP }}</span>
            <span class="text-caption text-grey ml-1">XP</span>
          </span>
        </div>

        <!-- Progress bar -->
        <v-progress-linear
          :model-value="store.xpProgress"
          :color="store.currentLevel.color"
          bg-color="rgba(148,163,184,0.2)"
          height="12"
          rounded="pill"
          class="xp-bar"
        >
          <template #default>
            <span class="xp-bar-label">{{ store.xpProgress }}%</span>
          </template>
        </v-progress-linear>

        <div class="d-flex justify-space-between mt-1">
          <span class="text-caption text-grey">{{ store.currentLevel.min }} XP</span>
          <span class="text-caption text-grey" v-if="store.currentLevel.max !== Infinity">
            <template v-if="store.xpToNextLevel > 0">
              còn <b>{{ store.xpToNextLevel }}</b> XP lên cấp tiếp
            </template>
            <template v-else>Đã đạt cấp tối đa!</template>
          </span>
          <span class="text-caption font-weight-bold" :style="{ color: store.currentLevel.color }" v-else>
            Cấp độ tối đa!
          </span>
        </div>
      </div>
    </div>

    <!-- Level roadmap (mini chips) -->
    <div class="level-road d-flex align-center justify-space-between px-1 mb-5">
      <div
        v-for="(lv, i) in XP_LEVELS"
        :key="lv.rank"
        class="level-node d-flex flex-column align-center"
      >
        <div
          class="level-node-dot"
          :class="{ 'node-active': store.currentLevel.rank === lv.rank, 'node-done': store.currentLevel.rank > lv.rank }"
          :style="store.currentLevel.rank >= lv.rank ? { borderColor: lv.color, background: lv.bg } : {}"
        >
          <v-icon :icon="lv.icon" :color="store.currentLevel.rank >= lv.rank ? lv.color : '#94a3b8'" size="14" />
        </div>
        <span class="level-node-label text-center" :style="store.currentLevel.rank >= lv.rank ? { color: lv.color } : {}">
          {{ lv.name.split(' ')[0] }}
        </span>
        <!-- connector line (not after last) -->
        <div v-if="i < XP_LEVELS.length - 1" class="level-connector" :class="{ 'connector-done': store.currentLevel.rank > lv.rank }" />
      </div>
    </div>

    <!-- XP History -->
    <div v-if="store.xpHistory.length > 0">
      <div class="text-subtitle-2 font-weight-black text-secondary mb-3">
        <v-icon icon="mdi-history" size="16" class="mr-1" />
        Lịch sử nhận XP
      </div>

      <v-timeline density="compact" side="end" class="xp-timeline">
        <v-timeline-item
          v-for="(item, i) in visibleHistory"
          :key="i"
          :dot-color="item.xp >= 50 ? 'success' : 'primary'"
          size="x-small"
        >
          <div class="d-flex align-center justify-space-between">
            <span class="text-body-2">{{ item.action }}</span>
            <v-chip size="x-small" :color="item.xp >= 50 ? 'success' : 'primary'" variant="tonal" class="ml-2 font-weight-bold">
              +{{ item.xp }} XP
            </v-chip>
          </div>
          <div class="text-caption text-grey">{{ formatDate(item.earnedAt) }}</div>
        </v-timeline-item>
      </v-timeline>

      <v-btn
        v-if="store.xpHistory.length > 5 && !showAll"
        variant="text"
        size="small"
        color="primary"
        block
        class="mt-2"
        @click="showAll = true"
      >
        Xem thêm {{ store.xpHistory.length - 5 }} sự kiện
      </v-btn>
    </div>

    <div v-else-if="!store.xpLoading" class="text-center text-grey text-caption py-2">
      Chưa có lịch sử nhận XP
    </div>
  </v-card>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useGamificationStore, XP_LEVELS } from '../../stores/gamificationStore'

const store = useGamificationStore()
const showAll = ref(false)

const visibleHistory = computed(() =>
  showAll.value ? store.xpHistory : store.xpHistory.slice(0, 5)
)

// ── Animated XP counter ─────────────────────────────────────────────────
const animatedXP = ref(0)
let rafId = null

function animateTo(target) {
  cancelAnimationFrame(rafId)
  const start = animatedXP.value
  const diff  = target - start
  const duration = 800
  const startTime = performance.now()

  function step(now) {
    const elapsed = now - startTime
    const progress = Math.min(elapsed / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3)   // ease-out cubic
    animatedXP.value = Math.round(start + diff * eased)
    if (progress < 1) rafId = requestAnimationFrame(step)
  }
  rafId = requestAnimationFrame(step)
}

watch(() => store.totalXP, (val) => animateTo(val), { immediate: false })
onMounted(() => { animatedXP.value = store.totalXP })

function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}
</script>

<style scoped>
.xp-card {
  border: 1px solid rgba(226, 232, 240, 0.9) !important;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.07) !important;
}

.level-icon-wrap {
  width: 64px;
  height: 64px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.level-name { font-size: 17px; letter-spacing: -0.02em; }
.xp-num    { font-size: 28px; letter-spacing: -0.04em; }

.xp-bar { transition: all 0.6s ease; }
.xp-bar-label { font-size: 9px; font-weight: 700; color: #fff; }

/* Level road */
.level-road { position: relative; }

.level-node {
  position: relative;
  flex: 1;
  align-items: center;
}

.level-node-dot {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  border: 2px solid rgba(148, 163, 184, 0.3);
  background: rgba(248, 250, 252, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
  transition: all 0.3s ease;
}

.node-active {
  border-width: 2.5px;
  box-shadow: 0 0 0 3px rgba(var(--node-color), 0.2);
  transform: scale(1.15);
}

.node-done { opacity: 0.8; }

.level-node-label {
  font-size: 9px;
  font-weight: 600;
  color: #94a3b8;
  max-width: 52px;
  line-height: 1.2;
}

.level-connector {
  position: absolute;
  top: 16px;
  left: calc(50% + 16px);
  width: calc(100% - 32px);
  height: 2px;
  background: rgba(148, 163, 184, 0.25);
  z-index: 0;
}

.connector-done { background: rgba(22, 163, 74, 0.4); }

.xp-timeline :deep(.v-timeline-item__body) { padding-bottom: 8px; }
</style>
