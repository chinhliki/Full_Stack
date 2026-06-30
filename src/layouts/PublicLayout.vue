<template>
  <div class="dl-page public-shell">
    <!-- Header -->
    <header class="public-header" :class="{ 'is-scrolled': isScrolled }">
      <div class="public-container header-inner d-flex align-center justify-between py-4">
        <router-link to="/" class="brand d-flex align-center ga-2 text-decoration-none">
          <span class="brand-mark d-grid place-items-center bg-primary text-white rounded-lg" style="width: 36px; height: 36px;">
            <v-icon icon="mdi-bookshelf" size="20" />
          </span>
          <span class="brand-text text-h5 font-weight-black text-primary">Thư Viện Số</span>
        </router-link>

        <nav class="desktop-nav d-none d-md-flex align-center ga-6">
          <router-link
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="nav-link text-decoration-none font-weight-bold text-body-2"
            exact-active-class="nav-link-active"
          >
            {{ item.label }}
          </router-link>
        </nav>

        <div class="desktop-actions d-none d-md-flex align-center ga-3">
          <template v-if="auth.isLoggedIn">
            <div class="user-mini text-right mr-2" style="line-height: 1.2;">
              <div class="text-caption font-weight-bold text-secondary">{{ auth.fullName || 'Người dùng' }}</div>
              <div class="text-grey text-caption">{{ displayRole }}</div>
            </div>

            <v-btn
              color="primary"
              variant="flat"
              rounded="xl"
              class="font-weight-bold"
              prepend-icon="mdi-view-dashboard-outline"
              @click="goToApp"
            >
              Vào hệ thống
            </v-btn>

            <v-btn
              variant="tonal"
              color="error"
              rounded="xl"
              icon="mdi-logout"
              size="small"
              @click="logout"
            />
          </template>

          <template v-else>
            <v-btn
              variant="outlined"
              color="primary"
              rounded="xl"
              class="font-weight-bold"
              @click="router.push('/login')"
            >
              Đăng nhập
            </v-btn>

            <v-btn
              color="primary"
              variant="flat"
              rounded="xl"
              class="font-weight-bold"
              @click="router.push('/register')"
            >
              Đăng ký thẻ
            </v-btn>
          </template>
        </div>

        <v-btn
          class="mobile-menu-btn d-inline-flex d-md-none"
          icon="mdi-menu"
          variant="text"
          @click="mobileMenu = !mobileMenu"
        />
      </div>

      <v-expand-transition>
        <div v-if="mobileMenu" class="mobile-menu bg-white border-b pa-4 d-flex flex-column ga-2 d-md-none">
          <router-link
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="mobile-nav-link text-decoration-none text-secondary font-weight-bold py-2 border-b block"
            @click="mobileMenu = false"
          >
            {{ item.label }}
          </router-link>

          <div class="mobile-menu-actions d-flex flex-column ga-2 mt-4">
            <template v-if="auth.isLoggedIn">
              <v-btn block color="primary" rounded="xl" @click="goToApp">
                Vào hệ thống
              </v-btn>
              <v-btn block variant="tonal" color="error" rounded="xl" @click="logout">
                Đăng xuất
              </v-btn>
            </template>

            <template v-else>
              <v-btn block variant="outlined" color="primary" rounded="xl" @click="router.push('/login')">
                Đăng nhập
              </v-btn>
              <v-btn block color="primary" rounded="xl" @click="router.push('/register')">
                Đăng ký thẻ thư viện
              </v-btn>
            </template>
          </div>
        </div>
      </v-expand-transition>
    </header>

    <!-- Main Content -->
    <main class="public-main flex-grow-1">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="public-footer bg-secondary text-white py-12">
      <div class="public-container">
        <v-row class="footer-grid">
          <v-col cols="12" md="6" class="footer-brand pr-md-12">
            <div class="brand-text text-h5 font-weight-black text-warning mb-3">Thư Viện Số</div>
            <p class="text-body-2 text-grey-lighten-1" style="line-height: 1.6;">
              Hệ thống thư viện hiện đại liên chi nhánh, hỗ trợ số hóa tài liệu học thuật toàn diện và tích hợp chuyển đổi số giáo dục tiên tiến.
            </p>
          </v-col>

          <v-col cols="6" md="3" class="footer-col d-flex flex-column ga-2">
            <h3 class="text-subtitle-2 font-weight-bold text-white mb-2">LIÊN KẾT NHANH</h3>
            <router-link to="/" class="text-grey-lighten-1 text-decoration-none text-body-2 hover-underline">Trang chủ</router-link>
            <router-link to="/catalog" class="text-grey-lighten-1 text-decoration-none text-body-2 hover-underline">Danh mục sách</router-link>
            <router-link to="/guide" class="text-grey-lighten-1 text-decoration-none text-body-2 hover-underline">Hướng dẫn &amp; Quy quy chế</router-link>
          </v-col>

          <v-col cols="6" md="3" class="footer-col d-flex flex-column ga-2">
            <h3 class="text-subtitle-2 font-weight-bold text-white mb-2">VỀ CHÚNG TÔI</h3>
            <router-link to="/about" class="text-grey-lighten-1 text-decoration-none text-body-2 hover-underline">Giới thiệu</router-link>
            <router-link to="/contact" class="text-grey-lighten-1 text-decoration-none text-body-2 hover-underline">Liên hệ hỗ trợ</router-link>
          </v-col>
        </v-row>

        <v-divider class="my-6 border-grey-darken-2" />

        <div class="text-center text-caption text-grey-lighten-1">
          © {{ new Date().getFullYear() }} Thư Viện Số. Tất cả quyền được bảo lưu.
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const router = useRouter()
const auth = useAuthStore()

const isScrolled = ref(false)
const mobileMenu = ref(false)

const navItems = [
  { label: 'Trang chủ', to: '/' },
  { label: 'Danh mục sách', to: '/catalog' },
  { label: 'Hướng dẫn & Quy định', to: '/guide' },
  { label: 'Giới thiệu', to: '/about' },
  { label: 'Liên hệ', to: '/contact' }
]

const displayRole = computed(() => {
  if (auth.role === 'Admin') return 'Quản trị'
  if (auth.role === 'Librarian') return 'Thủ thư'
  if (auth.role === 'Reader') return 'Độc giả'
  return auth.role || 'Người dùng'
})

function goToApp() {
  if (['Admin', 'Librarian'].includes(auth.role)) {
    router.push('/app/dashboard')
  } else {
    router.push('/app/books')
  }
}

function logout() {
  auth.logout()
  router.push('/')
}

function handleScroll() {
  isScrolled.value = window.scrollY > 8
}

onMounted(() => window.addEventListener('scroll', handleScroll))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>

<style scoped>
.public-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.public-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}
.public-header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid transparent;
  transition: box-shadow 0.25s ease, border-color 0.25s ease;
}
.public-header.is-scrolled {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  border-color: #eee;
}
.nav-link {
  color: var(--v-theme-secondary);
  transition: color 0.2s ease;
}
.nav-link:hover {
  color: var(--v-theme-primary);
}
.nav-link-active {
  color: var(--v-theme-primary);
}
.hover-underline:hover {
  text-decoration: underline !important;
}
</style>
