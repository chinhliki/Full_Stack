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

    <!-- Stats Cards Row -->
    <v-row>
      <!-- Total Readers -->
      <v-col cols="12" sm="6" md="3">
        <v-card class="stat-card pa-5 d-flex align-center" rounded="xl">
          <div class="stat-info">
            <div class="stat-label text-uppercase mb-1">Tổng độc giả</div>
            <div class="stat-value text-primary">{{ dashboard.totalReaders }}</div>
          </div>
          <v-spacer />
          <div class="stat-icon-wrapper-glow cyan-glowing-icon">
            <v-icon icon="mdi-account-group" size="30" />
          </div>
        </v-card>
      </v-col>

      <!-- Total Borrowed -->
      <v-col cols="12" sm="6" md="3">
        <v-card class="stat-card pa-5 d-flex align-center" rounded="xl">
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
        <v-card class="stat-card pa-5 d-flex align-center" rounded="xl">
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
        <v-card class="stat-card pa-5 d-flex align-center" rounded="xl">
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

    <v-card class="table-card mt-6" :class="{ 'table-card-loading': loading }" rounded="xl">
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
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { reportApi } from '../../api/reportApi'

const loading = ref(false)
const dashboard = ref({
  totalReaders: 0,
  totalBorrowed: 0,
  totalReturned: 0,
  currentlyBorrowing: 0,
  totalFineAmount: 0,
  topBooks: []
})

async function loadDashboard() {
  loading.value = true
  try {
    const res = await reportApi.dashboard()
    dashboard.value = res.data
  } catch (err) {
    console.error('Không tải được số liệu dashboard:', err)
  } finally {
    loading.value = false
  }
}

function formatMoney(value) {
  return new Intl.NumberFormat('vi-VN').format(value || 0) + ' đ'
}

onMounted(loadDashboard)
</script>

<style scoped>
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
</style>