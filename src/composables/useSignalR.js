import { watch, onUnmounted } from 'vue'
import * as signalR from '@microsoft/signalr'
import { useNotificationStore } from '../stores/notificationStore'
import { useAuthStore } from '../stores/authStore'

const HUB_URL = `${import.meta.env.VITE_API_BASE_URL}/hubs/notifications`
// How often to poll notifications when SignalR is unavailable (ms)
const POLL_INTERVAL_MS = 60_000

let connection = null
let pollTimer = null

// ── Connection factory ─────────────────────────────────────────────────────
function buildConnection() {
  return new signalR.HubConnectionBuilder()
    .withUrl(HUB_URL, {
      accessTokenFactory: () => localStorage.getItem('accessToken') ?? ''
    })
    .withAutomaticReconnect([0, 2000, 5000, 10_000, 30_000])
    .configureLogging(signalR.LogLevel.Warning)
    .build()
}

// ── Start / Stop ────────────────────────────────────────────────────────────
async function startConnection(store) {
  if (connection?.state === signalR.HubConnectionState.Connected) return

  connection = buildConnection()

  // ── Hub events ──
  // Backend calls: await Clients.User(userId).SendAsync("ReceiveNotification", notification)
  connection.on('ReceiveNotification', (notification) => {
    store.addNotification(notification)
  })

  connection.onreconnecting(() => {
    console.info('[SignalR] Reconnecting…')
    store.setConnected(false)
    startPolling(store)          // poll while reconnecting
  })

  connection.onreconnected(() => {
    console.info('[SignalR] Reconnected.')
    store.setConnected(true)
    stopPolling()
    store.fetchNotifications()   // catch up on missed
  })

  connection.onclose(() => {
    console.info('[SignalR] Connection closed.')
    store.setConnected(false)
    startPolling(store)          // fallback to polling
  })

  try {
    await connection.start()
    store.setConnected(true)
    stopPolling()
    console.info('[SignalR] Connected to', HUB_URL)
  } catch (err) {
    console.warn('[SignalR] Failed to connect — using HTTP polling fallback.', err.message)
    store.setConnected(false)
    startPolling(store)
  }
}

async function stopConnection(store) {
  stopPolling()
  if (connection) {
    try { await connection.stop() } catch { /* ignore */ }
    connection = null
  }
  store.setConnected(false)
}

// ── HTTP polling fallback ───────────────────────────────────────────────────
function startPolling(store) {
  if (pollTimer) return
  store.fetchNotifications()
  pollTimer = setInterval(() => store.fetchNotifications(), POLL_INTERVAL_MS)
}

function stopPolling() {
  if (pollTimer) {
    clearInterval(pollTimer)
    pollTimer = null
  }
}

// ── Vue composable ──────────────────────────────────────────────────────────
export function useSignalR() {
  const auth = useAuthStore()
  const store = useNotificationStore()

  // Connect when user logs in, disconnect on logout
  const stopWatch = watch(
    () => auth.isLoggedIn,
    async (loggedIn) => {
      if (loggedIn) {
        await store.fetchNotifications()
        await startConnection(store)
      } else {
        await stopConnection(store)
        store.reset()
      }
    },
    { immediate: true }
  )

  onUnmounted(async () => {
    stopWatch()
    await stopConnection(store)
  })

  return { connected: () => store.connected }
}
