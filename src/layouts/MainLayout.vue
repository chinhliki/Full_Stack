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
      <div class="sidebar-brand">
        <div class="sidebar-logo">
          <v-icon icon="mdi-library" size="25" />
        </div>

        <div v-if="!rail" class="sidebar-brand-info">
          <div class="sidebar-title">Library System</div>
          <div class="sidebar-subtitle">Digital Microservices</div>
        </div>
      </div>

      <v-divider class="mx-4 mb-3" color="white" opacity="0.12" />

      <v-list nav density="comfortable">
        <v-tooltip :disabled="!rail" location="right" text="Trang chủ">
          <template #activator="{ props }">
            <v-list-item
              v-bind="props"
              title="Trang chủ"
              prepend-icon="mdi-home"
              to="/"
            />
          </template>
        </v-tooltip>

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

        <v-tooltip :disabled="!rail" location="right" text="Lịch sử mượn" v-if="isReader">
          <template #activator="{ props }">
            <v-list-item
              v-bind="props"
              title="Lịch sử mượn của tôi"
              prepend-icon="mdi-history"
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
        <div class="pa-4" v-if="!rail">
          <v-card class="pa-4" color="rgba(255,255,255,0.08)" rounded="xl">
            <div class="text-caption text-white opacity-70">
              Đăng nhập với vai trò
            </div>

            <div class="text-white font-weight-bold mt-1">
              {{ displayRole }}
            </div>

            <v-btn
              block
              class="mt-4"
              color="red"
              variant="flat"
              prepend-icon="mdi-logout"
              @click="logout"
            >
              Đăng xuất
            </v-btn>
          </v-card>
        </div>
        <div class="pa-2 text-center" v-else>
          <v-tooltip text="Đăng xuất" location="right">
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                icon="mdi-logout"
                color="red"
                variant="tonal"
                size="small"
                @click="logout"
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

      <div>
        <v-app-bar-title class="font-weight-bold">
          Hệ thống quản lý thư viện số
        </v-app-bar-title>

        <div class="text-caption text-grey-darken-1 ml-4">
          ASP.NET Core · VueJS · SQL Server · API Gateway
        </div>
      </div>

      <v-spacer />

      <v-btn
        icon
        variant="text"
        color="secondary"
        class="mr-3 theme-toggle-btn"
        @click="toggleTheme"
      >
        <v-icon :icon="isDark ? 'mdi-sunny' : 'mdi-weather-night'" />
      </v-btn>

      <div class="d-none d-md-flex align-center mr-4">
        <div class="text-right mr-3">
          <div class="font-weight-bold text-secondary">
            {{ auth.fullName || 'Người dùng' }}
          </div>

          <div class="text-caption text-grey-darken-1">
            {{ auth.email }}
          </div>
        </div>

        <div class="role-pill">
          {{ displayRole }}
        </div>
      </div>
    </v-app-bar>

    <v-main>
      <div class="content-shell">
        <router-view v-slot="{ Component }">
          <transition name="fade-slide" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </v-main>
  </v-app>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { useTheme } from 'vuetify'

const drawer = ref(true)
const rail = ref(false)
const router = useRouter()
const auth = useAuthStore()
const theme = useTheme()

const isDark = ref(false)

function initTheme() {
  const saved = localStorage.getItem('theme')
  if (saved) {
    isDark.value = saved === 'dark'
  } else {
    isDark.value = false
  }
  applyTheme()
}

function toggleTheme() {
  isDark.value = !isDark.value
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  applyTheme()
}

function applyTheme() {
  document.body.classList.toggle('dark-theme', isDark.value)
  theme.global.name.value = isDark.value ? 'libraryDarkTheme' : 'libraryTheme'
}

onMounted(initTheme)

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