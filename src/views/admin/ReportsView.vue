<template>
  <div>
    <!-- Page header -->
    <div class="d-flex align-center justify-between mb-6 flex-wrap ga-3">
      <div>
        <h2 class="page-title font-weight-black text-secondary">Báo cáo &amp; thống kê</h2>
        <p class="page-subtitle">Xem và xuất các chỉ số chi tiết hoạt động của thư viện theo từng năm</p>
      </div>
      <v-spacer />
      <v-btn
        color="success"
        variant="tonal"
        prepend-icon="mdi-file-excel-outline"
        rounded="xl"
        class="font-weight-bold"
        :disabled="!rows.length"
        @click="exportCsv"
      >
        Xuất Excel (CSV)
      </v-btn>
    </div>

    <v-alert
      v-if="message"
      type="error"
      variant="tonal"
      rounded="lg"
      class="mb-6"
      closable
      @click:close="message = ''"
    >
      {{ message }}
    </v-alert>

    <v-row>
      <!-- Config Sidebar -->
      <v-col cols="12" md="4" lg="3">
        <v-card class="table-card pa-6" rounded="xl">
          <div class="d-flex align-center mb-6">
            <div class="stat-icon-wrapper-glow info-glowing-icon mr-3">
              <v-icon icon="mdi-tune-variant" size="20" />
            </div>
            <span class="text-subtitle-1 font-weight-black text-secondary">Cấu hình báo cáo</span>
          </div>

          <div class="mb-4">
            <span class="text-caption font-weight-bold text-grey-darken-1 mb-2 d-block">LOẠI BÁO CÁO</span>
            <v-select
              v-model="reportType"
              :items="reportTypeOptions"
              item-title="label"
              item-value="value"
              density="comfortable"
              variant="outlined"
              rounded="lg"
              hide-details
            />
          </div>

          <div class="mb-5">
            <span class="text-caption font-weight-bold text-grey-darken-1 mb-2 d-block">NĂM THỐNG KÊ</span>
            <v-select
              v-model="year"
              :items="yearOptions"
              density="comfortable"
              variant="outlined"
              rounded="lg"
              hide-details
            />
          </div>

          <v-btn
            block
            color="primary"
            rounded="xl"
            class="font-weight-bold shadow-sm"
            :loading="loading"
            @click="loadReport"
          >
            Cập nhật dữ liệu
          </v-btn>

          <!-- Summary Box -->
          <v-fade-transition>
            <v-card v-if="rows.length" class="mt-6 pa-4 bg-primary rounded-xl text-white overflow-hidden shadow-sm" style="position: relative;">
              <div class="text-caption text-white-50 font-weight-bold uppercase mb-1">{{ summaryLabel }}</div>
              <div class="text-h4 font-weight-black text-white mb-1">{{ summaryValue }}</div>
              <div class="text-caption text-warning font-weight-bold">{{ summaryCaption }}</div>
            </v-card>
          </v-fade-transition>
        </v-card>
      </v-col>

      <!-- Main Result Card -->
      <v-col cols="12" md="8" lg="9">
        <v-card class="table-card pa-6" rounded="xl" style="min-height: 380px;">
          <div class="d-flex align-center justify-between mb-6">
            <span class="text-h6 font-weight-black text-secondary">{{ activeReportLabel }} - Năm {{ year }}</span>
          </div>

          <v-divider class="mb-6" />

          <!-- Loading -->
          <div v-if="loading" class="d-flex flex-column align-center justify-center py-12">
            <v-progress-circular indeterminate color="primary" size="48" />
            <span class="mt-4 text-grey-darken-1 text-caption">Đang tổng hợp dữ liệu...</span>
          </div>

          <!-- Empty state -->
          <div v-else-if="!rows.length" class="d-flex flex-column align-center justify-center py-12 text-center text-grey">
            <v-icon icon="mdi-chart-line" size="56" color="grey-lighten-1" class="mb-3" />
            <p class="text-subtitle-2 font-weight-bold">Chưa có dữ liệu thống kê</p>
            <p class="text-caption">Hãy chọn loại báo cáo bên trái và nhấn "Cập nhật dữ liệu"</p>
          </div>

          <!-- Content: Borrow/Return -->
          <div v-else-if="reportType === 'borrowReturn'" class="d-flex flex-column ga-6">
            <div v-for="m in rows" :key="m.month" class="pb-3 border-b">
              <div class="d-flex align-center justify-between mb-2">
                <span class="font-weight-black text-secondary">{{ m.monthName }}</span>
                <span class="text-caption font-weight-bold text-grey">
                  {{ m.borrowCount }} mượn / {{ m.returnCount }} trả
                </span>
              </div>
              <v-row dense>
                <v-col cols="12" sm="6">
                  <div class="d-flex align-center">
                    <span class="text-caption font-weight-bold text-warning mr-2" style="width: 44px;">Mượn</span>
                    <v-progress-linear
                      :model-value="barWidth(m.borrowCount)"
                      color="warning"
                      height="8"
                      rounded
                      class="flex-grow-1"
                    />
                  </div>
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="d-flex align-center">
                    <span class="text-caption font-weight-bold text-success mr-2" style="width: 44px;">Trả</span>
                    <v-progress-linear
                      :model-value="barWidth(m.returnCount)"
                      color="success"
                      height="8"
                      rounded
                      class="flex-grow-1"
                    />
                  </div>
                </v-col>
              </v-row>
            </div>
          </div>

          <!-- Content: Category Stats -->
          <div v-else-if="reportType === 'categoryStats'" class="d-flex flex-column ga-5">
            <div v-for="c in rows" :key="c.category" class="pb-3 border-b">
              <div class="d-flex align-center justify-between mb-2">
                <span class="font-weight-black text-secondary">{{ c.category }}</span>
                <span class="text-subtitle-2 font-weight-bold text-primary">
                  {{ c.percent }}% ({{ c.borrowCount }} lượt)
                </span>
              </div>
              <v-progress-linear
                :model-value="c.percent"
                color="primary"
                height="10"
                rounded
              />
            </div>
          </div>

          <!-- Content: Fine Revenue -->
          <div v-else class="d-flex flex-column ga-5">
            <div v-for="m in rows" :key="m.month" class="pb-3 border-b">
              <div class="d-flex align-center justify-between mb-2">
                <span class="font-weight-black text-secondary">{{ m.monthName }}</span>
                <span class="font-weight-bold text-error">
                  {{ formatMoney(m.totalFine) }}
                </span>
              </div>
              <v-progress-linear
                :model-value="barWidth(m.totalFine)"
                color="error"
                height="10"
                rounded
              />
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { reportApi } from '../../api/reportApi'

const reportType = ref('borrowReturn')
const year = ref(new Date().getFullYear())
const loading = ref(false)
const message = ref('')
const rows = ref([])

const currentYear = new Date().getFullYear()
const yearOptions = [currentYear, currentYear - 1, currentYear - 2]

const reportTypeOptions = [
  { label: 'Mượn/trả theo tháng', value: 'borrowReturn' },
  { label: 'Tỉ lệ mượn theo thể loại', value: 'categoryStats' },
  { label: 'Doanh thu tiền phạt', value: 'fineRevenue' }
]

const activeReportLabel = computed(() =>
  reportTypeOptions.find(o => o.value === reportType.value)?.label || 'Dữ liệu chi tiết'
)

const maxValue = computed(() => {
  if (reportType.value === 'borrowReturn') {
    return Math.max(...rows.value.map(r => Math.max(r.borrowCount, r.returnCount)), 1)
  }
  if (reportType.value === 'fineRevenue') {
    return Math.max(...rows.value.map(r => r.totalFine), 1)
  }
  return 100
})

function barWidth(value) {
  return Math.max(2, Math.round((value / maxValue.value) * 100))
}

const summaryLabel = computed(() => {
  if (reportType.value === 'borrowReturn') return 'Tổng lượt mượn trong năm'
  if (reportType.value === 'categoryStats') return 'Số thể loại có dữ liệu'
  return 'Tổng tiền phạt trong năm'
})

const summaryValue = computed(() => {
  if (reportType.value === 'borrowReturn') {
    return rows.value.reduce((s, r) => s + r.borrowCount, 0).toLocaleString('vi-VN')
  }
  if (reportType.value === 'categoryStats') {
    return rows.value.length
  }
  return formatMoney(rows.value.reduce((s, r) => s + r.totalFine, 0))
})

const summaryCaption = computed(() => {
  if (reportType.value === 'borrowReturn') return 'lượt mượn'
  if (reportType.value === 'categoryStats') return 'thể loại sách'
  return 'tổng doanh thu phạt'
})

function formatMoney(value) {
  return new Intl.NumberFormat('vi-VN').format(value || 0) + ' đ'
}

async function loadReport() {
  loading.value = true
  message.value = ''
  rows.value = []

  try {
    let res
    if (reportType.value === 'borrowReturn') {
      res = await reportApi.borrowReturn(year.value)
    } else if (reportType.value === 'categoryStats') {
      res = await reportApi.categoryStats(year.value)
    } else {
      res = await reportApi.fineRevenue(year.value)
    }
    rows.value = Array.isArray(res.data) ? res.data : []
  } catch (err) {
    message.value = err.response?.data?.message || 'Không tải được dữ liệu báo cáo'
    console.error(err.response || err)
  } finally {
    loading.value = false
  }
}

function exportCsv() {
  if (!rows.value.length) return

  const columns = Object.keys(rows.value[0])
  const header = columns.join(',')
  const body = rows.value
    .map(row => columns.map(col => `"${String(row[col] ?? '').replace(/"/g, '""')}"`).join(','))
    .join('\n')

  const csv = `${header}\n${body}`
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = `bao-cao-${reportType.value}-${year.value}.csv`
  link.click()
  URL.revokeObjectURL(url)
}
</script>
