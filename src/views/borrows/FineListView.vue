<template>
  <div>
    <div class="action-bar">
      <div>
        <div class="page-title">Công nợ phí phạt</div>
        <div class="page-subtitle">
          Quản lý và thu phí phạt quá hạn chưa thanh toán của độc giả
        </div>
      </div>

      <v-spacer />

      <v-btn
        color="primary"
        variant="tonal"
        prepend-icon="mdi-refresh"
        :loading="loading"
        @click="loadFines"
      >
        Tải lại
      </v-btn>
    </div>

    <v-alert
      v-if="message"
      :type="success ? 'success' : 'error'"
      variant="tonal"
      class="mb-4"
      rounded="lg"
    >
      {{ message }}
    </v-alert>

    <v-row class="mb-5">
      <v-col cols="12" sm="6" md="4">
        <v-card class="stat-card pa-5 d-flex align-center" rounded="xl">
          <div class="stat-info">
            <div class="stat-label text-uppercase mb-1">Phiếu chưa thu phạt</div>
            <div class="stat-value text-amber-darken-3 font-weight-black">{{ fines.length }}</div>
          </div>
          <v-spacer />
          <div class="stat-icon-wrapper-glow amber-glowing-icon">
            <v-icon icon="mdi-file-alert-outline" size="30" />
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="4">
        <v-card class="stat-card pa-5 d-flex align-center" rounded="xl">
          <div class="stat-info">
            <div class="stat-label text-uppercase mb-1">Tiền phạt chưa thu</div>
            <div class="stat-value text-error font-weight-black fine-total">{{ formatMoney(totalUnpaidFine) }}</div>
          </div>
          <v-spacer />
          <div class="stat-icon-wrapper-glow error-glowing-icon">
            <v-icon icon="mdi-cash-alert" size="30" />
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="4">
        <v-card class="stat-card pa-5 d-flex align-center" rounded="xl">
          <div class="stat-info">
            <div class="stat-label text-uppercase mb-1">Phạt trung bình / phiếu</div>
            <div class="stat-value text-purple font-weight-black fine-total">{{ formatMoney(averageFine) }}</div>
          </div>
          <v-spacer />
          <div class="stat-icon-wrapper-glow purple-glowing-icon">
            <v-icon icon="mdi-chart-bar" size="30" />
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-card class="soft-card pa-5 mb-5">
      <v-row align="center">
        <v-col cols="12" md="6">
          <v-text-field
            v-model="keyword"
            label="Tìm theo tên độc giả / tên sách"
            prepend-inner-icon="mdi-magnify"
            clearable
            hide-details
          />
        </v-col>

        <v-col cols="12" md="4">
          <v-select
            v-model="sortOrder"
            label="Sắp xếp theo phí phạt"
            :items="sortOptions"
            prepend-inner-icon="mdi-sort"
            clearable
            hide-details
          />
        </v-col>

        <v-col cols="12" md="2">
          <v-btn
            color="secondary"
            variant="tonal"
            prepend-icon="mdi-filter-remove"
            block
            @click="resetFilters"
          >
            Xóa lọc
          </v-btn>
        </v-col>
      </v-row>
    </v-card>

    <v-card class="table-card" :class="{ 'table-card-loading': loading }">
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
          Danh sách công nợ chưa thanh toán
        </v-card-title>
        <v-spacer />
        <v-chip
          v-if="filteredFines.length > 0"
          color="error"
          variant="tonal"
          size="small"
          class="font-weight-bold"
        >
          {{ filteredFines.length }} phiếu
        </v-chip>
      </div>

      <v-table class="premium-table">
        <thead>
          <tr>
            <th style="width: 52px;">#</th>
            <th>Độc giả</th>
            <th>Sách</th>
            <th>Ngày mượn</th>
            <th>Hạn trả</th>
            <th>Ngày trả</th>
            <th>Tiền phạt</th>
            <th>Trạng thái</th>
            <th class="text-center">Thao tác</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(item, index) in paginatedFines" :key="item.id">
            <td>
              <span class="index-badge">{{ (page - 1) * itemsPerPage + index + 1 }}</span>
            </td>

            <td>
              <div class="font-weight-bold">{{ item.readerName }}</div>
            </td>

            <td>
              <div class="font-weight-bold">{{ item.bookTitle }}</div>
            </td>

            <td>{{ formatDate(item.borrowDate) }}</td>
            <td>{{ formatDate(item.dueDate) }}</td>
            <td>{{ formatDate(item.returnDate) }}</td>

            <td>
              <span class="fine-amount-badge">
                {{ formatMoney(item.fineAmount) }}
              </span>
            </td>

            <td>
              <v-chip
                :color="item.isFinePaid ? 'success' : 'error'"
                size="small"
                variant="tonal"
              >
                <v-icon
                  start
                  :icon="item.isFinePaid ? 'mdi-check-circle' : 'mdi-clock-alert'"
                />
                {{ item.isFinePaid ? 'Đã thu' : 'Chưa thu' }}
              </v-chip>
            </td>

            <td class="text-center">
              <v-tooltip text="Thu phạt ngay">
                <template #activator="{ props }">
                  <v-btn
                    v-if="!item.isFinePaid"
                    v-bind="props"
                    color="success"
                    size="small"
                    variant="tonal"
                    prepend-icon="mdi-credit-card-check"
                    :loading="loadingId === item.id"
                    @click="openPayDialog(item)"
                  >
                    Thu phạt
                  </v-btn>
                </template>
              </v-tooltip>

              <v-chip
                v-if="item.isFinePaid"
                color="success"
                variant="tonal"
                size="small"
              >
                <v-icon start icon="mdi-check-circle" />
                Đã thu
              </v-chip>
            </td>
          </tr>

          <tr v-if="filteredFines.length === 0">
            <td colspan="9" class="text-center pa-8">
              <v-icon icon="mdi-check-circle-outline" size="46" color="success" />
              <div class="text-subtitle-1 font-weight-bold mt-2">
                Không có công nợ phí phạt chưa thanh toán
              </div>
              <div class="text-body-2 text-grey-darken-1">
                Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc.
              </div>
            </td>
          </tr>
        </tbody>
      </v-table>

      <v-divider />

      <div class="d-flex align-center justify-space-between flex-wrap pa-4 ga-3">
        <div class="text-body-2 text-grey-darken-1">
          Hiển thị
          <b>{{ paginatedFines.length }}</b>
          /
          <b>{{ filteredFines.length }}</b>
          phiếu công nợ
        </div>

        <div class="d-flex align-center ga-3">
          <v-select
            v-model="itemsPerPage"
            :items="[5, 10, 20, 50]"
            label="Số dòng"
            density="compact"
            hide-details
            style="width: 110px;"
          />

          <v-pagination
            v-model="page"
            :length="pageCount"
            rounded="circle"
            density="comfortable"
            total-visible="5"
          />
        </div>
      </div>
    </v-card>

    <!-- Dialog xác nhận thu phạt -->
    <v-dialog v-model="payDialog" max-width="560">
      <v-card v-if="selectedFine">
        <v-card-title class="d-flex align-center">
          <v-icon icon="mdi-credit-card-check" color="success" class="mr-2" />
          Xác nhận thu phí phạt

          <v-spacer />

          <v-btn icon="mdi-close" variant="text" @click="payDialog = false" />
        </v-card-title>

        <v-divider />

        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <div class="info-box">
                <div class="info-label">Độc giả</div>
                <div class="info-value">{{ selectedFine.readerName }}</div>
              </div>
            </v-col>

            <v-col cols="12" md="6">
              <div class="info-box">
                <div class="info-label">Sách</div>
                <div class="info-value">{{ selectedFine.bookTitle }}</div>
              </div>
            </v-col>

            <v-col cols="12" md="6">
              <div class="info-box">
                <div class="info-label">Ngày mượn</div>
                <div class="info-value">{{ formatDate(selectedFine.borrowDate) }}</div>
              </div>
            </v-col>

            <v-col cols="12" md="6">
              <div class="info-box">
                <div class="info-label">Hạn trả</div>
                <div class="info-value text-error">{{ formatDate(selectedFine.dueDate) }}</div>
              </div>
            </v-col>

            <v-col cols="12">
              <div class="info-box fine-highlight-box">
                <div class="info-label">Số tiền phạt cần thu</div>
                <div class="info-value text-error" style="font-size: 22px;">
                  {{ formatMoney(selectedFine.fineAmount) }}
                </div>
              </div>
            </v-col>

            <v-col cols="12">
              <v-select
                v-model="paymentMethod"
                label="Phương thức thanh toán"
                :items="paymentMethods"
                prepend-inner-icon="mdi-cash"
              />
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-spacer />

          <v-btn variant="text" @click="payDialog = false">
            Hủy
          </v-btn>

          <v-btn
            color="success"
            prepend-icon="mdi-check-circle"
            :loading="loadingId === selectedFine.id"
            @click="confirmPayFine"
          >
            Xác nhận thu phạt
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { borrowApi } from '../../api/borrowApi'

const fines = ref([])
const message = ref('')
const success = ref(true)
const loadingId = ref('')
const loading = ref(false)

const keyword = ref('')
const sortOrder = ref(null)
const page = ref(1)
const itemsPerPage = ref(10)

const payDialog = ref(false)
const selectedFine = ref(null)
const paymentMethod = ref('Tiền mặt')

const paymentMethods = ['Tiền mặt', 'Chuyển khoản', 'Ví điện tử']

const sortOptions = [
  { title: 'Cao nhất trước', value: 'desc' },
  { title: 'Thấp nhất trước', value: 'asc' }
]

const totalUnpaidFine = computed(() =>
  fines.value.reduce((sum, item) => sum + Number(item.fineAmount || 0), 0)
)

const averageFine = computed(() => {
  if (fines.value.length === 0) return 0
  return Math.round(totalUnpaidFine.value / fines.value.length)
})

const filteredFines = computed(() => {
  let data = [...fines.value]

  if (keyword.value) {
    const search = keyword.value.toLowerCase().trim()
    data = data.filter(item =>
      String(item.readerName || '').toLowerCase().includes(search) ||
      String(item.bookTitle || '').toLowerCase().includes(search)
    )
  }

  if (sortOrder.value === 'desc') {
    data.sort((a, b) => Number(b.fineAmount || 0) - Number(a.fineAmount || 0))
  } else if (sortOrder.value === 'asc') {
    data.sort((a, b) => Number(a.fineAmount || 0) - Number(b.fineAmount || 0))
  }

  return data
})

const pageCount = computed(() => {
  const total = Math.ceil(filteredFines.value.length / itemsPerPage.value)
  return total || 1
})

const paginatedFines = computed(() => {
  const start = (page.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredFines.value.slice(start, end)
})

watch([keyword, sortOrder, itemsPerPage], () => {
  page.value = 1
})

async function loadFines() {
  loading.value = true
  message.value = ''

  try {
    const res = await borrowApi.getFines()
    fines.value = res.data
    success.value = true
  } catch (err) {
    success.value = false
    message.value = err.response?.data?.message || 'Không tải được danh sách công nợ phí phạt'
    console.error(err.response || err)
  } finally {
    loading.value = false
  }
}

function resetFilters() {
  keyword.value = ''
  sortOrder.value = null
  page.value = 1
}

function openPayDialog(item) {
  selectedFine.value = item
  paymentMethod.value = 'Tiền mặt'
  payDialog.value = true
}

async function confirmPayFine() {
  if (!selectedFine.value) return

  loadingId.value = selectedFine.value.id
  message.value = ''

  try {
    const res = await borrowApi.payFine(selectedFine.value.id)

    success.value = true
    message.value = res.data.message || `Thu phạt thành công bằng ${paymentMethod.value}`

    payDialog.value = false
    await loadFines()
  } catch (err) {
    success.value = false
    message.value = err.response?.data?.message || 'Thu phạt thất bại'
    console.error(err.response || err)
  } finally {
    loadingId.value = ''
  }
}

function formatDate(value) {
  if (!value) return '-'
  return new Date(value).toLocaleString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

function formatMoney(value) {
  return new Intl.NumberFormat('vi-VN').format(value || 0) + ' đ'
}

onMounted(loadFines)
</script>

<style scoped>
.fine-total {
  font-size: 26px !important;
  letter-spacing: -0.02em;
}

.bg-gradient-title {
  background: linear-gradient(135deg, #EEF2FF 0%, #F5F3FF 100%);
  border-bottom: 1px solid rgba(226, 232, 240, 0.8) !important;
}

.premium-table :deep(.v-table__wrapper) {
  background: transparent !important;
}

.premium-table tbody tr {
  transition: all 0.25s ease;
}

.premium-table tbody tr:hover {
  background: linear-gradient(90deg, rgba(217, 119, 6, 0.04) 0%, rgba(239, 68, 68, 0.04) 100%) !important;
}

.index-badge {
  display: inline-flex;
  width: 26px;
  height: 26px;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  font-size: 11.5px;
  font-weight: 800;
  background: rgba(148, 163, 184, 0.1);
  color: #64748b;
}

.fine-amount-badge {
  display: inline-block;
  font-weight: 800;
  font-size: 14px;
  color: #DC2626;
}

.info-box {
  min-height: 78px;
  padding: 14px 16px;
  border-radius: 18px;
  background: #f8fafc;
  border: 1px solid #eef2f7;
}

.info-label {
  color: #64748b;
  font-size: 13px;
  font-weight: 700;
  margin-bottom: 6px;
}

.info-value {
  color: #0f172a;
  font-size: 15px;
  font-weight: 800;
  word-break: break-word;
}

.fine-highlight-box {
  border-color: rgba(239, 68, 68, 0.25) !important;
  background: rgba(239, 68, 68, 0.03) !important;
}
</style>
