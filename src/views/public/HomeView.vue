<template>
  <div class="home-page">
    <!-- Header with Glassmorphism and Hover Indicators -->
    <header class="home-header" :class="{ 'home-header-scrolled': isScrolled }">
      <div class="home-container header-inner">
        <router-link to="/" class="brand logo-pulse" @click="route.path === '/' && scrollToSection('#home', $event)">
          <div class="brand-icon">
            <v-icon icon="mdi-library" size="24" color="white" />
          </div>
          <span class="brand-text">Thư viện Số</span>
        </router-link>

        <nav class="desktop-nav">
          <a href="#home" class="nav-link" :class="{ active: activeSection === 'home' }" @click="scrollToSection('#home', $event)">Trang chủ</a>
          <a href="#features" class="nav-link" :class="{ active: activeSection === 'features' }" @click="scrollToSection('#features', $event)">Tính năng</a>
          <a href="#books" class="nav-link" :class="{ active: activeSection === 'books' }" @click="scrollToSection('#books', $event)">Sách mới</a>
          <a href="#stats" class="nav-link" :class="{ active: activeSection === 'stats' }" @click="scrollToSection('#stats', $event)">Thống kê</a>
          <a href="#architecture" class="nav-link" :class="{ active: activeSection === 'architecture' }" @click="scrollToSection('#architecture', $event)">Kiến trúc</a>
        </nav>

        <div class="desktop-actions">
          <v-btn
            icon
            variant="text"
            color="white"
            class="mr-2 theme-toggle-btn"
            @click="toggleTheme"
          >
            <v-icon :icon="isDark ? 'mdi-weather-sunny' : 'mdi-weather-night'" />
          </v-btn>

          <template v-if="auth.isLoggedIn">
            <div class="user-mini">
              <div class="user-name">{{ auth.fullName || 'Người dùng' }}</div>
              <div class="user-role">{{ displayRole }}</div>
            </div>

            <v-btn
              color="primary"
              rounded="lg"
              prepend-icon="mdi-view-dashboard"
              class="enter-btn btn-shimmer"
              @click="goToApp"
            >
              Vào hệ thống
            </v-btn>

            <v-btn
              color="error"
              variant="tonal"
              rounded="lg"
              icon="mdi-logout"
              class="logout-btn"
              @click="logout"
            />
          </template>

          <template v-else>
            <v-btn
              variant="outlined"
              color="primary"
              rounded="lg"
              class="login-nav-btn"
              @click="router.push('/login')"
            >
              Đăng nhập
            </v-btn>

            <v-btn
              color="primary"
              rounded="lg"
              class="register-nav-btn btn-shimmer"
              @click="router.push('/register')"
            >
              Đăng ký độc giả
            </v-btn>
          </template>
        </div>

        <v-btn
          class="mobile-menu-btn"
          icon="mdi-menu"
          variant="text"
          @click="mobileMenu = !mobileMenu"
        />
      </div>

      <!-- Mobile navigation drawer-style menu -->
      <transition name="slide-down-menu">
        <div v-if="mobileMenu" class="mobile-menu home-container">
          <a href="#home" @click="mobileMenu = false; scrollToSection('#home', $event)">Trang chủ</a>
          <a href="#features" @click="mobileMenu = false; scrollToSection('#features', $event)">Tính năng</a>
          <a href="#books" @click="mobileMenu = false; scrollToSection('#books', $event)">Sách mới</a>
          <a href="#stats" @click="mobileMenu = false; scrollToSection('#stats', $event)">Thống kê</a>
          <a href="#architecture" @click="mobileMenu = false; scrollToSection('#architecture', $event)">Kiến trúc</a>

          <div class="mobile-menu-actions">
            <v-btn
              v-if="!auth.isLoggedIn"
              block
              color="primary"
              rounded="lg"
              @click="router.push('/login')"
            >
              Đăng nhập
            </v-btn>

            <v-btn
              v-if="!auth.isLoggedIn"
              block
              color="primary"
              variant="outlined"
              rounded="lg"
              @click="router.push('/register')"
            >
              Đăng ký độc giả
            </v-btn>

            <v-btn
              v-if="auth.isLoggedIn"
              block
              color="primary"
              rounded="lg"
              @click="goToApp"
            >
              Vào hệ thống
            </v-btn>
          </div>
        </div>
      </transition>
    </header>

    <!-- Hero Section with Advanced Animated Gradient Space -->
    <section id="home" class="hero-section">
      <div class="hero-bg"></div>
      <div class="hero-particles">
        <span class="bubble bubble-1"></span>
        <span class="bubble bubble-2"></span>
        <span class="bubble bubble-3"></span>
        <span class="bubble bubble-4"></span>
      </div>
      <div class="hero-overlay"></div>

      <div class="home-container hero-content">
        <!-- Floating decorative glowing icons -->
        <div class="hero-decor-icon d-icon-1 cyan-glow">
          <v-icon icon="mdi-book-open-page-variant-outline" size="24" />
        </div>
        <div class="hero-decor-icon d-icon-2 purple-glow">
          <v-icon icon="mdi-lightbulb-on-outline" size="22" />
        </div>
        <div class="hero-decor-icon d-icon-3 cyan-glow">
          <v-icon icon="mdi-cpu-32-bit" size="20" />
        </div>
        <div class="hero-decor-icon d-icon-4 purple-glow">
          <v-icon icon="mdi-cloud-sync-outline" size="24" />
        </div>
        <div class="hero-decor-icon d-icon-5 cyan-glow">
          <v-icon icon="mdi-lan-connect" size="22" />
        </div>
        <div class="hero-decor-icon d-icon-6 purple-glow">
          <v-icon icon="mdi-database-outline" size="20" />
        </div>
        <div class="hero-decor-icon d-icon-7 cyan-glow">
          <v-icon icon="mdi-brain" size="22" />
        </div>
        <div class="hero-decor-icon d-icon-8 purple-glow">
          <v-icon icon="mdi-school-outline" size="24" />
        </div>

        <div class="hero-badge animate-entrance delay-1">
          <v-icon icon="mdi-cloud-check-outline" size="16" class="spinning-icon" />
          <span>Hệ Thống Thư Viện Số Microservices</span>
        </div>

        <h1 class="hero-title animate-entrance delay-2">
          Khám Phá Kho Tàng <br />
          <span class="gradient-text">Tri Thức Số</span> Mới
        </h1>

        <p class="hero-desc animate-entrance delay-3">
          Giải pháp công nghệ hiện đại hóa toàn diện thư viện số. Hỗ trợ độc giả tra cứu sách,
          quản lý hồ sơ mượn trả, cấp thẻ thông minh trực tuyến trên nền tảng kiến trúc Microservices hiệu năng cao.
        </p>

        <!-- Search box with expansion focus interaction -->
        <div class="hero-search animate-entrance delay-4">
          <v-icon icon="mdi-magnify" color="primary" size="26" class="search-icon-pulse" />

          <input
            v-model="searchKeyword"
            placeholder="Tìm kiếm sách số, tác giả, thể loại nghệ thuật..."
            @keyup.enter="goSearch"
            class="search-input"
          />

          <v-btn
            color="primary"
            rounded="lg"
            size="large"
            class="search-submit-btn btn-shimmer"
            @click="goSearch"
          >
            Tìm kiếm ngay
          </v-btn>
        </div>

        <div class="hero-actions animate-entrance delay-5">
          <v-btn
            v-if="auth.isLoggedIn"
            color="primary"
            size="large"
            rounded="lg"
            prepend-icon="mdi-view-dashboard"
            class="btn-shimmer"
            @click="goToApp"
          >
            Vào hệ thống quản lý
          </v-btn>
        </div>
      </div>
    </section>

    <main class="main-content">
      <!-- Features Section with Scroll Reveal and Sequential Delay Cards -->
      <section id="features" class="home-container section-block animate-on-scroll fade-up">
        <div class="section-heading text-center">
          <div class="mini-title">DỊCH VỤ CỦA CHÚNG TÔI</div>
          <h2>Tính Năng Nổi Bật</h2>
          <div class="heading-line"></div>
          <p>Trải nghiệm chuyển đổi số thư viện toàn diện với tính năng ưu việt</p>
        </div>

        <v-row class="features-row">
          <v-col
            v-for="(feature, index) in features"
            :key="feature.title"
            cols="12"
            md="6"
            lg="3"
            class="animate-on-scroll scale-up"
            :style="{ 'transition-delay': `${index * 150}ms` }"
          >
            <v-card class="feature-card">
              <div class="feature-icon">
                <v-icon :icon="feature.icon" size="28" />
              </div>

              <h3>{{ feature.title }}</h3>
              <p>{{ feature.description }}</p>
              
              <div class="feature-glow-bar"></div>
            </v-card>
          </v-col>
        </v-row>
      </section>

      <!-- New Books Section with 3D Tilt Hover and Slides -->
      <section id="books" class="home-container section-block animate-on-scroll fade-up">
        <div class="section-title-row">
          <div>
            <div class="mini-title text-start">BẤT HỦ & KINH ĐIỂN</div>
            <h2>Sách Mới Cập Nhật</h2>
            <div class="heading-line text-start"></div>
            <p>Những tác phẩm tri thức giá trị vừa được bổ sung vào kho dữ liệu số</p>
          </div>

          <v-btn
            color="primary"
            variant="text"
            append-icon="mdi-arrow-right"
            class="view-all-btn"
            @click="router.push('/app/books')"
          >
            Xem toàn bộ kho sách
          </v-btn>
        </div>

        <v-row class="books-row">
          <v-col
            v-for="(book, index) in newBooks"
            :key="book.title"
            cols="6"
            sm="4"
            md="3"
            lg="2.4"
            class="animate-on-scroll fade-up"
            :style="{ 'transition-delay': `${index * 100}ms` }"
          >
            <div class="book-card" @click="goSearch">
              <div class="book-cover">
                <img :src="book.cover" :alt="book.title" loading="lazy" />

                <div class="book-hover">
                  <v-btn color="primary" rounded="lg" size="small" class="elevation-10">
                    Đọc Sách
                  </v-btn>
                </div>
                
                <div class="book-badge">{{ book.category }}</div>
              </div>

              <div class="book-meta">
                <h4>{{ book.title }}</h4>
                <p>{{ book.author }}</p>
              </div>
            </div>
          </v-col>
        </v-row>
      </section>

      <!-- Stats Section with Infinite Marquee -->
      <section id="stats" class="stats-section animate-on-scroll fade-up">
        <div class="stats-bg-decor"></div>
        <div class="marquee-container">
          <div class="marquee-track">
            <!-- First Set -->
            <div class="marquee-content">
              <div v-for="stat in stats" :key="stat.label" class="marquee-item">
                <div class="stat-icon-wrapper">
                  <v-icon :icon="stat.icon" size="28" color="primary" />
                </div>
                <div class="stat-text">
                  <div class="stat-number">{{ stat.value }}</div>
                  <div class="stat-label">{{ stat.label }}</div>
                </div>
              </div>
            </div>
            <!-- Second Set (Duplicate for seamless loop) -->
            <div class="marquee-content" aria-hidden="true">
              <div v-for="stat in stats" :key="stat.label + '-dup'" class="marquee-item">
                <div class="stat-icon-wrapper">
                  <v-icon :icon="stat.icon" size="28" color="primary" />
                </div>
                <div class="stat-text">
                  <div class="stat-number">{{ stat.value }}</div>
                  <div class="stat-label">{{ stat.label }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Microservices Architecture Service Cards -->
      <section id="architecture" class="home-container section-block animate-on-scroll fade-up">
        <div class="section-heading text-center">
          <div class="mini-title">HỆ THỐNG PHÂN TÁN MICROSERVICES</div>
          <h2>Kiến Trúc Độc Lập</h2>
          <div class="heading-line"></div>
          <p>Hệ thống chia tách chuẩn xác thành các service chuyên biệt, bảo mật thông tin</p>
        </div>

        <v-row class="services-row">
          <v-col
            v-for="(service, index) in services"
            :key="service.title"
            cols="12"
            md="6"
            lg="3"
            class="animate-on-scroll scale-up"
            :style="{ 'transition-delay': `${index * 150}ms` }"
          >
            <v-card class="service-card">
              <div class="service-icon-box">
                <v-icon :icon="service.icon" size="28" color="primary" />
              </div>
              <h3>{{ service.title }}</h3>
              <p>{{ service.description }}</p>
              
              <!-- Tech circuit board decor details -->
              <div class="tech-dots">
                <span></span>
                <span></span>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </section>
    </main>

    <!-- Footer Section with Dark Theme and 3 Columns -->
    <footer class="home-footer">
      <div class="home-container footer-grid">
        <!-- Column 1: Contact Info -->
        <div class="footer-col animate-on-scroll fade-up">
          <h3>Liên hệ</h3>
          <div class="contact-info">
            <div class="contact-item">
              <v-icon icon="mdi-map-marker-outline" size="18" class="mr-2 icon-dim" />
              <span>Số 1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội</span>
            </div>
            <div class="contact-item">
              <v-icon icon="mdi-phone-outline" size="18" class="mr-2 icon-dim" />
              <span>+84 24 3869 6056</span>
            </div>
            <div class="contact-item">
              <v-icon icon="mdi-email-outline" size="18" class="mr-2 icon-dim" />
              <span>contact@thuvienso.vn</span>
            </div>
          </div>
        </div>

        <!-- Column 2: Quick Links -->
        <div class="footer-col animate-on-scroll fade-up" style="transition-delay: 150ms;">
          <h3>Liên kết nhanh</h3>
          <nav class="footer-links">
            <a href="#home" class="footer-link-item" @click="scrollToSection('#home', $event)">Trang chủ</a>
            <a href="#features" class="footer-link-item" @click="scrollToSection('#features', $event)">Tính năng</a>
            <a href="#books" class="footer-link-item" @click="scrollToSection('#books', $event)">Sách mới</a>
            <a href="#architecture" class="footer-link-item" @click="scrollToSection('#architecture', $event)">Kiến trúc</a>
            <a href="#stats" class="footer-link-item" @click="scrollToSection('#stats', $event)">Thống kê</a>
          </nav>
        </div>

        <!-- Column 3: Follow Us -->
        <div class="footer-col animate-on-scroll fade-up" style="transition-delay: 300ms;">
          <h3>Theo dõi chúng tôi</h3>
          <div class="social-links">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" class="social-icon-btn" aria-label="Facebook">
              <v-icon icon="mdi-facebook" size="22" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" class="social-icon-btn" aria-label="LinkedIn">
              <v-icon icon="mdi-linkedin" size="22" />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" class="social-icon-btn" aria-label="YouTube">
              <v-icon icon="mdi-youtube" size="22" />
            </a>
          </div>
        </div>
      </div>
      
      <!-- Divider -->
      <div class="footer-divider home-container"></div>
      
      <!-- Bottom Section -->
      <div class="home-container footer-bottom">
        <router-link to="/" class="footer-logo" @click="route.path === '/' && scrollToSection('#home', $event)">
          <div class="brand-icon-mini">
            <v-icon icon="mdi-library" size="16" color="white" />
          </div>
          <span class="brand-text-mini">Thư viện Số</span>
        </router-link>
        <div class="copyright">
          © 2026 Thư viện Số. Mọi quyền được bảo lưu.
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'
import { useTheme } from 'vuetify'

const router = useRouter()
const route = useRoute()
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

const isScrolled = ref(false)
const mobileMenu = ref(false)
const searchKeyword = ref('')
const activeSection = ref('home')

function scrollToSection(selector, event) {
  if (event) event.preventDefault()
  
  const id = selector.substring(1)
  activeSection.value = id
  
  const target = document.querySelector(selector)
  if (target) {
    const header = document.querySelector('.home-header')
    const headerHeight = header ? header.offsetHeight : 80
    const elementPosition = target.getBoundingClientRect().top + window.scrollY
    const offsetPosition = elementPosition - headerHeight

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    })
  }
}

const displayRole = computed(() => {
  if (auth.role === 'Admin') return 'Quản trị viên'
  if (auth.role === 'Librarian') return 'Thủ thư'
  if (auth.role === 'Reader') return 'Độc giả'
  return auth.role || 'Người dùng'
})

const features = [
  {
    icon: 'mdi-book-open-page-variant-outline',
    title: 'Quản lý sách số',
    description: 'Lưu trữ thông tin sách số hóa, ảnh bìa UHD, tác giả, nhà xuất bản, bản in vật lý và trạng thái cho mượn.'
  },
  {
    icon: 'mdi-account-circle-outline',
    title: 'Quản lý độc giả',
    description: 'Số hóa mã độc giả, cấp tài khoản thẻ thư viện trực tuyến, gia hạn tự động và ghi nhận nhật ký hoạt động.'
  },
  {
    icon: 'mdi-swap-horizontal-circle-outline',
    title: 'Mượn trả hiện đại',
    description: 'Thủ tục mượn/trả quét trực tuyến nhanh gọn, kiểm tra hạn trả, tự động cảnh báo quá hạn qua hệ thống.'
  },
  {
    icon: 'mdi-google-analytics',
    title: 'Thống kê trực quan',
    description: 'Dashboard số liệu tức thời (Real-time), phân tích top sách ưa chuộng và tình hình phân phối sách thông minh.'
  }
]

const newBooks = [
  {
    title: 'Thiết Kế Đời Người',
    author: 'Bill Burnett',
    category: 'Khoa học',
    cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Tư Duy Nhanh Và Chậm',
    author: 'Daniel Kahneman',
    category: 'Kinh tế',
    cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Chuyển Đổi Số',
    author: 'Nhiều tác giả',
    category: 'Công nghệ',
    cover: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Suối Nguồn',
    author: 'Ayn Rand',
    category: 'Văn học',
    cover: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Nguyên Lý Kế Toán',
    author: 'ĐH Kinh tế',
    category: 'Giáo trình',
    cover: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=600&q=80'
  }
]

const stats = [
  { value: '10,000+', label: 'Đầu sách số hóa', icon: 'mdi-book-multiple-outline' },
  { value: '50,000+', label: 'Độc giả hoạt động', icon: 'mdi-account-multiple-outline' },
  { value: '2.5M+', label: 'Lượt đọc trực tuyến', icon: 'mdi-eye-circle-outline' }
]

const services = [
  {
    icon: 'mdi-database-outline',
    title: 'Catalog Service',
    description: 'Chuyên biệt hóa phân phối thông tin, ảnh bìa, dữ liệu ấn phẩm và trạng thái hiện diện vật lý.'
  },
  {
    icon: 'mdi-transit-transfer',
    title: 'Circulation Service',
    description: 'Quản trị toàn bộ vòng đời phiếu mượn trả, kiểm soát quá hạn, kết nối dữ liệu biên lai phạt.'
  },
  {
    icon: 'mdi-card-account-details-outline',
    title: 'Identity & Report',
    description: 'Xác thực tài khoản bằng JWT bảo mật, cấp thẻ thư viện QR, lập báo cáo thống kê trực quan.'
  },
  {
    icon: 'mdi-cloud-sync-outline',
    title: 'API Gateway',
    description: 'Điều phối lưu lượng Request, cân bằng tải thông minh và đảm bảo an toàn kết nối Microservices.'
  }
]

function goToApp() {
  if (['Admin', 'Librarian'].includes(auth.role)) {
    router.push('/app/dashboard')
    return
  }

  router.push('/app/books')
}

function logout() {
  auth.logout()
  router.push('/')
}

function goSearch() {
  const keywordVal = searchKeyword.value ? searchKeyword.value.trim() : ''
  if (auth.isLoggedIn) {
    if (auth.role === 'Reader') {
      router.push({ path: '/app/browse', query: { keyword: keywordVal } })
    } else {
      router.push({ path: '/app/books', query: { keyword: keywordVal } })
    }
    return
  }

  router.push({ path: '/catalog', query: { keyword: keywordVal } })
}

function handleScroll() {
  isScrolled.value = window.scrollY > 15
  
  if (window.scrollY < 120) {
    activeSection.value = 'home'
  }
  
  // Force active state on all bottom/footer animate-on-scroll elements when reaching bottom of page
  const isBottom = (window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 100)
  if (isBottom) {
    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
      el.classList.add('animate-active')
    })
  }
}

// Custom advanced Intersection Observer for Scroll Animations & Menu Tracking
let observer = null

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  handleScroll()

  // Setup observer
  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-active')
        
        // Update active menu section
        const id = entry.target.id
        if (id && ['features', 'books', 'stats', 'architecture'].includes(id)) {
          activeSection.value = id
        }
      }
    })
  }, {
    threshold: 0.15,
    rootMargin: '-80px 0px -40% 0px'
  })

  // Start observing
  document.querySelectorAll('.animate-on-scroll').forEach((el) => {
    observer.observe(el)
  })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  if (observer) {
    observer.disconnect()
  }
})
</script>

<style scoped>
/* Modern typography integration */
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

.home-page {
  min-height: 100vh;
  background: #F8FAFC;
  color: #0F172A;
  font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
  overflow-x: hidden;
  scroll-behavior: smooth;
}

.home-container {
  max-width: 1240px;
  margin: 0 auto;
  padding-left: 24px;
  padding-right: 24px;
}

/* ==========================================================================
   HEADER SECTION (GLASSMORPHIC & INTERACTIVE ACTIVE INDICATORS)
   ========================================================================== */
.home-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
  background: rgba(248, 250, 252, 0.72);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(226, 232, 240, 0.5);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.home-header-scrolled {
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.04);
  border-bottom-color: rgba(226, 232, 240, 0.8);
}

.header-inner {
  height: 76px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand {
  color: #0F172A;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  font-size: 20px;
  font-weight: 800;
  transition: transform 0.25s ease;
}

.brand:hover {
  transform: scale(1.05);
}

.brand-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #2563EB 0%, #06B6D4 100%);
  box-shadow: 0 6px 12px rgba(37, 99, 235, 0.15);
}

.brand-text {
  background: linear-gradient(135deg, #0F172A 0%, #2563EB 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.desktop-nav {
  display: flex;
  align-items: center;
  gap: 32px;
}

.nav-link {
  color: #64748B;
  text-decoration: none;
  font-weight: 600;
  font-size: 14.5px;
  position: relative;
  padding: 6px 0;
  transition: color 0.25s ease;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0%;
  height: 2px;
  background-color: #2563EB;
  border-radius: 99px;
  transition: width 0.25s ease;
}

.nav-link:hover {
  color: #2563EB;
}

.nav-link:hover::after,
.nav-link.active::after {
  width: 100%;
}

.nav-link.active {
  color: #2563EB;
  font-weight: 700;
}

.desktop-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-mini {
  text-align: right;
}

.user-name {
  font-weight: 700;
  color: #0F172A;
  font-size: 14.5px;
}

.user-role {
  font-size: 11.5px;
  color: #2563EB;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-top: 1px;
}

.enter-btn, .register-nav-btn {
  font-weight: 700 !important;
  text-transform: none !important;
  letter-spacing: -0.01em !important;
  box-shadow: 0 6px 15px rgba(37, 99, 235, 0.15) !important;
  transition: all 0.25s ease !important;
}

.enter-btn:hover, .register-nav-btn:hover {
  transform: translateY(-1.5px);
  box-shadow: 0 8px 20px rgba(37, 99, 235, 0.25) !important;
}

.login-nav-btn {
  font-weight: 700 !important;
  text-transform: none !important;
  letter-spacing: -0.01em !important;
  transition: all 0.25s ease !important;
}

.login-nav-btn:hover {
  background-color: rgba(37, 99, 235, 0.04) !important;
  transform: translateY(-1px);
}

.mobile-menu-btn {
  display: none;
}

.mobile-menu {
  display: none;
}

/* ==========================================================================
   HERO SECTION (ANIMATED GRADIENT COMPLEX CORES)
   ========================================================================== */
.hero-section {
  min-height: 720px;
  position: relative;
  display: flex;
  align-items: center;
  overflow: hidden;
  padding: 140px 0 100px;
}

.hero-bg {
  position: absolute;
  inset: 0;
  background: 
    radial-gradient(circle at 10% 15%, rgba(6, 182, 212, 0.2) 0%, transparent 40%),
    radial-gradient(circle at 85% 75%, rgba(37, 99, 235, 0.22) 0%, transparent 42%),
    linear-gradient(135deg, #0B0F19 0%, #111B35 50%, #070A11 100%);
  animation: bgMove 12s infinite alternate ease-in-out;
  z-index: 1;
}

@keyframes bgMove {
  0% { transform: scale(1); filter: hue-rotate(0deg); }
  100% { transform: scale(1.06); filter: hue-rotate(15deg); }
}

/* Drifting soft background bubbles */
.hero-particles {
  position: absolute;
  inset: 0;
  z-index: 2;
  overflow: hidden;
  pointer-events: none;
}

.bubble {
  position: absolute;
  border-radius: 999px;
  filter: blur(80px);
  opacity: 0.35;
}

.bubble-1 {
  top: 15%;
  left: 10%;
  width: 260px;
  height: 260px;
  background: rgba(37, 99, 235, 0.4);
  animation: float-bubble-slow 16s infinite alternate ease-in-out;
}

.bubble-2 {
  bottom: 10%;
  right: 15%;
  width: 320px;
  height: 320px;
  background: rgba(6, 182, 212, 0.35);
  animation: float-bubble-mid 12s infinite alternate-reverse ease-in-out;
}

.bubble-3 {
  top: 50%;
  left: 50%;
  width: 220px;
  height: 220px;
  background: rgba(139, 92, 246, 0.25);
  animation: float-bubble-slow 18s infinite alternate ease-in-out;
}

@keyframes float-bubble-slow {
  0% { transform: translate(0, 0); }
  100% { transform: translate(-30px, 40px); }
}

@keyframes float-bubble-mid {
  0% { transform: translate(0, 0); }
  100% { transform: translate(40px, -20px); }
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: rgba(248, 250, 252, 0.12);
  backdrop-filter: blur(1px);
  z-index: 2;
}

.hero-content {
  position: relative;
  z-index: 5;
  text-align: center;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #1E3A8A;
  background: rgba(219, 234, 254, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.5);
  padding: 8px 16px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 750;
  margin-bottom: 24px;
  box-shadow: 0 4px 15px rgba(37, 99, 235, 0.08);
}

.spinning-icon {
  animation: icon-spin 12s infinite linear;
}

@keyframes icon-spin {
  to { transform: rotate(360deg); }
}

.hero-title {
  max-width: 880px;
  margin: 0 auto 20px;
  font-size: clamp(38px, 5.5vw, 68px);
  line-height: 1.1;
  letter-spacing: -0.04em;
  font-weight: 800;
  color: #FFFFFF;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.gradient-text {
  background: linear-gradient(135deg, #3B82F6 20%, #06B6D4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-desc {
  max-width: 720px;
  margin: 0 auto 36px;
  color: #94A3B8;
  font-size: 17.5px;
  line-height: 1.65;
  font-weight: 500;
}

/* Sleek search panel growing on focus */
.hero-search {
  max-width: 720px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 8px 8px 20px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.35);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.hero-search:focus-within {
  background: rgba(255, 255, 255, 0.09);
  border-color: rgba(37, 99, 235, 0.4);
  box-shadow: 0 30px 70px rgba(37, 99, 235, 0.12), 0 0 0 4px rgba(37, 99, 235, 0.05);
  transform: translateY(-2px) scale(1.01);
}

/* Hero Decorative Glowing Tech Icons */
.hero-decor-icon {
  position: absolute;
  pointer-events: none;
  z-index: 10;
  transition: all 0.3s ease;
}

.cyan-glow {
  color: rgba(6, 182, 212, 0.7) !important;
  filter: drop-shadow(0 0 10px rgba(6, 182, 212, 0.6));
}

.purple-glow {
  color: rgba(168, 85, 247, 0.7) !important;
  filter: drop-shadow(0 0 10px rgba(168, 85, 247, 0.6));
}

.d-icon-1 {
  left: 4%;
  top: 15%;
  animation: float-slow-1 8s infinite ease-in-out;
}

.d-icon-2 {
  right: 5%;
  top: 8%;
  animation: float-slow-2 9s infinite ease-in-out;
}

.d-icon-3 {
  left: -2%;
  top: 40%;
  animation: rotate-slow 15s infinite linear;
}

.d-icon-4 {
  right: -3%;
  top: 36%;
  animation: float-slow-1 7.5s infinite ease-in-out;
}

.d-icon-5 {
  left: 1%;
  top: 62%;
  animation: float-slow-2 8.5s infinite ease-in-out;
}

.d-icon-6 {
  right: 0%;
  top: 59%;
  animation: rotate-slow 18s infinite linear;
}

.d-icon-7 {
  left: 8%;
  top: 84%;
  animation: float-slow-1 9.5s infinite ease-in-out;
}

.d-icon-8 {
  right: 9%;
  top: 81%;
  animation: float-slow-2 10s infinite ease-in-out;
}

@keyframes float-slow-1 {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-12px) rotate(5deg); }
}

@keyframes float-slow-2 {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-8px) rotate(-6deg); }
}

@keyframes rotate-slow {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 960px) {
  .hero-decor-icon {
    display: none;
  }
}

.search-icon-pulse {
  animation: pulse-search-icon 3s infinite ease-in-out;
}

@keyframes pulse-search-icon {
  0%, 100% { opacity: 0.7; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.1); }
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  color: #FFFFFF;
  font-size: 15.5px;
  min-width: 0;
  padding: 12px 0;
  font-weight: 500;
}

.search-input::placeholder {
  color: #64748B;
}

.search-submit-btn {
  font-weight: 700 !important;
  text-transform: none !important;
  letter-spacing: -0.01em !important;
  padding: 0 24px !important;
  height: 44px !important;
  transition: all 0.25s ease !important;
}

.hero-actions {
  margin-top: 24px;
  display: flex;
  justify-content: center;
  gap: 16px;
}

/* ==========================================================================
   MAIN LAYOUT & SCROLL REVEAL ANIMATIONS
   ========================================================================== */
.main-content {
  padding: 80px 0;
  position: relative;
}

.section-block {
  margin-bottom: 96px;
}

.mini-title {
  color: #2563EB;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin-bottom: 8px;
}

.section-heading {
  margin-bottom: 48px;
}

.heading-line {
  width: 44px;
  height: 3.5px;
  background: #2563EB;
  border-radius: 99px;
  margin: 12px auto;
}

.heading-line.text-start {
  margin: 12px 0;
}

.section-heading h2,
.section-title-row h2 {
  color: #0F172A;
  font-size: clamp(28px, 3.8vw, 38px);
  line-height: 1.25;
  letter-spacing: -0.03em;
  font-weight: 800;
  margin: 0;
}

.section-heading p,
.section-title-row p {
  color: #64748B;
  font-size: 15px;
  margin-top: 8px;
}

/* ==========================================================================
   FEATURE CARDS (Glow bar hover)
   ========================================================================== */
.feature-card {
  height: 100%;
  padding: 36px 28px;
  border-radius: 20px !important;
  background: #ffffff !important;
  border: 1px solid #F1F5F9 !important;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.015) !important;
  position: relative;
  overflow: hidden;
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1) !important;
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 45px rgba(37, 99, 235, 0.06) !important;
  border-color: #E2E8F0 !important;
}

.feature-icon {
  width: 50px;
  height: 50px;
  display: grid;
  place-items: center;
  border-radius: 14px;
  background: #EFF6FF;
  color: #2563EB;
  margin-bottom: 24px;
  transition: all 0.3s ease;
}

.feature-card:hover .feature-icon {
  background: #2563EB;
  color: #ffffff;
  transform: scale(1.05) rotate(5deg);
}

.feature-card h3 {
  color: #0F172A;
  font-size: 18.5px;
  font-weight: 700;
  margin-bottom: 12px;
}

.feature-card p {
  color: #64748B;
  line-height: 1.6;
  font-size: 14px;
}

/* Neon color line at bottom of feature cards appearing on hover */
.feature-glow-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 0px;
  background: linear-gradient(90deg, #2563EB, #06B6D4);
  transition: height 0.25s ease;
}

.feature-card:hover .feature-glow-bar {
  height: 3.5px;
}

/* ==========================================================================
   NEW BOOKS SECTION (3D Hover Scale)
   ========================================================================== */
.section-title-row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 40px;
}

.view-all-btn {
  font-weight: 700 !important;
  text-transform: none !important;
  letter-spacing: -0.01em !important;
  transition: all 0.2s ease !important;
}

.view-all-btn:hover {
  background-color: rgba(37, 99, 235, 0.04) !important;
}

.book-card {
  cursor: pointer;
}

.book-cover {
  position: relative;
  aspect-ratio: 2.1 / 3;
  border-radius: 16px;
  overflow: hidden;
  background: #EFF6FF;
  border: 1px solid #E2E8F0;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.05);
  margin-bottom: 14px;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.book-card:hover .book-cover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 45px rgba(37, 99, 235, 0.12);
}

.book-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.book-card:hover .book-cover img {
  transform: scale(1.05);
}

.book-hover {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  background: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(4px);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.book-card:hover .book-hover {
  opacity: 1;
}

.book-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background: rgba(255, 255, 255, 0.94);
  border: 1px solid #E2E8F0;
  color: #2563EB;
  border-radius: 8px;
  padding: 3px 8px;
  font-size: 11px;
  font-weight: 750;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.book-meta h4 {
  color: #0F172A;
  font-size: 14.5px;
  line-height: 1.35;
  font-weight: 700;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.2s ease;
}

.book-card:hover .book-meta h4 {
  color: #2563EB;
}

.book-meta p {
  color: #64748B;
  font-size: 13px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ==========================================================================
   STATS SECTION (COUNTER HIGHLIGHTS)
   ========================================================================== */
.stats-section {
  background: #EFF6FF;
  border-top: 1px solid rgba(226, 232, 240, 0.5);
  border-bottom: 1px solid rgba(226, 232, 240, 0.5);
  padding: 36px 0;
  margin-bottom: 96px;
  position: relative;
  overflow: hidden;
  width: 100%;
}

.stats-bg-decor {
  position: absolute;
  width: 400px;
  height: 400px;
  border-radius: 999px;
  background: radial-gradient(circle, rgba(37, 99, 235, 0.08) 0%, transparent 60%);
  top: -100px;
  left: -100px;
  pointer-events: none;
}

.marquee-container {
  overflow: hidden;
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;
}

.marquee-track {
  display: flex;
  width: max-content;
  animation: marquee-scroll 25s linear infinite;
}

.marquee-content {
  display: flex;
  align-items: center;
  justify-content: space-around;
  min-width: 100%;
  gap: 80px;
  padding-right: 80px;
}

.marquee-item {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
}

.stat-icon-wrapper {
  width: 52px;
  height: 52px;
  background: #ffffff;
  border-radius: 14px;
  display: grid;
  place-items: center;
  box-shadow: 0 6px 20px rgba(37, 99, 235, 0.05);
  border: 1px solid #E2E8F0;
  flex-shrink: 0;
}

.stat-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.stat-number {
  font-size: 28px;
  line-height: 1.1;
  font-weight: 800;
  color: #0F172A;
  letter-spacing: -0.02em;
  margin-bottom: 2px;
}

.stat-label {
  color: #64748B;
  font-size: 15px;
  font-weight: 600;
  white-space: nowrap;
}

@keyframes marquee-scroll {
  0% {
    transform: translateX(-50%);
  }
  100% {
    transform: translateX(0%);
  }
}

/* ==========================================================================
   MICROSERVICES ARCHITECTURE SECTION
   ========================================================================== */
.service-card {
  height: 100%;
  padding: 32px 24px;
  border-radius: 20px !important;
  background: #ffffff !important;
  border: 1px solid #F1F5F9 !important;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.015) !important;
  position: relative;
  overflow: hidden;
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1) !important;
}

.service-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 45px rgba(37, 99, 235, 0.06) !important;
  border-color: #E2E8F0 !important;
}

.service-icon-box {
  width: 50px;
  height: 50px;
  display: grid;
  place-items: center;
  border-radius: 14px;
  background: #F8FAFC;
  color: #2563EB;
  margin-bottom: 20px;
  border: 1px solid #E2E8F0;
  transition: all 0.3s ease;
}

.service-card:hover .service-icon-box {
  background: #2563EB;
  color: #ffffff;
  border-color: #2563EB;
}

.service-card h3 {
  color: #0F172A;
  font-size: 17.5px;
  font-weight: 700;
  margin-bottom: 10px;
}

.service-card p {
  color: #64748B;
  line-height: 1.6;
  font-size: 13.5px;
}

/* Tech circuits layout detail */
.tech-dots {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  gap: 4px;
}

.tech-dots span {
  width: 4px;
  height: 4px;
  background: #E2E8F0;
  border-radius: 99px;
  transition: all 0.25s ease;
}

.service-card:hover .tech-dots span {
  background: #2563EB;
}

.service-card:hover .tech-dots span:nth-child(1) {
  box-shadow: 0 0 6px #2563EB;
}

/* ==========================================================================
   FOOTER SECTION
   ========================================================================== */
.home-footer {
  background: linear-gradient(135deg, #F8FAFC 0%, #EEF2FF 50%, #F5F3FF 100%); /* Gradient xanh tím nhẹ */
  border-top: 1px solid #E2E8F0;
  padding: 80px 0 40px;
  color: #475569; /* Chữ màu tối vừa phải */
}

.footer-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr 1fr;
  gap: 48px;
}

.footer-col h3 {
  color: #0F172A; /* Tiêu đề màu tối rõ ràng */
  font-weight: 700;
  margin-bottom: 24px;
  font-size: 16px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.contact-item {
  display: flex;
  align-items: center;
  font-size: 14.5px;
  line-height: 1.5;
  color: #475569; /* Chữ màu tối vừa phải */
}

.icon-dim {
  color: #2563EB !important; /* Icon màu xanh primary tạo điểm nhấn */
}

.footer-links {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.footer-link-item {
  display: block;
  color: #475569; /* Màu tối vừa phải */
  text-decoration: none;
  font-size: 14.5px;
  font-weight: 500;
  width: fit-content;
  transition: all 0.25s ease;
  position: relative;
}

.footer-link-item::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0%;
  height: 1.5px;
  background-color: #2563EB; /* Gạch chân màu primary */
  transition: width 0.25s ease;
}

.footer-link-item:hover {
  color: #2563EB; /* Hover đổi màu xanh primary */
}

.footer-link-item:hover::after {
  width: 100%;
}

.social-links {
  display: flex;
  gap: 16px;
}

.social-icon-btn {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: #FFFFFF; /* Nền trắng */
  color: #475569;
  display: grid;
  place-items: center;
  border: 1px solid #E2E8F0;
  box-shadow: 0 4px 10px rgba(15, 23, 42, 0.02);
  transition: all 0.3s ease;
  text-decoration: none;
}

.social-icon-btn:hover {
  background: #2563EB; /* Hover nền xanh primary */
  color: #FFFFFF; /* Icon trắng */
  border-color: #2563EB;
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(37, 99, 235, 0.2);
}

.footer-divider {
  height: 1px;
  background: #E2E8F0;
  margin: 40px auto 30px;
}

.footer-logo {
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: transform 0.25s ease;
}

.footer-logo:hover {
  transform: scale(1.05);
}

.brand-icon-mini {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #2563EB 0%, #06B6D4 100%);
  box-shadow: 0 4px 8px rgba(37, 99, 235, 0.12);
}

.brand-text-mini {
  font-size: 14.5px;
  font-weight: 700;
  color: #475569;
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.copyright {
  color: #64748B;
  font-size: 13.5px;
  font-weight: 500;
}

/* ==========================================================================
   ENTRANCE ANIMATIONS & SHIMMER EFFECTS
   ========================================================================== */
.animate-entrance {
  opacity: 0;
  transform: translateY(18px);
  animation: slideEntrance 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.delay-1 { animation-delay: 0.1s; }
.delay-2 { animation-delay: 0.2s; }
.delay-3 { animation-delay: 0.3s; }
.delay-4 { animation-delay: 0.4s; }
.delay-5 { animation-delay: 0.5s; }

@keyframes slideEntrance {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Scroll animated trigger state classes */
.animate-on-scroll {
  opacity: 0;
  transition: all 0.8s ease-in-out;
}

.animate-on-scroll.fade-up {
  transform: translateY(30px);
}

.animate-on-scroll.scale-up {
  transform: scale(0.96);
}

.animate-on-scroll.animate-active {
  opacity: 1;
}

.animate-on-scroll.animate-active.fade-up {
  transform: translateY(0);
}

.animate-on-scroll.animate-active.scale-up {
  transform: scale(1);
}

/* Shimmer sweeper sweep */
.btn-shimmer {
  position: relative;
  overflow: hidden;
}

.btn-shimmer::before {
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

.btn-shimmer:hover::before {
  left: 100%;
  transition: all 0.65s ease;
}

/* Slide Down Menu animation for mobile menu */
.slide-down-menu-enter-active, .slide-down-menu-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-down-menu-enter-from, .slide-down-menu-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* ==========================================================================
   RESPONSIVENESS CORES
   ========================================================================== */
@media (max-width: 960px) {
  .home-container {
    padding-left: 20px;
    padding-right: 20px;
  }

  .desktop-nav,
  .desktop-actions {
    display: none;
  }

  .mobile-menu-btn {
    display: inline-flex;
    color: #FFFFFF !important; /* Stand out on dark hero background */
  }

  /* Make brand and menu toggle white on scroll transition for mobile header compatibility */
  .home-header-scrolled .mobile-menu-btn {
    color: #0F172A !important;
  }

  .mobile-menu {
    display: block;
    padding-bottom: 24px;
    background: #ffffff;
    border-radius: 0 0 16px 16px;
    box-shadow: 0 10px 30px rgba(15, 23, 42, 0.1);
  }

  .mobile-menu a {
    display: block;
    color: #0F172A;
    text-decoration: none;
    font-weight: 700;
    padding: 14px 0;
    border-bottom: 1px solid #F1F5F9;
    font-size: 15px;
  }

  .mobile-menu-actions {
    display: grid;
    gap: 12px;
    margin-top: 18px;
  }

  .hero-section {
    min-height: 640px;
    padding: 120px 0 80px;
  }

  .hero-search {
    flex-direction: column;
    align-items: stretch;
    padding: 16px;
  }

  .hero-search input {
    width: 100%;
    padding: 8px 0;
  }

  .search-submit-btn {
    width: 100%;
  }

  .section-title-row {
    align-items: flex-start;
    flex-direction: column;
    gap: 16px;
  }

  .footer-grid {
    grid-template-columns: 1fr;
    gap: 32px;
  }
}
</style>
