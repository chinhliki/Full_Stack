<template>
  <v-app>
    <v-main>
      <div class="register-page">
        <!-- Interactive loading bar at the very top -->
        <transition name="fade">
          <div class="loading-bar-wrapper" v-if="loading">
            <div class="loading-bar-inner"></div>
          </div>
        </transition>

        <main class="register-shell">
          <!-- Left: Register Form Section (60% Width) -->
          <section class="register-form-section">
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

            <div class="register-form-wrapper">
              
              <!-- Brand Header with Premium Floating Icon -->
              <router-link to="/" class="register-brand animate-fade-in">
                <div class="register-brand-icon">
                  <v-icon icon="mdi-library" size="24" color="white" class="rotating-icon" />
                </div>
                <div class="brand-info">
                  <span class="brand-text font-weight-black">Thư viện Số</span>
                  <span class="brand-tagline">Học tập không giới hạn</span>
                </div>
              </router-link>

              <!-- Heading -->
              <div class="register-heading animate-fade-in delay-1">
                <h1 class="greeting-title">Đăng ký độc giả</h1>
                <p class="greeting-subtitle">Tham gia hệ thống thư viện số và bắt đầu quản lý quá trình mượn sách của bạn.</p>
              </div>

              <!-- Sleek Alert with Auto-Slide-In -->
              <transition name="slide-up">
                <v-alert
                  v-if="message"
                  :type="success ? 'success' : 'error'"
                  variant="tonal"
                  density="comfortable"
                  rounded="xl"
                  class="mb-6 elegant-alert"
                  closable
                  @click:close="message = ''"
                >
                  <template v-slot:prepend>
                    <v-icon :icon="success ? 'mdi-checkbox-marked-circle-outline' : 'mdi-alert-circle-outline'" :class="{ 'error-pulse': !success }" />
                  </template>
                  {{ message }}
                </v-alert>
              </transition>

              <!-- Interactive Form -->
              <form class="register-form animate-fade-in delay-2" @submit.prevent="handleRegister">
                <div class="input-group">
                  <span class="input-label">Họ và tên của bạn</span>
                  <v-text-field
                    v-model="form.fullName"
                    type="text"
                    prepend-inner-icon="mdi-account-outline"
                    placeholder="Nhập họ và tên"
                    autocomplete="name"
                    :disabled="loading"
                    variant="outlined"
                    density="comfortable"
                    rounded="lg"
                    hide-details="auto"
                    class="custom-input"
                  />
                </div>

                <div class="input-group">
                  <span class="input-label">Tài khoản Email</span>
                  <v-text-field
                    v-model="form.email"
                    type="email"
                    prepend-inner-icon="mdi-email-outline"
                    placeholder="name@example.com"
                    autocomplete="email"
                    :disabled="loading"
                    variant="outlined"
                    density="comfortable"
                    rounded="lg"
                    hide-details="auto"
                    class="custom-input"
                  />
                </div>

                <v-row dense>
                  <v-col cols="12" md="6">
                    <div class="input-group">
                      <span class="input-label">Mật khẩu bảo mật</span>
                      <v-text-field
                        v-model="form.password"
                        :type="showPassword ? 'text' : 'password'"
                        prepend-inner-icon="mdi-lock-outline"
                        :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                        placeholder="Nhập mật khẩu"
                        autocomplete="new-password"
                        :disabled="loading"
                        variant="outlined"
                        density="comfortable"
                        rounded="lg"
                        hide-details="auto"
                        class="custom-input"
                        @click:append-inner="showPassword = !showPassword"
                      />
                    </div>
                  </v-col>

                  <v-col cols="12" md="6">
                    <div class="input-group">
                      <span class="input-label">Xác nhận mật khẩu</span>
                      <v-text-field
                        v-model="form.confirmPassword"
                        :type="showConfirmPassword ? 'text' : 'password'"
                        prepend-inner-icon="mdi-lock-check-outline"
                        :append-inner-icon="showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'"
                        placeholder="Nhập lại mật khẩu"
                        autocomplete="new-password"
                        :disabled="loading"
                        variant="outlined"
                        density="comfortable"
                        rounded="lg"
                        hide-details="auto"
                        class="custom-input"
                        @click:append-inner="showConfirmPassword = !showConfirmPassword"
                      />
                    </div>
                  </v-col>
                </v-row>

                <v-row dense>
                  <v-col cols="12" md="6">
                    <div class="input-group">
                      <span class="input-label">Mã độc giả / Sinh viên</span>
                      <v-text-field
                        v-model="form.studentCode"
                        type="text"
                        prepend-inner-icon="mdi-card-account-details-outline"
                        placeholder="VD: SV001"
                        :disabled="loading"
                        variant="outlined"
                        density="comfortable"
                        rounded="lg"
                        hide-details="auto"
                        class="custom-input"
                      />
                    </div>
                  </v-col>

                  <v-col cols="12" md="6">
                    <div class="input-group">
                      <span class="input-label">Số điện thoại</span>
                      <v-text-field
                        v-model="form.phone"
                        type="tel"
                        prepend-inner-icon="mdi-phone-outline"
                        placeholder="Nhập số điện thoại"
                        :disabled="loading"
                        variant="outlined"
                        density="comfortable"
                        rounded="lg"
                        hide-details="auto"
                        class="custom-input"
                      />
                    </div>
                  </v-col>
                </v-row>

                <div class="input-group">
                  <span class="input-label">Địa chỉ liên hệ</span>
                  <v-textarea
                    v-model="form.address"
                    prepend-inner-icon="mdi-map-marker-outline"
                    placeholder="Nhập địa chỉ của bạn"
                    rows="2"
                    auto-grow
                    :disabled="loading"
                    variant="outlined"
                    density="comfortable"
                    rounded="lg"
                    hide-details="auto"
                    class="custom-input"
                  />
                </div>

                <!-- Terms and Policy row -->
                <div class="terms-row">
                  <v-checkbox
                    v-model="agreeTerms"
                    density="compact"
                    hide-details
                    color="primary"
                    class="terms-checkbox"
                  />
                  <div class="terms-text">
                    Tôi đồng ý với các
                    <button type="button" class="policy-link" @click="showPolicyMessage">Điều khoản sử dụng</button>
                    và
                    <button type="button" class="policy-link" @click="showPolicyMessage">Chính sách bảo mật</button>
                    của hệ thống.
                  </div>
                </div>

                <!-- Premium Shimmer Submit Button -->
                <v-btn
                  type="submit"
                  color="primary"
                  size="large"
                  block
                  rounded="lg"
                  prepend-icon="mdi-account-plus"
                  :loading="loading"
                  class="submit-btn elevation-0"
                >
                  Tạo tài khoản độc giả
                </v-btn>

                <div class="divider">
                  <span>Hoặc liên kết nhanh</span>
                </div>

                <!-- Google Register button -->
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
                  Đăng ký bằng Google
                </v-btn>
              </form>

              <!-- Login redirect link -->
              <p class="login-text animate-fade-in delay-3">
                Đã có tài khoản thành viên?
                <router-link to="/login" class="login-link">Đăng nhập ngay</router-link>
              </p>

              <!-- Return back-to-home navigation -->
              <div class="back-home animate-fade-in delay-3">
                <router-link to="/" class="back-link">
                  <v-icon icon="mdi-arrow-left" size="18" class="back-icon" />
                  Quay về trang chủ thư viện
                </router-link>
              </div>

              <!-- Bottom Security badges -->
              <div class="form-footer animate-fade-in delay-3">
                <span>Phiên bản v2.1.0-Premium</span>
                <span class="dot">•</span>
                <span>Bảo mật bởi SSL 256-bit</span>
              </div>
            </div>
          </section>

          <!-- Right: Visual Section (40% Width) -->
          <section class="register-visual-section">
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

            <!-- Floating Tech Icons (AI Chip, Cloud Data, Open Book) -->
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

            <!-- Interactive Futuristic Floating Library SVG Illustration -->
            <div class="illustration-container animate-fade-in">
              <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" class="futuristic-svg">
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
                
                <circle cx="200" cy="200" r="160" stroke="url(#circuitGrad)" stroke-width="1.5" stroke-dasharray="12 6" class="rotator-ring-slow" />
                <circle cx="200" cy="200" r="120" stroke="url(#circuitGrad)" stroke-width="1" stroke-dasharray="6 6" class="rotator-ring-fast" />

                <g class="floating-book-group">
                  <path d="M 120 250 L 200 285 L 280 250 L 200 220 Z" fill="rgba(37, 99, 235, 0.15)" filter="blur(8px)" />
                  <path d="M 120 240 L 200 275 L 280 240 L 280 245 L 200 280 L 120 245 Z" fill="#1E293B" stroke="#334155" stroke-width="1.5" />
                  <path d="M 200 270 C 160 255 140 255 115 235 L 115 175 C 140 195 160 195 200 210 Z" fill="#0F172A" stroke="url(#bookGrad)" stroke-width="2.5" />
                  <path d="M 200 210 C 240 195 260 195 285 175 L 285 235 C 260 255 240 255 200 270 Z" fill="#0F172A" stroke="url(#bookGrad)" stroke-width="2.5" />
                  <path d="M 130 195 Q 160 210 185 220" stroke="rgba(6, 182, 212, 0.4)" stroke-width="2" stroke-linecap="round" />
                  <path d="M 130 207 Q 160 222 185 232" stroke="rgba(37, 99, 235, 0.4)" stroke-width="2" stroke-linecap="round" />
                  <path d="M 130 219 Q 160 234 185 244" stroke="rgba(6, 182, 212, 0.4)" stroke-width="2" stroke-linecap="round" />
                  <path d="M 215 228 Q 240 218 270 198" stroke="rgba(6, 182, 212, 0.4)" stroke-width="2" stroke-linecap="round" />
                  <path d="M 215 240 Q 240 230 270 210" stroke="rgba(37, 99, 235, 0.4)" stroke-width="2" stroke-linecap="round" />
                  <circle cx="230" cy="225" r="4" fill="#06B6D4" />
                  <circle cx="255" cy="215" r="3" fill="#2563EB" />
                  <line x1="200" y1="210" x2="200" y2="270" stroke="#06B6D4" stroke-width="3" stroke-linecap="round" class="spine-glow" />
                  <path d="M 200 210 L 160 40 L 240 40 Z" fill="url(#glowGrad)" style="mix-blend-mode: screen;" class="glow-beam" />
                </g>

                <g class="particle-group">
                  <circle cx="150" cy="130" r="3" fill="#06B6D4" class="particle p-1" />
                  <circle cx="250" cy="120" r="4" fill="#2563EB" class="particle p-2" />
                  <circle cx="200" cy="90" r="3" fill="#3B82F6" class="particle p-3" />
                  <rect x="180" y="110" width="4" height="4" rx="1" fill="#10B981" class="particle p-4" />
                  <circle cx="220" cy="70" r="5" fill="#06B6D4" class="particle p-5" />
                  <polygon points="170,80 174,86 166,86" fill="#3B82F6" class="particle p-6" />
                </g>

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
                “Tri thức là sức mạnh, và chia sẻ tri thức là nhân lên sức mạnh đó.”
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authApi } from '../../api/authApi'

const router = useRouter()

const loading = ref(false)
const message = ref('')
const success = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const agreeTerms = ref(false)

const form = ref({
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  studentCode: '',
  phone: '',
  address: ''
})

async function handleRegister() {
  message.value = ''

  const error = validateForm()

  if (error) {
    success.value = false
    message.value = error
    return
  }

  loading.value = true

  try {
    await authApi.register({
      fullName: form.value.fullName.trim(),
      email: form.value.email.trim(),
      password: form.value.password,
      studentCode: form.value.studentCode.trim(),
      phone: form.value.phone.trim(),
      address: form.value.address.trim()
    })

    success.value = true
    message.value = 'Đăng ký thành công. Hệ thống đã tạo tài khoản độc giả và thẻ thư viện cho bạn.'

    setTimeout(() => {
      router.push('/login')
    }, 900)
  } catch (err) {
    success.value = false
    message.value = err.response?.data?.message || 'Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.'
    console.error(err.response || err)
  } finally {
    loading.value = false
  }
}

function validateForm() {
  if (!form.value.fullName.trim()) return 'Vui lòng nhập họ và tên'
  if (!form.value.email.trim()) return 'Vui lòng nhập email'
  if (!form.value.password) return 'Vui lòng nhập mật khẩu'
  if (form.value.password.length < 6) return 'Mật khẩu phải có ít nhất 6 ký tự'
  if (!form.value.confirmPassword) return 'Vui lòng xác nhận mật khẩu'
  if (form.value.password !== form.value.confirmPassword) return 'Mật khẩu xác nhận không khớp'
  if (!form.value.studentCode.trim()) return 'Vui lòng nhập mã sinh viên hoặc mã độc giả'
  if (!agreeTerms.value) return 'Vui lòng đồng ý với điều khoản và chính sách'

  return ''
}

function showGoogleMessage() {
  success.value = false
  message.value = 'Đăng ký Google chỉ hiển thị theo giao diện mẫu. Backend hiện đang dùng đăng ký Email/Mật khẩu.'
}

function showPolicyMessage() {
  success.value = false
  message.value = 'Điều khoản và chính sách đang được mô phỏng trong phạm vi bài hiện tại.'
}
</script>

<style scoped>
/* Importing premium responsive web typography */
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

.register-page {
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
  height: 3px;
  background: rgba(37, 99, 235, 0.05);
  z-index: 100;
  overflow: hidden;
}

.loading-bar-inner {
  height: 100%;
  width: 35%;
  background: linear-gradient(90deg, transparent, #2563EB, #06B6D4, #2563EB, transparent);
  animation: bar-slide 1.2s infinite linear;
}

@keyframes bar-slide {
  0% { left: -35%; }
  100% { left: 100%; }
}

/* Fade transition for loading completion */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.register-shell {
  min-height: 100vh;
  display: flex;
  position: relative;
}

/* ==========================================================================
   LEFT SECTION: REGISTER FORM (60% WIDTH)
   ========================================================================== */
.register-form-section {
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

.register-form-wrapper {
  width: 100%;
  max-width: 520px;
  display: flex;
  flex-direction: column;
}

/* Brand header styling */
.register-brand {
  display: inline-flex;
  align-items: center;
  gap: 14px;
  color: #0F172A;
  text-decoration: none;
  margin-bottom: 24px;
  align-self: flex-start;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.register-brand:hover {
  transform: scale(1.05);
}

.register-brand-icon {
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

/* Heading */
.register-heading {
  margin-bottom: 24px;
}

.greeting-title {
  color: #0F172A;
  font-size: 30px;
  line-height: 1.25;
  letter-spacing: -0.04em;
  font-weight: 800;
  margin-bottom: 8px;
  background: linear-gradient(135deg, #0F172A 20%, #2563EB 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.greeting-subtitle {
  color: #64748B;
  font-size: 14px;
  line-height: 1.5;
}

/* Modern Form group inputs */
.register-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.input-label {
  font-size: 12.5px;
  font-weight: 700;
  color: #334155;
  letter-spacing: -0.01em;
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
  font-size: 13.5px !important;
  color: #0F172A !important;
  font-weight: 500 !important;
}

:deep(.v-field__outline) {
  display: none !important;
}

/* Terms Row */
.terms-row {
  display: flex;
  align-items: flex-start;
  gap: 4px;
  margin-top: 4px;
}

:deep(.terms-checkbox .v-label) {
  display: none !important; /* Hide native checkbox label to use custom formatted block */
}

.terms-text {
  color: #64748B;
  font-size: 13.5px;
  line-height: 1.5;
  padding-top: 6px;
  font-weight: 500;
}

.policy-link {
  border: none;
  background: transparent;
  color: #2563EB;
  font-weight: 700;
  cursor: pointer;
  padding: 0;
  transition: all 0.2s ease;
}

.policy-link:hover {
  color: #1D4ED8;
  text-decoration: underline;
}

/* Premium submit button */
.submit-btn {
  background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%) !important;
  font-weight: 700 !important;
  text-transform: none !important;
  font-size: 15px !important;
  height: 48px !important;
  letter-spacing: -0.01em !important;
  position: relative;
  overflow: hidden;
  margin-top: 6px;
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
  margin: 6px 0;
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
.login-text {
  margin-top: 26px;
  text-align: center;
  color: #64748B;
  font-size: 14px;
  font-weight: 500;
}

.login-link {
  color: #2563EB;
  font-weight: 700;
  text-decoration: none;
  transition: color 0.2s ease;
  position: relative;
}

.login-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0%;
  height: 1.5px;
  background-color: #2563EB;
  transition: width 0.25s ease;
}

.login-link:hover {
  color: #1D4ED8;
}

.login-link:hover::after {
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
  margin-top: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #94A3B8;
  font-size: 12px;
  font-weight: 600;
}

.form-footer .dot {
  opacity: 0.5;
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

/* ==========================================================================
   RIGHT SECTION: VISUAL (40% WIDTH - FUTURISTIC DIGITAL CORE)
   ========================================================================== */
.register-visual-section {
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

.glow-orb {
  position: absolute;
  border-radius: 999px;
  filter: blur(120px);
  pointer-events: none;
  z-index: 1;
  opacity: 0.35;
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

/* Right Side Background Icons - Glowing */
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
  background: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

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

/* Vector Illustration Container */
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
  font-size: 14px;
  font-weight: 700;
}

.author-title {
  color: #94A3B8;
  font-size: 11.5px;
  font-weight: 600;
  margin-top: 1px;
}

/* Animations Definitions */
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
  0% { opacity: 0.6; filter: drop-shadow(0 0 3px #06B6D4); }
  100% { opacity: 1; filter: drop-shadow(0 0 10px #06B6D4); }
}

@keyframes beam-opacity {
  0% { opacity: 0.1; }
  100% { opacity: 0.45; }
}

@keyframes scaleUp {
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Transitions classes */
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

/* Keyframes for Floating effects */
@keyframes tech-float-1 {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-12px) rotate(5deg); }
}

@keyframes tech-float-2 {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-8px) rotate(-6deg); }
}

@keyframes tech-float-3 {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-10px) scale(1.03); }
}

/* ==========================================================================
   RESPONSIVENESS (CROSS PLATFORMS)
   ========================================================================== */
@media (max-width: 1200px) {
  .register-form-section {
    width: 60%;
    padding: 40px;
  }
  .register-visual-section {
    width: 40%;
    padding: 40px;
  }
}

@media (max-width: 960px) {
  .register-shell {
    display: block;
  }

  .register-form-section {
    width: 100%;
    min-height: 100vh;
    padding: 60px 24px;
    background: #ffffff;
  }

  .register-form-wrapper {
    max-width: 520px;
    margin: 0 auto;
  }

  .register-brand {
    margin-bottom: 36px;
  }

  .register-visual-section {
    display: none;
  }
}
</style>