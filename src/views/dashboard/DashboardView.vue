<template>
  <div>
    <!-- Dashboard Header -->
    <div class="d-flex align-center mb-6">
      <div>
        <h2 class="page-title font-weight-black text-secondary">Dashboard Thống Kê</h2>
        <p class="page-subtitle">Xem nhanh các chỉ số hoạt động của thư viện số</p>
      </div>
      <v-spacer />
      <v-btn
        color="primary"
        prepend-icon="mdi-refresh"
        variant="tonal"
        rounded="xl"
        class="font-weight-bold"
        :loading="loading"
        @click="loadDashboard"
      >
        Tải lại số liệu
      </v-btn>
    </div>

    <v-alert
      v-if="loadError"
      type="error"
      variant="tonal"
      rounded="lg"
      class="mb-5"
      closable
      @click:close="loadError = ''"
    >
      {{ loadError }}
    </v-alert>

    <!-- Stats Cards Row -->
    <v-row>
      <!-- Total Readers -->
      <v-col cols="12" sm="6" md="3">
        <v-card
          class="stat-card pa-5 d-flex align-center cursor-pointer"
          rounded="xl"
          @click="router.push('/app/readers')"
        >
          <div class="stat-info">
            <div class="stat-label text-uppercase mb-1">Tổng độc giả</div>
            <div class="stat-value text-primary">{{ dashboard.totalReaders }}</div>
          </div>
          <v-spacer />
          <div class="stat-icon-wrapper-glow info-glowing-icon">
            <v-icon icon="mdi-account-group" size="30" />
          </div>
        </v-card>
      </v-col>

      <!-- Total Borrowed -->
      <v-col cols="12" sm="6" md="3">
        <v-card
          class="stat-card pa-5 d-flex align-center cursor-pointer"
          rounded="xl"
          @click="router.push('/app/borrows')"
        >
          <div class="stat-info">
            <div class="stat-label text-uppercase mb-1">Tổng lượt mượn</div>
            <div class="stat-value text-purple">{{ dashboard.totalBorrowed }}</div>
          </div>
          <v-spacer />
          <div class="stat-icon-wrapper-glow purple-glowing-icon">
            <v-icon icon="mdi-book-arrow-up-outline" size="30" />
          </div>
        </v-card>
      </v-col>

      <!-- Total Returned -->
      <v-col cols="12" sm="6" md="3">
        <v-card
          class="stat-card pa-5 d-flex align-center cursor-pointer"
          rounded="xl"
          @click="router.push('/app/borrows')"
        >
          <div class="stat-info">
            <div class="stat-label text-uppercase mb-1">Tổng lượt trả</div>
            <div class="stat-value text-teal">{{ dashboard.totalReturned }}</div>
          </div>
          <v-spacer />
          <div class="stat-icon-wrapper-glow teal-glowing-icon">
            <v-icon icon="mdi-book-arrow-down-outline" size="30" />
          </div>
        </v-card>
      </v-col>

      <!-- Total Fines -->
      <v-col cols="12" sm="6" md="3">
        <v-card
          class="stat-card pa-5 d-flex align-center cursor-pointer"
          rounded="xl"
          @click="router.push('/app/fines')"
        >
          <div class="stat-info">
            <div class="stat-label text-uppercase mb-1">Tổng tiền phạt</div>
            <div class="stat-value text-amber-darken-3">{{ formatMoney(dashboard.totalFineAmount) }}</div>
          </div>
          <v-spacer />
          <div class="stat-icon-wrapper-glow amber-glowing-icon">
            <v-icon icon="mdi-cash-multiple" size="30" />
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Charts Section -->
    <v-row class="mt-6">
      <!-- Line Chart: Borrow / Return trend -->
      <v-col cols="12" lg="8">
        <v-card class="chart-card pa-5" rounded="xl">
          <div class="d-flex align-center mb-4">
            <v-icon icon="mdi-chart-line" color="primary" class="mr-2" />
            <span class="chart-title font-weight-black text-secondary">Xu hướng mượn & trả theo tháng</span>
            <v-spacer />
            <v-select
              v-model="lineChartYear"
              :items="yearOptions"
              density="compact"
              variant="outlined"
              hide-details
              rounded="lg"
              style="max-width: 110px"
              @update:model-value="loadBorrowReturnChart"
            />
          </div>
          <div v-if="chartLoading" class="chart-skeleton" />
          <BorrowReturnLineChart
            v-else
            :labels="lineChart.labels"
            :borrow-data="lineChart.borrowData"
            :return-data="lineChart.returnData"
            :is-dark="isDark"
          />
        </v-card>
      </v-col>

      <!-- Donut Chart: Top sách được mượn -->
      <v-col cols="12" lg="4">
        <v-card class="chart-card pa-5 h-100" rounded="xl">
          <div class="d-flex align-center mb-4">
            <v-icon icon="mdi-chart-donut" color="purple" class="mr-2" />
            <span class="chart-title font-weight-black text-secondary">Tỷ lệ mượn theo thể loại sách</span>
          </div>
          <div v-if="chartLoading" class="chart-skeleton" />
          <BookCategoryDonutChart
            v-else
            :labels="donutChart.labels"
            :data="donutChart.data"
            :is-dark="isDark"
          />
        </v-card>
      </v-col>
    </v-row>

    <!-- Bar Chart: Fine Revenue -->
    <v-row class="mt-4">
      <v-col cols="12">
        <v-card class="chart-card pa-5" rounded="xl">
          <div class="d-flex align-center mb-4">
            <v-icon icon="mdi-chart-bar" color="amber-darken-2" class="mr-2" />
            <span class="chart-title font-weight-black text-secondary">Doanh thu tiền phạt theo tháng</span>
            <v-spacer />
            <v-select
              v-model="barChartYear"
              :items="yearOptions"
              density="compact"
              variant="outlined"
              hide-details
              rounded="lg"
              style="max-width: 110px"
              @update:model-value="loadFineRevenueChart"
            />
          </div>
          <div v-if="chartLoading" class="chart-skeleton" />
          <FineRevenueBarChart
            v-else
            :labels="barChart.labels"
            :data="barChart.data"
            :is-dark="isDark"
          />
        </v-card>
      </v-col>
    </v-row>

    <!-- Side-by-side Tables Section -->
    <v-row class="mt-4 ga-0">
      <!-- Left Column: Top Popular Books -->
      <v-col cols="12" md="6" class="pr-md-3 pb-6">
        <v-card class="table-card h-100" :class="{ 'table-card-loading': loading }" rounded="xl">
          <v-progress-linear
            v-show="loading"
            indeterminate
            color="primary"
            height="3"
            class="position-absolute"
            style="z-index: 2; top: 0; left: 0; right: 0;"
          />
          <div class="pa-5 border-bottom bg-gradient-title d-flex align-center">
            <v-icon icon="mdi-fire" color="orange" class="mr-2" />
            <v-card-title class="pa-0 font-weight-black text-secondary text-h6">
              Top Sách Phổ Biến Nhất
            </v-card-title>
          </div>

          <v-table class="premium-table">
            <thead>
              <tr>
                <th>Tên sách</th>
                <th class="text-right">Số lượt mượn</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(book, index) in dashboard.topBooks" :key="book.bookId">
                <td class="font-weight-medium">
                  <v-icon icon="mdi-book-open-outline" size="18" color="primary" class="mr-3 table-book-icon" />
                  <span class="book-rank-badge mr-2" :class="'rank-' + (index + 1)">{{ index + 1 }}</span>
                  {{ book.bookTitle }}
                </td>
                <td class="text-right font-weight-black text-secondary">
                  {{ book.borrowCount }} <span class="text-caption text-grey">lượt</span>
                </td>
              </tr>
              <tr v-if="dashboard.topBooks.length === 0">
                <td colspan="2" class="text-center pa-6 text-grey">
                  Không có dữ liệu thống kê sách phổ biến
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </v-col>

      <!-- Right Column: Fined Readers List -->
      <v-col cols="12" md="6" class="pl-md-3 pb-6">
        <v-card class="table-card h-100" :class="{ 'table-card-loading': loading }" rounded="xl">
          <v-progress-linear
            v-show="loading"
            indeterminate
            color="primary"
            height="3"
            class="position-absolute"
            style="z-index: 2; top: 0; left: 0; right: 0;"
          />
          <div class="pa-5 border-bottom bg-gradient-title d-flex align-center">
            <v-icon icon="mdi-cash-alert" color="error" class="mr-2" />
            <v-card-title class="pa-0 font-weight-black text-secondary text-h6">
              Độc Giả Phát Sinh Phí Phạt
            </v-card-title>
          </div>

          <v-table class="premium-table">
            <thead>
              <tr>
                <th>Độc giả</th>
                <th>Tình trạng</th>
                <th class="text-right">Phí phạt</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, index) in finedReaders"
                :key="index"
                class="cursor-pointer"
                @click="goToFineOrOverdue(item.type)"
              >
                <td class="font-weight-medium">
                  <v-icon icon="mdi-account-alert-outline" size="18" color="error" class="mr-3 table-book-icon" />
                  {{ item.readerName }}
                </td>
                <td>
                  <v-chip
                    :color="item.type === 'Quá hạn' ? 'warning' : 'error'"
                    size="x-small"
                    variant="tonal"
                    class="font-weight-bold"
                  >
                    {{ item.type }}
                  </v-chip>
                </td>
                <td class="text-right font-weight-black text-error">
                  {{ formatMoney(item.amount) }}
                </td>
              </tr>
              <tr v-if="finedReaders.length === 0">
                <td colspan="3" class="text-center pa-6 text-grey">
                  Không có độc giả nào phát sinh phí phạt
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTheme } from 'vuetify'
import { reportApi } from '../../api/reportApi'
import { borrowApi } from '../../api/borrowApi'
import BorrowReturnLineChart from '../../components/charts/BorrowReturnLineChart.vue'
import BookCategoryDonutChart from '../../components/charts/BookCategoryDonutChart.vue'
import FineRevenueBarChart from '../../components/charts/FineRevenueBarChart.vue'

const router = useRouter()
const theme = useTheme()
const isDark = computed(() => theme.global.name.value === 'libraryDarkTheme')
const loading = ref(false)
const chartLoading = ref(false)

// --- Chart state ---
const currentYear = new Date().getFullYear()
const yearOptions = Array.from({ length: 4 }, (_, i) => currentYear - i)
const lineChartYear = ref(currentYear)
const barChartYear = ref(currentYear)

const MONTH_LABELS = ['T1','T2','T3','T4','T5','T6','T7','T8','T9','T10','T11','T12']

const lineChart = ref({ labels: MONTH_LABELS, borrowData: [], returnData: [] })
const donutChart = ref({ labels: [], data: [] })
const barChart = ref({ labels: MONTH_LABELS, data: [] })
const dashboard = ref({
  totalReaders: 0,
  totalBorrowed: 0,
  totalReturned: 0,
  currentlyBorrowing: 0,
  totalFineAmount: 0,
  topBooks: []
})

const fines = ref([])
const overdueBorrows = ref([])
const finePerLateDay = ref(5000)
const loadError = ref('')

async function loadSettings() {
  try {
    const res = await borrowApi.getSettings()
    finePerLateDay.value = Number(res.data.finePerLateDay || 5000)
  } catch (err) {
    console.warn('Không tải được cấu hình mượn trả, dùng mặc định 5000 đ/ngày:', err)
  }
}

async function loadDashboard() {
  loading.value = true
  loadError.value = ''
  loadSettings()
  const [dashResult, finesResult] = await Promise.allSettled([
    reportApi.dashboard(),
    loadFinesAndOverdue()
  ])
  if (dashResult.status === 'fulfilled') {
    dashboard.value = dashResult.value.data
    loadCharts(dashResult.value.data?.topBooks ?? [])
  } else {
    console.error('Không tải được số liệu dashboard:', dashResult.reason)
    loadError.value = 'Không tải được số liệu tổng quan. Vui lòng thử lại.'
  }
  if (finesResult.status === 'rejected') {
    console.error('Không tải được danh sách công nợ và quá hạn:', finesResult.reason)
    const base = loadError.value
    loadError.value = base
      ? base + ' Dữ liệu công nợ/quá hạn cũng không tải được.'
      : 'Không tải được dữ liệu công nợ và quá hạn.'
  }
  loading.value = false
}

async function loadFinesAndOverdue() {
  const [finesRes, overdueRes] = await Promise.all([
    borrowApi.getFines(),
    borrowApi.getOverdue()
  ])
  fines.value = Array.isArray(finesRes.data) ? finesRes.data : (finesRes.data?.items ?? [])
  overdueBorrows.value = Array.isArray(overdueRes.data) ? overdueRes.data : (overdueRes.data?.items ?? [])
  buildFineBarFromFines()
}

function getLateDays(dueDate) {
  if (!dueDate) return 0
  const due = new Date(dueDate)
  const now = new Date()
  const diff = now.getTime() - due.getTime()
  if (diff <= 0) return 0
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

const finedReaders = computed(() => {
  const map = {}

  // 1. Process finalized unpaid fines — key by readerId to avoid same-name collisions
  if (Array.isArray(fines.value)) {
    fines.value.forEach(item => {
      if (!item.isFinePaid && Number(item.fineAmount || 0) > 0) {
        const key = `${item.readerId || item.readerName}_Unpaid`
        if (!map[key]) {
          map[key] = { readerName: item.readerName, type: 'Nợ phí phạt', amount: 0 }
        }
        map[key].amount += Number(item.fineAmount)
      }
    })
  }

  // 2. Process active overdue borrows — key by readerId to avoid same-name collisions
  if (Array.isArray(overdueBorrows.value)) {
    overdueBorrows.value.forEach(item => {
      const lateDays = getLateDays(item.dueDate)
      if (lateDays > 0) {
        const estimatedFine = Number(item.fineAmount || 0) > 0
          ? Number(item.fineAmount)
          : lateDays * finePerLateDay.value

        const key = `${item.readerId || item.readerName}_Overdue`
        if (!map[key]) {
          map[key] = { readerName: item.readerName, type: 'Quá hạn', amount: 0 }
        }
        map[key].amount += estimatedFine
      }
    })
  }

  return Object.values(map)
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 10)
})

// ---- Chart loaders ----

async function loadBorrowReturnChart() {
  try {
    const res = await reportApi.borrowReturn({ year: lineChartYear.value })
    const rows = Array.isArray(res.data) ? res.data : (res.data?.items ?? [])
    const borrowArr = Array(12).fill(0)
    const returnArr = Array(12).fill(0)
    rows.forEach(r => {
      const m = (r.month ?? r.Month ?? 1) - 1
      if (m >= 0 && m < 12) {
        borrowArr[m] = r.borrowCount ?? r.BorrowCount ?? 0
        returnArr[m] = r.returnCount ?? r.ReturnCount ?? 0
      }
    })
    lineChart.value = { labels: MONTH_LABELS, borrowData: borrowArr, returnData: returnArr }
  } catch {
    lineChart.value = { labels: MONTH_LABELS, borrowData: [], returnData: [] }
  }
}

async function loadCategoryStatsChart() {
  try {
    const res = await reportApi.categoryStats({ year: lineChartYear.value })
    const rows = Array.isArray(res.data) ? res.data : (res.data?.items ?? [])
    if (rows.length === 0) {
      donutChart.value = { labels: ['Chưa phân loại'], data: [0] }
    } else {
      donutChart.value = {
        labels: rows.map(r => r.category ?? 'Chưa phân loại'),
        data: rows.map(r => r.borrowCount ?? 0)
      }
    }
  } catch (err) {
    console.error('Không tải được thống kê thể loại:', err)
    donutChart.value = { labels: [], data: [] }
  }
}

function buildFineBarFromFines() {
  const arr = Array(12).fill(0)
  if (Array.isArray(fines.value)) {
    fines.value.forEach(item => {
      const raw = item.returnDate ?? item.borrowDate ?? item.createdAt
      if (!raw) return
      const d = new Date(raw)
      if (d.getFullYear() !== barChartYear.value) return
      const m = d.getMonth()
      arr[m] += Number(item.fineAmount || 0)
    })
  }
  barChart.value = { labels: MONTH_LABELS, data: arr }
}

async function loadFineRevenueChart() {
  try {
    const res = await reportApi.fineRevenue({ year: barChartYear.value })
    const rows = Array.isArray(res.data) ? res.data : (res.data?.items ?? [])
    if (rows.length === 0) {
      buildFineBarFromFines()
    } else {
      const arr = Array(12).fill(0)
      rows.forEach(r => {
        const m = (r.month ? parseInt(r.month.split('-')[1]) : r.Month ?? 1) - 1
        if (m >= 0 && m < 12) {
          arr[m] = Number(r.totalFine ?? r.TotalFine ?? 0)
        }
      })
      barChart.value = { labels: MONTH_LABELS, data: arr }
    }
  } catch (err) {
    console.error('Không tải được doanh thu tiền phạt từ API, dùng dữ liệu tính toán tại chỗ:', err)
    buildFineBarFromFines()
  }
}

async function loadCharts(topBooks) {
  chartLoading.value = true
  await Promise.allSettled([
    loadBorrowReturnChart(),
    loadCategoryStatsChart(),
    loadFineRevenueChart()
  ])
  chartLoading.value = false
}

function goToFineOrOverdue(type) {
  if (type === 'Quá hạn') {
    router.push('/app/overdue')
  } else {
    router.push('/app/fines')
  }
}

function formatMoney(value) {
  return new Intl.NumberFormat('vi-VN').format(value || 0) + ' đ'
}

onMounted(loadDashboard)
</script>

<style scoped>
.chart-card {
  border: 1px solid rgba(226, 232, 240, 0.9) !important;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.07) !important;
  transition: box-shadow 0.3s ease;
}

.chart-card:hover {
  box-shadow: 0 24px 52px rgba(15, 23, 42, 0.12) !important;
}

.chart-title {
  font-size: 15px;
  letter-spacing: -0.02em;
}

.chart-skeleton {
  height: 300px;
  border-radius: 12px;
  background: linear-gradient(90deg, rgba(226,232,240,0.4) 25%, rgba(241,245,249,0.7) 50%, rgba(226,232,240,0.4) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.bg-gradient-title {
  background: linear-gradient(135deg, #EEF2FF 0%, #F5F3FF 100%);
  border-bottom: 1px solid rgba(226, 232, 240, 0.8) !important;
}

.premium-table :deep(.v-table__wrapper) {
  background: linear-gradient(135deg, rgba(238, 242, 255, 0.15) 0%, rgba(245, 243, 255, 0.15) 100%) !important;
}

.premium-table tbody tr {
  transition: all 0.25s ease;
}

.premium-table tbody tr:hover {
  background: linear-gradient(90deg, rgba(37, 99, 235, 0.04) 0%, rgba(168, 85, 247, 0.04) 100%) !important;
}

.premium-table tbody tr:hover .table-book-icon {
  transform: scale(1.2) rotate(10deg);
  color: #8B5CF6 !important;
}

.book-rank-badge {
  display: inline-flex;
  width: 22px;
  height: 22px;
  border-radius: 6px;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 800;
  background: rgba(148, 163, 184, 0.1);
  color: #64748B;
}

.rank-1 {
  background: rgba(251, 191, 36, 0.2);
  color: #D97706;
}

.rank-2 {
  background: rgba(148, 163, 184, 0.2);
  color: #475569;
}

.rank-3 {
  background: rgba(180, 83, 9, 0.2);
  color: #B45309;
}

.table-book-icon {
  transition: all 0.3s ease;
}

.cursor-pointer {
  cursor: pointer !important;
}
</style>