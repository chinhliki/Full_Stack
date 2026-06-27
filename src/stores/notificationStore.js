import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { notificationApi } from '../api/notificationApi'

// Icon + color per notification type — mirrors backend enum
export const NOTIFICATION_TYPE = {
  DueSoon:          { icon: 'mdi-clock-alert-outline', color: 'warning',   label: 'Sắp hết hạn'      },
  BorrowApproved:   { icon: 'mdi-check-circle-outline', color: 'success',  label: 'Đơn được duyệt'   },
  FineAdded:        { icon: 'mdi-cash-alert',           color: 'error',    label: 'Phí phạt mới'     },
  ReservationReady: { icon: 'mdi-bookmark-check',       color: 'info',     label: 'Đặt chỗ sẵn sàng' },
  ReturnReminder:   { icon: 'mdi-calendar-clock',       color: 'warning',  label: 'Nhắc trả sách'    },
  General:          { icon: 'mdi-bell-outline',         color: 'secondary', label: 'Thông báo'       }
}

export const useNotificationStore = defineStore('notifications', () => {
  const notifications = ref([])
  const loading = ref(false)
  const connected = ref(false)
  // Snackbar queue for real-time incoming notifications
  const snackQueue = ref([])

  // ── Getters ────────────────────────────────────────────────────
  const unreadCount = computed(() =>
    notifications.value.filter(n => !n.isRead).length
  )

  const hasUnread = computed(() => unreadCount.value > 0)

  function typeConfig(type) {
    return NOTIFICATION_TYPE[type] ?? NOTIFICATION_TYPE.General
  }

  // ── Actions ────────────────────────────────────────────────────
  async function fetchNotifications() {
    loading.value = true
    try {
      const res = await notificationApi.getAll()
      const raw = Array.isArray(res.data) ? res.data : (res.data?.items ?? [])
      notifications.value = raw
    } catch (err) {
      console.warn('[Notifications] fetch failed:', err?.response?.status ?? err.message)
    } finally {
      loading.value = false
    }
  }

  // Called by SignalR handler when a push arrives
  function addNotification(notification) {
    // Prevent duplicates by id
    if (notifications.value.some(n => n.id === notification.id)) return

    notifications.value.unshift({ ...notification, isRead: false })

    // Push to snackbar queue so UI can show a toast
    snackQueue.value.push({
      id: notification.id,
      title: notification.title,
      message: notification.message,
      type: notification.type,
      show: true
    })
  }

  async function markAsRead(id) {
    const n = notifications.value.find(n => n.id === id)
    if (!n || n.isRead) return
    n.isRead = true                        // optimistic update
    try {
      await notificationApi.markAsRead(id)
    } catch {
      n.isRead = false                     // rollback on failure
    }
  }

  async function markAllAsRead() {
    const unread = notifications.value.filter(n => !n.isRead)
    unread.forEach(n => { n.isRead = true })
    try {
      await notificationApi.markAllAsRead()
    } catch {
      unread.forEach(n => { n.isRead = false })
    }
  }

  function removeFromSnackQueue(id) {
    snackQueue.value = snackQueue.value.filter(s => s.id !== id)
  }

  function setConnected(val) {
    connected.value = val
  }

  function reset() {
    notifications.value = []
    snackQueue.value = []
    connected.value = false
  }

  return {
    notifications,
    loading,
    connected,
    snackQueue,
    unreadCount,
    hasUnread,
    typeConfig,
    fetchNotifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeFromSnackQueue,
    setConnected,
    reset
  }
})
