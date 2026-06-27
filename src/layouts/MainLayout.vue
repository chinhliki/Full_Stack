<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      :rail="rail"
      permanent
      width="292"
      rail-width="78"
      class="professional-drawer"
      :class="{ 'drawer-expanded': !rail }"
    >
      <div class="sidebar-brand d-flex align-center justify-space-between">
        <div class="d-flex align-center ga-3">
          <div class="sidebar-logo">
            <v-icon icon="mdi-library" size="25" />
          </div>

          <div v-if="!rail" class="sidebar-brand-info">
            <div class="sidebar-title">Library System</div>
            <div class="sidebar-subtitle">Digital Microservices</div>
          </div>
        </div>

        <v-tooltip text="Trang chủ" location="bottom" v-if="!rail">
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              icon="mdi-home"
              size="32"
              variant="text"
              class="sidebar-home-btn text-white"
              @click="router.push('/')"
            />
          </template>
        </v-tooltip>
      </div>

      <v-divider class="mx-4 mb-3" opacity="0.18" />

      <v-list nav density="comfortable">
        <v-tooltip :disabled="!rail" location="right" text="Dashboard" v-if="isAdminOrLibrarian">
          <template #activator="{ props }">
            <v-list-item
              v-bind="props"
              title="Dashboard"
              prepend-icon="mdi-view-dashboard"
              to="/app/dashboard"
            />
          </template>
        </v-tooltip>

        <v-tooltip :disabled="!rail" location="right" text="Quản lý sách">
          <template #activator="{ props }">
            <v-list-item
              v-bind="props"
              title="Quản lý sách"
              prepend-icon="mdi-book-open-page-variant"
              to="/app/books"
            />
          </template>
        </v-tooltip>

        <v-tooltip :disabled="!rail" location="right" text="Phiếu mượn của tôi" v-if="isReader">
          <template #activator="{ props }">
            <v-list-item
              v-bind="props"
              title="Phiếu mượn của tôi"
              prepend-icon="mdi-clipboard-text"
              to="/app/my-borrows"
            />
          </template>
        </v-tooltip>

        <v-tooltip :disabled="!rail" location="right" text="Thẻ thư viện" v-if="isReader">
          <template #activator="{ props }">
            <v-list-item
              v-bind="props"
              title="Thẻ thư viện của tôi"
              prepend-icon="mdi-card-account-details"
              to="/app/my-card"
            />
          </template>
        </v-tooltip>

        <v-tooltip :disabled="!rail" location="right" text="Thành tích & XP" v-if="isReader">
          <template #activator="{ props }">
            <v-list-item
              v-bind="props"
              title="Thành tích của tôi"
              prepend-icon="mdi-trophy-outline"
              to="/app/gamification"
            />
          </template>
        </v-tooltip>

        <v-tooltip :disabled="!rail" location="right" text="Quản lý độc giả" v-if="isAdminOrLibrarian">
          <template #activator="{ props }">
            <v-list-item
              v-bind="props"
              title="Quản lý độc giả"
              prepend-icon="mdi-account-group"
              to="/app/readers"
            />
          </template>
        </v-tooltip>

        <v-tooltip :disabled="!rail" location="right" text="Phiếu mượn" v-if="isAdminOrLibrarian">
          <template #activator="{ props }">
            <v-list-item
              v-bind="props"
              title="Phiếu mượn"
              prepend-icon="mdi-clipboard-text"
              to="/app/borrows"
            />
          </template>
        </v-tooltip>

        <v-tooltip :disabled="!rail" location="right" text="Sách quá hạn" v-if="isAdminOrLibrarian">
          <template #activator="{ props }">
            <v-list-item
              v-bind="props"
              title="Sách quá hạn"
              prepend-icon="mdi-alert-circle"
              to="/app/overdue"
            />
          </template>
        </v-tooltip>

        <v-tooltip :disabled="!rail" location="right" text="Công nợ phí phạt" v-if="isAdminOrLibrarian">
          <template #activator="{ props }">
            <v-list-item
              v-bind="props"
              title="Công nợ phí phạt"
              prepend-icon="mdi-cash-multiple"
              to="/app/fines"
            />
          </template>
        </v-tooltip>
      </v-list>

      <template #append>
        <!-- Expanded Sidebar Profile -->
        <div class="pa-4" v-if="!rail">
          <div class="sidebar-profile-row d-flex align-center">
            <v-tooltip location="top" offset="10">
              <template #activator="{ props }">
                <div
                  v-bind="props"
                  class="sidebar-profile-card d-flex align-center pa-3 flex-grow-1 mr-2"
                >
                  <!-- Avatar -->
                  <v-avatar size="42" color="rgba(168, 85, 247, 0.25)" class="sidebar-profile-avatar mr-3">
                    <v-img v-if="auth.user?.avatarUrl" :src="auth.user.avatarUrl" />
                    <v-icon v-else icon="mdi-account" color="white" />
                  </v-avatar>
                  <!-- Name & Role -->
                  <div class="sidebar-profile-details overflow-hidden">
                    <transition name="fade-role" mode="out-in">
                      <div :key="auth.role">
                        <div class="sidebar-profile-name font-weight-bold text-truncate">
                          {{ auth.fullName || 'Người dùng' }}
                        </div>
                        <div class="sidebar-profile-role-badge-wrapper mt-1">
                          <span class="sidebar-profile-role-badge">
                            {{ displayRole }}
                          </span>
                        </div>
                      </div>
                    </transition>
                  </div>
                </div>
              </template>
              <!-- Tooltip details -->
              <div class="pa-1 text-center">
                <div class="font-weight-bold">Thông tin tài khoản</div>
                <div class="text-caption text-grey-lighten-2">{{ auth.fullName }}</div>
                <div class="text-caption text-grey-lighten-2">Vai trò: {{ displayRole }}</div>
                <div class="text-caption text-grey-lighten-3" v-if="auth.user?.email">{{ auth.user.email }}</div>
              </div>
            </v-tooltip>

            <!-- Small Logout Icon Button -->
            <v-tooltip text="Đăng xuất" location="top">
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon="mdi-logout"
                  variant="outlined"
                  size="40"
                  class="sidebar-profile-logout-btn"
                  @click="logout"
                />
              </template>
            </v-tooltip>
          </div>
        </div>

        <!-- Collapsed Sidebar Profile -->
        <div class="pa-2 text-center d-flex flex-column align-center" v-else>
          <v-tooltip location="right" offset="15">
            <template #activator="{ props }">
              <div v-bind="props" class="sidebar-profile-avatar-collapsed mb-3">
                <v-avatar size="40" color="rgba(168, 85, 247, 0.25)" class="sidebar-profile-avatar cursor-pointer">
                  <v-img v-if="auth.user?.avatarUrl" :src="auth.user.avatarUrl" />
                  <v-icon v-else icon="mdi-account" color="white" />
                </v-avatar>
              </div>
            </template>
            <div class="pa-1">
              <div class="font-weight-bold">{{ auth.fullName || 'Người dùng' }}</div>
              <div class="text-caption text-grey-lighten-2">{{ displayRole }}</div>
              <div class="text-caption text-grey-lighten-3" v-if="auth.user?.email">{{ auth.user.email }}</div>
            </div>
          </v-tooltip>

          <v-tooltip text="Đăng xuất" location="right">
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                icon="mdi-logout"
                color="red"
                variant="tonal"
                size="small"
                @click="logout"
                class="logout-btn-collapsed"
              />
            </template>
          </v-tooltip>
        </div>
      </template>
    </v-navigation-drawer>

    <v-app-bar
      flat
      height="72"
      class="top-app-bar"
    >
      <v-app-bar-nav-icon @click="rail = !rail" />

      <div class="ml-4">
        <div class="font-weight-bold text-subtitle-1 app-bar-title-text">
          Hệ thống quản lý thư viện số
        </div>
        <div class="text-caption text-grey-darken-1">
          ASP.NET Core · VueJS · SQL Server · API Gateway
        </div>
      </div>

      <v-spacer />

      <!-- Notification Bell (visible for all logged-in users) -->
      <NotificationBell class="mr-1" />

      <v-btn
        icon
        variant="text"
        color="secondary"
        class="mr-3 theme-toggle-btn"
        @click="toggleTheme"
      >
        <v-icon :icon="isDark ? 'mdi-weather-sunny' : 'mdi-weather-night'" />
      </v-btn>
    </v-app-bar>

    <v-main>
      <div class="content-shell">
        <router-view v-slot="{ Component }">
          <transition name="slide-page" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </v-main>
  </v-app>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { useTheme } from 'vuetify'
import { useSignalR } from '../composables/useSignalR'
import NotificationBell from '../components/NotificationBell.vue'

// Manages SignalR lifecycle: auto-connect on login, disconnect on logout
useSignalR()

const drawer = ref(true)
const rail = ref(false)
const router = useRouter()
const auth = useAuthStore()
const theme = useTheme()

const isDark = computed({
  get: () => theme.global.name.value === 'libraryDarkTheme',
  set: (val) => {
    theme.global.name.value = val ? 'libraryDarkTheme' : 'libraryTheme'
    document.body.classList.toggle('dark-theme', val)
    localStorage.setItem('theme', val ? 'dark' : 'light')
  }
})

function toggleTheme() {
  isDark.value = !isDark.value
}

const isAdminOrLibrarian = computed(() =>
  ['Admin', 'Librarian'].includes(auth.role)
)

const isReader = computed(() =>
  auth.role === 'Reader'
)

const displayRole = computed(() => {
  if (auth.role === 'Admin') return 'Quản trị viên'
  if (auth.role === 'Librarian') return 'Thủ thư'
  if (auth.role === 'Reader') return 'Độc giả'
  return auth.role || 'Người dùng'
})

function logout() {
  auth.logout()
  router.push('/')
}
</script>