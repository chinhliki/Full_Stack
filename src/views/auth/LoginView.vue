<template>
  <v-app>
    <v-main>
      <div class="login-page">
        <!-- Interactive loading bar at the very top -->
        <div class="loading-bar-wrapper" v-if="loading">
          <div class="loading-bar-inner"></div>
        </div>

        <main class="login-shell">
          <!-- Left: Form Section -->
          <section class="login-form-section">
            <!-- Subtle floating decorative book icons -->
            <div class="bg-floating-icon icon-left-1">
              <v-icon icon="mdi-book-open-page-variant-outline" size="20" />
            </div>
            <div class="bg-floating-icon icon-left-2">
              <v-icon icon="mdi-lightbulb-on-outline" size="20" />
            </div>
            <div class="bg-floating-icon icon-left-3">
              <v-icon icon="mdi-pencil-outline" size="18" />
            </div>
            <div class="bg-floating-icon icon-left-4">
              <v-icon icon="mdi-cloud-sync-outline" size="22" />
            </div>
            <div class="bg-floating-icon icon-left-5">
              <v-icon icon="mdi-database-outline" size="18" />
            </div>
            <div class="bg-floating-icon icon-left-6">
              <v-icon icon="mdi-brain" size="20" />
            </div>
            <div class="bg-floating-icon icon-left-7">
              <v-icon icon="mdi-bookmark-outline" size="18" />
            </div>
            <div class="bg-floating-icon icon-left-8">
              <v-icon icon="mdi-school-outline" size="20" />
            </div>
            
            <div class="login-form-wrapper">
              
              <!-- Brand Header with Premium Floating Icon -->
              <router-link to="/" class="login-brand animate-fade-in">
                <div class="login-brand-icon">
                  <v-icon icon="mdi-library" size="24" color="white" class="rotating-icon" />
                </div>
                <div class="brand-info">
                  <span class="brand-text font-weight-black">Thư viện Số</span>
                  <span class="brand-tagline">Học tập không giới hạn</span>
                </div>
              </router-link>

              <!-- Dynamic greeting based on time of day with custom animations -->
              <div class="login-heading animate-fade-in delay-1">
                <h1 class="greeting-title">{{ greetingTitle }}</h1>
                <p class="greeting-subtitle">{{ greetingSubtitle }}</p>
              </div>

              <!-- Sleek Error Alert with Auto-Slide-In -->
              <transition name="slide-up">
                <v-alert
                  v-if="error"
                  type="error"
                  variant="tonal"
                  density="comfortable"
                  rounded="xl"
                  class="mb-6 elegant-alert"
                  closable
                  @click:close="error = ''"
                >
                  <template v-slot:prepend>
                    <v-icon icon="mdi-alert-circle-outline" class="error-pulse" />
                  </template>
                  {{ error }}
                </v-alert>
              </transition>

              <!-- Interactive Form -->
              <form class="login-form animate-fade-in delay-2" @submit.prevent="handleLogin">
                <div class="input-group">
                  <span class="input-label">Tài khoản Email</span>
                  <v-text-field
                    v-model="email"
                    type="email"
                    prepend-inner-icon="mdi-email-fast-outline"
                    placeholder="example@library.com"
                    autocomplete="email"
                    :disabled="loading"
                    variant="outlined"
                    density="comfortable"
                    rounded="lg"
                    hide-details="auto"
                    class="custom-input"
                  />
                  <span class="input-hint">Email đăng nhập do thư viện số cấp cho bạn</span>
                </div>

                <div class="input-group">
                  <span class="input-label">Mật khẩu bảo mật</span>
                  <v-text-field
                    v-model="password"
                    :type="showPassword ? 'text' : 'password'"
                    prepend-inner-icon="mdi-shield-key-outline"
                    :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                    placeholder="••••••••"
                    autocomplete="current-password"
                    :disabled="loading"
                    variant="outlined"
                    density="comfortable"
                    rounded="lg"
                    hide-details="auto"
                    class="custom-input"
                    @click:append-inner="showPassword = !showPassword"
                    @keyup.enter="handleLogin"
                  />
                </div>

                <!-- Custom Remember Me and Link options -->
                <div class="login-options">
                  <v-checkbox
                    v-model="rememberMe"
                    label="Ghi nhớ tài khoản"
                    density="compact"
                    hide-details
                    color="primary"
                    class="remember-checkbox"
                  />

                  <button
                    type="button"
                    class="forgot-link"
                    @click="showForgotMessage"
                  >
                    Quên mật khẩu?
                  </button>
                </div>

                <!-- Premium Shimmer Submit Button -->
                <v-btn
                  type="submit"
                  color="primary"
                  size="large"
                  block
                  rounded="lg"
                  prepend-icon="mdi-arrow-right-circle"
                  :loading="loading"
                  class="submit-btn elevation-0"
                >
                  Vào hệ thống
                </v-btn>

                <div class="divider">
                  <span>Hoặc liên kết nhanh</span>
                </div>

                <!-- Premium Google Login button with interactive hover background -->
                <v-btn
                  type="button"
                  variant="outlined"
                  size="large"
                  block
                  rounded="lg"
                  class="google-btn"
                  @click="showGoogleMessage"
                >
                  <span class="google-icon">
                    <svg viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                  </span>
                  Đăng nhập bằng Google
                </v-btn>
              </form>

              <!-- Register link with dynamic underline and custom label -->
              <p class="register-text animate-fade-in delay-3">
                Chưa có tài khoản độc giả?
                <router-link to="/register" class="register-link">Đăng ký thành viên</router-link>
              </p>

              <!-- Return back-to-home navigation with sliding arrow -->
              <div class="back-home animate-fade-in delay-3">
                <router-link to="/" class="back-link">
                  <v-icon icon="mdi-arrow-left" size="18" class="back-icon" />
                  Quay về trang chủ thư viện
                </router-link>
              </div>

              <!-- Left Side Bottom Security Badges -->
              <div class="form-footer animate-fade-in delay-3">
                <span>Phiên bản v2.1.0-Premium</span>
                <span class="dot">•</span>
                <span>Bảo mật bởi SSL 256-bit</span>
              </div>
            </div>
          </section>

          <!-- Right: Visual Section with Futuristic Glowing Book SVG & Interactive Particles -->
          <section class="login-visual-section">
            <!-- Subtle floating decorative book icons -->
            <div class="bg-floating-icon icon-right-1">
              <v-icon icon="mdi-book-open-variant" size="20" />
            </div>
            <div class="bg-floating-icon icon-right-2">
              <v-icon icon="mdi-brain" size="18" />
            </div>
            <div class="bg-floating-icon icon-right-3">
              <v-icon icon="mdi-cpu-32-bit" size="16" />
            </div>
            <div class="bg-floating-icon icon-right-4">
              <v-icon icon="mdi-certificate-outline" size="18" />
            </div>
            <div class="bg-floating-icon icon-right-5">
              <v-icon icon="mdi-library-outline" size="20" />
            </div>
            
            <div class="gradient-overlay"></div>
            <div class="visual-grid"></div>
            <div class="glow-orb orb-primary"></div>
            <div class="glow-orb orb-accent"></div>
            <div class="glow-orb orb-purple"></div>

            <!-- Floating Tech Icons (AI Chip, Cloud Data, Open Book) & Glow blocks -->
            <div class="floating-tech-icons">
              <div class="tech-icon-item icon-book">
                <v-icon icon="mdi-book-open-page-variant-outline" size="24" color="cyan-lighten-2" />
              </div>
              <div class="tech-icon-item icon-cloud">
                <v-icon icon="mdi-cloud-sync-outline" size="24" color="blue-lighten-2" />
              </div>
              <div class="tech-icon-item icon-chip">
                <v-icon icon="mdi-cpu-32-bit" size="24" color="purple-lighten-2" />
              </div>
              <div class="tech-icon-item icon-database">
                <v-icon icon="mdi-database-outline" size="22" color="cyan-lighten-2" />
              </div>
            </div>

            <!-- Custom Interactive Futuristic Floating Library SVG Illustration -->
            <div class="illustration-container animate-fade-in">
              <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" class="futuristic-svg">
                <!-- SVG gradients definition -->
                <defs>
                  <linearGradient id="bookGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#2563EB" />
                    <stop offset="50%" stop-color="#3B82F6" />
                    <stop offset="100%" stop-color="#06B6D4" />
                  </linearGradient>
                  <linearGradient id="glowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#06B6D4" stop-opacity="0.8" />
                    <stop offset="100%" stop-color="#2563EB" stop-opacity="0" />
                  </linearGradient>
                  <linearGradient id="circuitGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.05" />
                    <stop offset="50%" stop-color="#06b6d4" stop-opacity="0.35" />
                    <stop offset="100%" stop-color="#3b82f6" stop-opacity="0.05" />
                  </linearGradient>
                </defs>
                
                <!-- Rotating grid orbits representing connection nodes -->
                <circle cx="200" cy="200" r="160" stroke="url(#circuitGrad)" stroke-width="1.5" stroke-dasharray="12 6" class="rotator-ring-slow" />
                <circle cx="200" cy="200" r="120" stroke="url(#circuitGrad)" stroke-width="1" stroke-dasharray="6 6" class="rotator-ring-fast" />

                <!-- Floating Holographic Digital Book stacked on an advanced interface pedestal -->
                <g class="floating-book-group">
                  <!-- Book cover base shadow -->
                  <path d="M 120 250 L 200 285 L 280 250 L 200 220 Z" fill="rgba(37, 99, 235, 0.15)" filter="blur(8px)" />

                  <!-- Digital Open Book Structure -->
                  <!-- Left Cover Backing -->
                  <path d="M 120 240 L 200 275 L 280 240 L 280 245 L 200 280 L 120 245 Z" fill="#1E293B" stroke="#334155" stroke-width="1.5" />
                  
                  <!-- Left Page Body -->
                  <path d="M 200 270 C 160 255 140 255 115 235 L 115 175 C 140 195 160 195 200 210 Z" fill="#0F172A" stroke="url(#bookGrad)" stroke-width="2.5" />
                  
                  <!-- Right Page Body -->
                  <path d="M 200 210 C 240 195 260 195 285 175 L 285 235 C 260 255 240 255 200 270 Z" fill="#0F172A" stroke="url(#bookGrad)" stroke-width="2.5" />
                  
                  <!-- Holographic code lines on left page -->
                  <path d="M 130 195 Q 160 210 185 220" stroke="rgba(6, 182, 212, 0.4)" stroke-width="2" stroke-linecap="round" />
                  <path d="M 130 207 Q 160 222 185 232" stroke="rgba(37, 99, 235, 0.4)" stroke-width="2" stroke-linecap="round" />
                  <path d="M 130 219 Q 160 234 185 244" stroke="rgba(6, 182, 212, 0.4)" stroke-width="2" stroke-linecap="round" />

                  <!-- Holographic charts on right page -->
                  <path d="M 215 228 Q 240 218 270 198" stroke="rgba(6, 182, 212, 0.4)" stroke-width="2" stroke-linecap="round" />
                  <path d="M 215 240 Q 240 230 270 210" stroke="rgba(37, 99, 235, 0.4)" stroke-width="2" stroke-linecap="round" />
                  <circle cx="230" cy="225" r="4" fill="#06B6D4" />
                  <circle cx="255" cy="215" r="3" fill="#2563EB" />

                  <!-- Glowing digital book spine -->
                  <line x1="200" y1="210" x2="200" y2="270" stroke="#06B6D4" stroke-width="3" stroke-linecap="round" class="spine-glow" />

                  <!-- Glowing holographic beam rising from central spine -->
                  <path d="M 200 210 L 160 40 L 240 40 Z" fill="url(#glowGrad)" style="mix-blend-mode: screen;" class="glow-beam" />
                </g>

                <!-- Floating Interactive Particles (Triangles & Circles of knowledge) -->
                <g class="particle-group">
                  <circle cx="150" cy="130" r="3" fill="#06B6D4" class="particle p-1" />
                  <circle cx="250" cy="120" r="4" fill="#2563EB" class="particle p-2" />
                  <circle cx="200" cy="90" r="3" fill="#3B82F6" class="particle p-3" />
                  <rect x="180" y="110" width="4" height="4" rx="1" fill="#10B981" class="particle p-4" />
                  <circle cx="220" cy="70" r="5" fill="#06B6D4" class="particle p-5" />
                  <polygon points="170,80 174,86 166,86" fill="#3B82F6" class="particle p-6" />
                </g>

                <!-- Small Orbiting Mini books -->
                <g class="mini-elements">
                  <rect x="65" y="140" width="16" height="24" rx="3" transform="rotate(-15 65 140)" fill="url(#bookGrad)" opacity="0.6" class="mini-book-1" />
                  <rect x="315" y="130" width="14" height="20" rx="3" transform="rotate(25 315 130)" fill="url(#bookGrad)" opacity="0.5" class="mini-book-2" />
                </g>
              </svg>
            </div>

            <!-- Glassmorphic Quote Card on the Bottom -->
            <div class="glass-quote-card animate-scale-up">
              <div class="quote-header">
                <div class="quote-icon-badge">
                  <v-icon icon="mdi-format-quote-open" size="32" color="primary" />
                </div>
                <div class="quote-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>

              <blockquote>
                “Thư viện không chỉ là nơi lưu trữ sách, mà là cánh cổng mở ra những khả năng vô tận của tri thức.”
              </blockquote>

              <div class="quote-footer">
                <div class="author-avatar">
                  <v-avatar color="primary" size="38">
                    <span class="text-subtitle-2 font-weight-bold text-white">TV</span>
                  </v-avatar>
                </div>
                <div class="author-info">
                  <span class="author-name">Hệ thống thư viện số</span>
                  <span class="author-title">Nền tảng tri thức thế hệ mới</span>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const showPassword = ref(false)
const rememberMe = ref(false)

const router = useRouter()
const auth = useAuthStore()

// Restore remembered email if any
const savedEmail = localStorage.getItem('rememberEmail')
if (savedEmail) {
  email.value = savedEmail
  rememberMe.value = true
}

// Interactive greetings based on localized user clock
const currentHour = new Date().getHours()

const greetingTitle = computed(() => {
  if (currentHour >= 5 && currentHour < 12) {
    return 'Chào buổi sáng! 🌅'
  } else if (currentHour >= 12 && currentHour < 18) {
    return 'Chào buổi chiều! ☀️'
  } else if (currentHour >= 18 && currentHour < 22) {
    return 'Chào buổi tối! 🌙'
  } else {
    return 'Cú đêm học tập! 🦉'
  }
})

const greetingSubtitle = computed(() => {
  if (currentHour >= 5 && currentHour < 12) {
    return 'Đăng nhập vào tài khoản của bạn để đón nhận tri thức ngày mới.'
  } else if (currentHour >= 12 && currentHour < 18) {
    return 'Tiếp thêm nguồn năng lượng tư duy cho ngày học tập hiệu quả.'
  } else if (currentHour >= 18 && currentHour < 22) {
    return 'Một không gian yên tĩnh và tuyệt vời để tích lũy giá trị.'
  } else {
    return 'Sách và tri thức luôn đồng hành cùng các giấc mơ thâu đêm.'
  }
})

async function handleLogin() {
  error.value = ''

  if (!email.value) {
    error.value = 'Vui lòng điền địa chỉ email tài khoản.'
    return
  }

  if (!password.value) {
    error.value = 'Vui lòng cung cấp mật khẩu bảo mật.'
    return
  }

  loading.value = true

  try {
    const user = await auth.login(email.value, password.value)

    if (rememberMe.value) {
      localStorage.setItem('rememberEmail', email.value)
    } else {
      localStorage.removeItem('rememberEmail')
    }

    if (['Admin', 'Librarian'].includes(user.role)) {
      router.push('/app/dashboard')
    } else if (user.role === 'Reader') {
      router.push('/app/books')
    } else {
      router.push('/app/books')
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'Email hoặc mật khẩu bảo mật chưa đúng. Vui lòng thử lại.'
    console.error(err.response || err)
  } finally {
    loading.value = false
  }
}

function showForgotMessage() {
  error.value = 'Hệ thống đang tích hợp cổng phục hồi mã xác thực OTP qua Email.'
}

function showGoogleMessage() {
  error.value = 'Xác thực tài khoản Google đang trong chế độ bảo trì định kỳ.'
}
</script>

<style scoped>
/* Importing premium responsive web typography */
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

.login-page {
  min-height: 100vh;
  background: #F8FAFC;
  color: #0F172A;
  font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
  overflow-x: hidden;
}

/* Loading bar animations */
.loading-bar-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: rgba(37, 99, 235, 0.1);
  z-index: 100;
  overflow: hidden;
}

.loading-bar-inner {
  height: 100%;
  width: 30%;
  background: linear-gradient(90deg, #2563EB, #06B6D4, #2563EB);
  border-radius: 99px;
  animation: bar-slide 1.5s infinite ease-in-out;
}

@keyframes bar-slide {
  0% { left: -30%; width: 30%; }
  50% { width: 50%; }
  100% { left: 100%; width: 30%; }
}

.login-shell {
  min-height: 100vh;
  display: flex;
  position: relative;
}

/* ==========================================================================
   LEFT SECTION: FORM (PREMIUM MODERN LAYOUT)
   ========================================================================== */
.login-form-section {
  width: 60%;
  min-height: 100vh;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 64px;
  box-shadow: 12px 0 50px rgba(15, 23, 42, 0.03);
  z-index: 10;
  position: relative;
}

.login-form-wrapper {
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
}

/* Brand header styling */
.login-brand {
  display: inline-flex;
  align-items: center;
  gap: 14px;
  color: #0F172A;
  text-decoration: none;
  margin-bottom: 40px;
  align-self: flex-start;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.login-brand:hover {
  transform: scale(1.05);
}

.login-brand-icon {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #2563EB 0%, #06B6D4 100%);
  box-shadow: 0 10px 20px rgba(37, 99, 235, 0.2);
}

.rotating-icon {
  animation: icon-float 6s infinite ease-in-out;
}

@keyframes icon-float {
  0%, 100% { transform: translateY(0) rotate(0); }
  50% { transform: translateY(-3px) rotate(10deg); }
}

.brand-info {
  display: flex;
  flex-direction: column;
}

.brand-text {
  font-size: 20px;
  letter-spacing: -0.02em;
  background: linear-gradient(135deg, #0f172a 0%, #2563EB 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.brand-tagline {
  font-size: 11px;
  color: #94A3B8;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-top: 1px;
}

/* Greeting title */
.login-heading {
  margin-bottom: 28px;
}

.greeting-title {
  color: #0F172A;
  font-size: 32px;
  line-height: 1.25;
  letter-spacing: -0.04em;
  font-weight: 800;
  margin-bottom: 10px;
  background: linear-gradient(135deg, #0F172A 20%, #2563EB 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.greeting-subtitle {
  color: #64748B;
  font-size: 14.5px;
  line-height: 1.55;
}

/* Modern Form group inputs */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.input-label {
  font-size: 13px;
  font-weight: 700;
  color: #334155;
  letter-spacing: -0.01em;
}

.input-hint {
  font-size: 11.5px;
  color: #94A3B8;
  margin-top: 2px;
  font-weight: 500;
}

/* Vuetify styles customization */
:deep(.v-field) {
  background-color: #F8FAFC !important;
  border: 1px solid #E2E8F0 !important;
  transition: all 0.2s ease !important;
}

:deep(.v-field--focused) {
  background-color: #ffffff !important;
  border-color: #2563EB !important;
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.08) !important;
}

:deep(.v-field__input) {
  font-size: 14px !important;
  color: #0F172A !important;
  font-weight: 500 !important;
}

:deep(.v-field__outline) {
  display: none !important; /* Hide native outlines for customized cleaner fields */
}

/* Login Checkbox & Links */
.login-options {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: -4px;
}

:deep(.remember-checkbox .v-label) {
  font-size: 13.5px !important;
  font-weight: 600 !important;
  color: #64748B !important;
  opacity: 1 !important;
}

.forgot-link {
  border: none;
  background: transparent;
  color: #2563EB;
  font-size: 13.5px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.forgot-link:hover {
  color: #1D4ED8;
  text-decoration: underline;
}

/* Premium submit button with moving sweeps */
.submit-btn {
  background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%) !important;
  font-weight: 700 !important;
  text-transform: none !important;
  font-size: 15px !important;
  height: 48px !important;
  letter-spacing: -0.01em !important;
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
  box-shadow: 0 8px 20px rgba(37, 99, 235, 0.15) !important;
}

.submit-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    120deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transition: none;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(37, 99, 235, 0.25) !important;
}

.submit-btn:hover::before {
  left: 100%;
  transition: all 0.7s ease;
}

.submit-btn:active {
  transform: translateY(0);
}

/* Customized divider lines */
.divider {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 8px 0;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  border-top: 1.5px dashed #E2E8F0;
}

.divider span {
  position: relative;
  z-index: 2;
  background: #ffffff;
  padding: 0 14px;
  color: #94A3B8;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Premium Google button */
.google-btn {
  text-transform: none !important;
  font-size: 14.5px !important;
  font-weight: 600 !important;
  height: 48px !important;
  border: 1.5px solid #E2E8F0 !important;
  color: #334155 !important;
  background-color: #ffffff !important;
  transition: all 0.25s ease !important;
}

.google-btn:hover {
  background-color: #F8FAFC !important;
  border-color: #CBD5E1 !important;
  transform: translateY(-1.5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03) !important;
}

.google-icon {
  width: 18px;
  height: 18px;
  display: inline-flex;
  margin-right: 10px;
}

/* Bottom elements and links */
.register-text {
  margin-top: 26px;
  text-align: center;
  color: #64748B;
  font-size: 14px;
  font-weight: 500;
}

.register-link {
  color: #2563EB;
  font-weight: 700;
  text-decoration: none;
  transition: color 0.2s ease;
  position: relative;
}

.register-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0%;
  height: 1.5px;
  background-color: #2563EB;
  transition: width 0.25s ease;
}

.register-link:hover {
  color: #1D4ED8;
}

.register-link:hover::after {
  width: 100%;
}

.back-home {
  margin-top: 18px;
  display: flex;
  justify-content: center;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #94A3B8;
  text-decoration: none;
  font-weight: 700;
  font-size: 13.5px;
  transition: all 0.25s ease;
}

.back-icon {
  transition: transform 0.2s ease;
}

.back-link:hover {
  color: #64748B;
}

.back-link:hover .back-icon {
  transform: translateX(-4px);
}

.form-footer {
  margin-top: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #94A3B8;
  font-size: 11.5px;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.form-footer .dot {
  color: #CBD5E1;
}

.elegant-alert {
  border: 1px solid rgba(220, 38, 38, 0.1);
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.02);
}

.error-pulse {
  animation: pulse-red 2s infinite ease-in-out;
}

@keyframes pulse-red {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.15); opacity: 0.8; }
}

/* ==========================================================================
   RIGHT SECTION: VISUAL (FUTURISTIC DIGITAL CORE)
   ========================================================================== */
.login-visual-section {
  width: 40%;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  background: #060913;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 60px;
}

.gradient-overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 50%, rgba(37, 99, 235, 0.16) 0%, transparent 65%);
  z-index: 1;
}

.visual-grid {
  position: absolute;
  inset: 0;
  opacity: 0.06;
  background-image: linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
  background-size: 44px 44px;
  z-index: 1;
}

/* Glowing background space particles */
.glow-orb {
  position: absolute;
  border-radius: 999px;
  filter: blur(120px);
  pointer-events: none;
  opacity: 0.35;
  z-index: 1;
}

.orb-primary {
  top: 10%;
  right: 15%;
  width: 300px;
  height: 300px;
  background: rgba(37, 99, 235, 0.45);
  animation: orbit-shift-1 18s infinite alternate ease-in-out;
}

.orb-accent {
  bottom: 15%;
  left: 10%;
  width: 260px;
  height: 260px;
  background: rgba(6, 182, 212, 0.4);
  animation: orbit-shift-2 14s infinite alternate-reverse ease-in-out;
}

.orb-purple {
  top: 40%;
  left: 45%;
  width: 340px;
  height: 340px;
  background: rgba(147, 51, 234, 0.18);
  animation: orbit-shift-3 22s infinite alternate ease-in-out;
}

@keyframes orbit-shift-1 {
  0% { transform: translate(0, 0) scale(1); }
  100% { transform: translate(-30px, 20px) scale(1.1); }
}

@keyframes orbit-shift-2 {
  0% { transform: translate(0, 0) scale(1); }
  100% { transform: translate(40px, -30px) scale(0.9); }
}

@keyframes orbit-shift-3 {
  0% { transform: translate(0, 0) scale(1); }
  100% { transform: translate(-20px, -20px) scale(1.15); }
}

/* Futuristic Vector Illustration Container & Animations */
.illustration-container {
  width: 100%;
  max-width: 320px;
  height: auto;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5;
  margin: auto;
}

.futuristic-svg {
  width: 100%;
  height: 100%;
}

/* SVG Animations */
.rotator-ring-slow {
  transform-origin: 200px 200px;
  animation: rotate-clockwise 24s linear infinite;
}

.rotator-ring-fast {
  transform-origin: 200px 200px;
  animation: rotate-counter-clockwise 16s linear infinite;
}

.floating-book-group {
  animation: float-book 5s ease-in-out infinite alternate;
}

.spine-glow {
  animation: spine-pulse 2s infinite ease-in-out alternate;
}

.glow-beam {
  animation: beam-pulse 3.5s ease-in-out infinite alternate;
}

.particle {
  transform-origin: center bottom;
  animation: particle-lift 4s infinite linear;
}

/* Micro-delay setups for floating data particles */
.p-1 { animation-delay: 0s; }
.p-2 { animation-delay: 1.2s; }
.p-3 { animation-delay: 2.4s; }
.p-4 { animation-delay: 0.8s; }
.p-5 { animation-delay: 1.8s; }
.p-6 { animation-delay: 3s; }

/* Micro-animations of background elements */
.mini-book-1 {
  animation: mini-book-pulse 4s infinite alternate ease-in-out;
}
.mini-book-2 {
  animation: mini-book-pulse 5s infinite alternate-reverse ease-in-out;
}

@keyframes rotate-clockwise {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes rotate-counter-clockwise {
  from { transform: rotate(360deg); }
  to { transform: rotate(0deg); }
}

@keyframes float-book {
  0% { transform: translateY(5px); }
  100% { transform: translateY(-15px); }
}

@keyframes spine-pulse {
  0% { opacity: 0.5; stroke-width: 2.5px; }
  100% { opacity: 1; stroke-width: 4px; filter: drop-shadow(0 0 6px #06B6D4); }
}

@keyframes beam-pulse {
  0% { opacity: 0.2; transform: scaleX(0.9); }
  100% { opacity: 0.65; transform: scaleX(1.15); filter: drop-shadow(0 0 12px rgba(6, 182, 212, 0.4)); }
}

@keyframes particle-lift {
  0% { transform: translateY(110px) scale(0); opacity: 0; }
  30% { opacity: 1; }
  100% { transform: translateY(-120px) scale(1.3); opacity: 0; }
}

@keyframes mini-book-pulse {
  0% { transform: translateY(0) rotate(-15deg); opacity: 0.5; }
  100% { transform: translateY(-8px) rotate(-10deg); opacity: 0.85; }
}

/* Glassmorphic Quote Card on Bottom of Visual Column */
.glass-quote-card {
  position: relative;
  z-index: 5;
  width: 100%;
  max-width: 460px;
  padding: 30px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  border: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
}

.quote-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}

.quote-icon-badge {
  width: 46px;
  height: 46px;
  background: rgba(37, 99, 235, 0.1);
  border-radius: 12px;
  display: grid;
  place-items: center;
  border: 1.5px solid rgba(37, 99, 235, 0.15);
}

.quote-dots {
  display: flex;
  gap: 5px;
}

.quote-dots span {
  width: 5px;
  height: 5px;
  border-radius: 99px;
  background: rgba(255, 255, 255, 0.15);
}

.quote-dots span:nth-child(1) {
  background: #2563EB;
}

.glass-quote-card blockquote {
  color: #FFFFFF;
  font-size: 21px;
  line-height: 1.45;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin: 0 0 22px 0;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.quote-footer {
  display: flex;
  align-items: center;
  gap: 12px;
  border-top: 1.5px solid rgba(255, 255, 255, 0.06);
  padding-top: 16px;
}

.author-info {
  display: flex;
  flex-direction: column;
}

.author-name {
  color: #FFFFFF;
  font-size: 14.5px;
  font-weight: 700;
}

.author-title {
  color: #94A3B8;
  font-size: 12px;
  font-weight: 500;
  margin-top: 1px;
}

/* ==========================================================================
   ENTRANCE EFFECTS (PAGE ENTRY ANIMATIONS)
   ========================================================================== */
.animate-fade-in {
  opacity: 0;
  transform: translateY(15px);
  animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.animate-scale-up {
  opacity: 0;
  transform: scale(0.96);
  animation: scaleUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.delay-1 { animation-delay: 0.15s; }
.delay-2 { animation-delay: 0.3s; }
.delay-3 { animation-delay: 0.45s; }

@keyframes fadeIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scaleUp {
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Transitions classes for Vue Elements */
.slide-up-enter-active, .slide-up-leave-active {
  transition: all 0.3s ease;
}
.slide-up-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Decorative floating icons on left and right */
.bg-floating-icon {
  position: absolute;
  pointer-events: none;
  z-index: 1;
}

/* Left Side (Light Background) - Soft Transparencies */
.icon-left-1 {
  top: 12%;
  left: 6%;
  color: rgba(37, 99, 235, 0.16) !important;
  filter: drop-shadow(0 0 8px rgba(37, 99, 235, 0.15));
  animation: tech-float-1 7s infinite ease-in-out;
}

.icon-left-2 {
  top: 24%;
  left: 20%;
  color: rgba(168, 85, 247, 0.15) !important;
  filter: drop-shadow(0 0 8px rgba(168, 85, 247, 0.12));
  animation: tech-float-2 8s infinite ease-in-out;
}

.icon-left-3 {
  top: 38%;
  left: 8%;
  color: rgba(37, 99, 235, 0.14) !important;
  filter: drop-shadow(0 0 6px rgba(37, 99, 235, 0.1));
  animation: tech-float-3 6.5s infinite ease-in-out;
}

.icon-left-4 {
  top: 48%;
  left: 22%;
  color: rgba(168, 85, 247, 0.15) !important;
  filter: drop-shadow(0 0 8px rgba(168, 85, 247, 0.12));
  animation: tech-float-1 9s infinite ease-in-out;
}

.icon-left-5 {
  top: 60%;
  left: 7%;
  color: rgba(37, 99, 235, 0.15) !important;
  filter: drop-shadow(0 0 8px rgba(37, 99, 235, 0.12));
  animation: tech-float-2 7.5s infinite ease-in-out;
}

.icon-left-6 {
  top: 70%;
  left: 18%;
  color: rgba(168, 85, 247, 0.16) !important;
  filter: drop-shadow(0 0 8px rgba(168, 85, 247, 0.12));
  animation: tech-float-3 8.5s infinite ease-in-out;
}

.icon-left-7 {
  top: 82%;
  left: 5%;
  color: rgba(37, 99, 235, 0.14) !important;
  filter: drop-shadow(0 0 6px rgba(37, 99, 235, 0.1));
  animation: tech-float-1 8s infinite ease-in-out;
}

.icon-left-8 {
  top: 90%;
  left: 15%;
  color: rgba(168, 85, 247, 0.15) !important;
  filter: drop-shadow(0 0 8px rgba(168, 85, 247, 0.12));
  animation: tech-float-2 9.5s infinite ease-in-out;
}

/* Right Side (Dark Background) - Neon Glowing */
.icon-right-1 {
  top: 35%;
  right: 6%;
  color: rgba(6, 182, 212, 0.55) !important;
  filter: drop-shadow(0 0 14px rgba(6, 182, 212, 0.5));
  animation: tech-float-2 6.5s infinite ease-in-out;
}

.icon-right-2 {
  top: 12%;
  right: 18%;
  color: rgba(37, 99, 235, 0.52) !important;
  filter: drop-shadow(0 0 12px rgba(37, 99, 235, 0.45));
  animation: tech-float-1 8.5s infinite ease-in-out;
}

.icon-right-3 {
  top: 55%;
  right: 25%;
  color: rgba(168, 85, 247, 0.5) !important;
  filter: drop-shadow(0 0 12px rgba(168, 85, 247, 0.45));
  animation: tech-float-3 7.5s infinite ease-in-out;
}

.icon-right-4 {
  top: 72%;
  right: 8%;
  color: rgba(6, 182, 212, 0.52) !important;
  filter: drop-shadow(0 0 14px rgba(6, 182, 212, 0.48));
  animation: tech-float-2 9s infinite ease-in-out;
}

.icon-right-5 {
  top: 85%;
  right: 18%;
  color: rgba(37, 99, 235, 0.55) !important;
  filter: drop-shadow(0 0 14px rgba(37, 99, 235, 0.5));
  animation: tech-float-1 8s infinite ease-in-out;
}

/* Floating Tech Icons container & items */
.floating-tech-icons {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 3;
}

.tech-icon-item {
  position: absolute;
  width: 54px;
  height: 54px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  background: rgba(15, 23, 42, 0.45); /* Nền tối kính mờ */
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

/* Specific Positions and Glow Borders */
.icon-book {
  top: 18%;
  left: 15%;
  border-color: rgba(6, 182, 212, 0.3);
  box-shadow: 0 0 20px rgba(6, 182, 212, 0.15), inset 0 0 12px rgba(6, 182, 212, 0.05);
  animation: tech-float-1 8s infinite ease-in-out;
}

.icon-cloud {
  top: 22%;
  right: 15%;
  border-color: rgba(37, 99, 235, 0.3);
  box-shadow: 0 0 20px rgba(37, 99, 235, 0.15), inset 0 0 12px rgba(37, 99, 235, 0.05);
  animation: tech-float-2 9s infinite ease-in-out;
}

.icon-chip {
  bottom: 38%;
  left: 14%;
  border-color: rgba(168, 85, 247, 0.3);
  box-shadow: 0 0 20px rgba(168, 85, 247, 0.15), inset 0 0 12px rgba(168, 85, 247, 0.05);
  animation: tech-float-3 10s infinite ease-in-out;
}

.icon-database {
  bottom: 42%;
  right: 12%;
  border-color: rgba(6, 182, 212, 0.3);
  box-shadow: 0 0 20px rgba(6, 182, 212, 0.15), inset 0 0 12px rgba(6, 182, 212, 0.05);
  animation: tech-float-1 7.5s infinite ease-in-out;
}

/* Animations for Floating effects */
@keyframes tech-float-1 {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-12px) rotate(5deg);
  }
}

@keyframes tech-float-2 {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-8px) rotate(-6deg);
  }
}

@keyframes tech-float-3 {
  0%, 100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-10px) scale(1.03);
  }
}

/* ==========================================================================
   RESPONSIVENESS (CROSS PLATFORMS)
   ========================================================================== */
@media (max-width: 1200px) {
  .login-form-section {
    width: 60%;
    padding: 40px;
  }
  .login-visual-section {
    width: 40%;
    padding: 40px;
  }
}

@media (max-width: 960px) {
  .login-shell {
    display: block;
  }

  .login-form-section {
    width: 100%;
    min-height: 100vh;
    padding: 60px 24px;
    background: #ffffff;
  }

  .login-form-wrapper {
    max-width: 400px;
    margin: 0 auto;
  }

  .login-brand {
    margin-bottom: 36px;
  }

  .login-visual-section {
    display: none;
  }
}
</style>
