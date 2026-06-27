<template>
  <!-- ── Bell button ──────────────────────────────────────────── -->
  <v-menu
    v-model="menuOpen"
    :close-on-content-click="false"
    location="bottom end"
    offset="8"
    max-width="400"
    min-width="360"
  >
    <template #activator="{ props: menu }">
      <v-btn
        v-bind="menu"
        icon
        variant="text"
        class="notif-bell-btn mr-1"
        :class="{ 'bell-ringing': store.hasUnread }"
        aria-label="Thông báo"
      >
        <v-badge
          :content="store.unreadCount > 99 ? '99+' : store.unreadCount"
          :model-value="store.hasUnread"
          color="error"
          offset-x="2"
          offset-y="2"
        >
          <v-icon
            :icon="store.hasUnread ? 'mdi-bell-badge' : 'mdi-bell-outline'"
            size="22"
          />
        </v-badge>
      </v-btn>
    </template>

    <!-- ── Dropdown panel ────────────────────────────────────── -->
    <v-card class="notif-panel" rounded="xl" elevation="12">
      <!-- Header -->
      <div class="notif-header d-flex align-center px-4 py-3">
        <v-icon icon="mdi-bell" color="primary" size="20" class="mr-2" />
        <span class="font-weight-black text-subtitle-1">Thông báo</span>

        <v-chip
          v-if="store.hasUnread"
          size="x-small"
          color="error"
          variant="tonal"
          class="ml-2"
        >
          {{ store.unreadCount }} chưa đọc
        </v-chip>

        <v-spacer />

        <!-- Connection indicator -->
        <v-tooltip :text="store.connected ? 'Kết nối real-time' : 'Đang dùng polling'"  location="bottom">
          <template #activator="{ props: tip }">
            <v-icon
              v-bind="tip"
              :icon="store.connected ? 'mdi-wifi' : 'mdi-wifi-off'"
              :color="store.connected ? 'success' : 'warning'"
              size="16"
              class="mr-2"
            />
          </template>
        </v-tooltip>

        <v-btn
          v-if="store.hasUnread"
          variant="text"
          size="x-small"
          color="primary"
          class="text-caption"
          :loading="markingAll"
          @click="markAllRead"
        >
          Đọc tất cả
        </v-btn>

        <v-btn
          icon="mdi-refresh"
          size="x-small"
          variant="text"
          :loading="store.loading"
          class="ml-1"
          @click="store.fetchNotifications()"
        />
      </div>

      <v-divider />

      <!-- List -->
      <div class="notif-scroll">
        <!-- Loading skeleton -->
        <div v-if="store.loading && store.notifications.length === 0" class="pa-4">
          <v-skeleton-loader v-for="i in 4" :key="i" type="list-item-two-line" class="mb-2" />
        </div>

        <!-- Empty state -->
        <div
          v-else-if="store.notifications.length === 0"
          class="empty-notif d-flex flex-column align-center justify-center pa-8"
        >
          <v-icon icon="mdi-bell-sleep-outline" size="52" color="grey-lighten-1" />
          <div class="text-subtitle-2 font-weight-bold mt-3 text-grey">Không có thông báo</div>
          <div class="text-caption text-grey mt-1">Mọi hoạt động liên quan đến tài khoản sẽ hiển thị ở đây</div>
        </div>

        <!-- Notification items -->
        <v-list v-else nav density="compact" class="pa-2">
          <v-list-item
            v-for="n in store.notifications"
            :key="n.id"
            :class="['notif-item mb-1', { 'notif-unread': !n.isRead }]"
            rounded="lg"
            @click="handleItemClick(n)"
          >
            <!-- Icon -->
            <template #prepend>
              <div
                class="notif-icon-wrap mr-3"
                :class="`notif-icon-${store.typeConfig(n.type).color}`"
              >
                <v-icon
                  :icon="store.typeConfig(n.type).icon"
                  :color="store.typeConfig(n.type).color"
                  size="18"
                />
              </div>
            </template>

            <!-- Content -->
            <v-list-item-title
              class="text-body-2 font-weight-bold text-truncate"
              :class="{ 'text-grey-darken-2': n.isRead }"
            >
              {{ n.title }}
            </v-list-item-title>

            <v-list-item-subtitle class="text-caption mt-0-5 notif-msg">
              {{ n.message }}
            </v-list-item-subtitle>

            <v-list-item-subtitle class="text-caption text-grey mt-1">
              {{ relativeTime(n.createdAt) }}
            </v-list-item-subtitle>

            <!-- Unread dot -->
            <template #append>
              <div v-if="!n.isRead" class="unread-dot" />
            </template>
          </v-list-item>
        </v-list>
      </div>

      <!-- Footer -->
      <v-divider />
      <div class="pa-2 text-center">
        <v-btn
          variant="text"
          size="small"
          color="primary"
          block
          rounded="lg"
          @click="menuOpen = false"
        >
          Đóng
        </v-btn>
      </div>
    </v-card>
  </v-menu>

  <!-- ── Real-time snackbar toasts ──────────────────────────── -->
  <template v-for="snack in store.snackQueue" :key="snack.id">
    <v-snackbar
      v-model="snack.show"
      location="bottom right"
      :timeout="5000"
      :color="store.typeConfig(snack.type).color"
      rounded="lg"
      max-width="380"
      elevation="8"
      @update:model-value="(v) => !v && store.removeFromSnackQueue(snack.id)"
    >
      <div class="d-flex align-center ga-3">
        <v-icon :icon="store.typeConfig(snack.type).icon" size="20" />
        <div>
          <div class="font-weight-bold text-body-2">{{ snack.title }}</div>
          <div class="text-caption">{{ snack.message }}</div>
        </div>
      </div>

      <template #actions>
        <v-btn
          size="x-small"
          variant="text"
          icon="mdi-close"
          @click="store.removeFromSnackQueue(snack.id)"
        />
      </template>
    </v-snackbar>
  </template>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useNotificationStore } from '../stores/notificationStore'

const store = useNotificationStore()
const router = useRouter()

const menuOpen = ref(false)
const markingAll = ref(false)

async function markAllRead() {
  markingAll.value = true
  try { await store.markAllAsRead() } finally { markingAll.value = false }
}

async function handleItemClick(notification) {
  await store.markAsRead(notification.id)

  // Navigate to the relevant page if a URL is attached
  if (notification.relatedUrl) {
    menuOpen.value = false
    router.push(notification.relatedUrl)
  }
}

// ── Relative time ─────────────────────────────────────────────
function relativeTime(iso) {
  if (!iso) return ''
  const diffMs = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diffMs / 60_000)
  if (mins < 1) return 'Vừa xong'
  if (mins < 60) return `${mins} phút trước`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs} giờ trước`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days} ngày trước`
  return new Date(iso).toLocaleDateString('vi-VN')
}
</script>

<style scoped>
/* Bell ring animation when there are unread notifications */
.bell-ringing :deep(.v-icon) {
  animation: bell-shake 2.5s ease-in-out infinite;
  transform-origin: top center;
}

@keyframes bell-shake {
  0%, 85%, 100% { transform: rotate(0deg); }
  88%           { transform: rotate(12deg); }
  92%           { transform: rotate(-10deg); }
  96%           { transform: rotate(8deg); }
}

/* Panel */
.notif-panel {
  border: 1px solid rgba(226, 232, 240, 0.9) !important;
  overflow: hidden;
}

.notif-header {
  background: linear-gradient(135deg, #EEF2FF, #F5F3FF);
}

.notif-scroll {
  max-height: 440px;
  overflow-y: auto;
  overflow-x: hidden;
}

.notif-scroll::-webkit-scrollbar { width: 4px; }
.notif-scroll::-webkit-scrollbar-track { background: transparent; }
.notif-scroll::-webkit-scrollbar-thumb { background: rgba(148, 163, 184, 0.4); border-radius: 4px; }

/* Items */
.notif-item {
  transition: background 0.2s ease;
  cursor: pointer;
}

.notif-unread {
  background: rgba(238, 242, 255, 0.7) !important;
}

.notif-msg {
  white-space: normal !important;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Notification type icon wrapper */
.notif-icon-wrap {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.notif-icon-warning  { background: rgba(245, 158, 11, 0.12); }
.notif-icon-success  { background: rgba(20, 184, 166, 0.12); }
.notif-icon-error    { background: rgba(239, 68, 68, 0.12); }
.notif-icon-info     { background: rgba(6, 182, 212, 0.12); }
.notif-icon-secondary { background: rgba(100, 116, 139, 0.12); }

/* Unread dot */
.unread-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #6366f1;
  flex-shrink: 0;
}

.empty-notif { min-height: 200px; }
</style>
