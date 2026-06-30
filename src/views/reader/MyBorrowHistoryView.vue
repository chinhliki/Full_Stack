<template>
  <div>
    <div class="action-bar">
      <div>
        <div class="page-title">Phiếu mượn của tôi</div>
        <div class="page-subtitle">
          Theo dõi các phiếu mượn sách, thời hạn trả và tình trạng phí phạt của bạn
        </div>
      </div>

      <v-spacer />

      <v-btn
        color="primary"
        variant="tonal"
        prepend-icon="mdi-refresh"
        :loading="loading"
        @click="loadMyBorrows"
      >
        Tải lại
      </v-btn>
    </div>

    <v-alert
      v-if="message"
      :type="success ? 'success' : 'error'"
      variant="tonal"
      class="mb-5"
      rounded="lg"
    >
      {{ message }}
    </v-alert>

    <!-- Stats Cards Row -->
    <v-row class="mb-5">
      <v-col cols="12" sm="6" md="3">
        <v-card class="stat-card pa-5 d-flex align-center" rounded="xl">
          <div class="stat-info">
            <div class="stat-label text-uppercase mb-1">Tổng số phiếu</div>
            <div class="stat-value text-purple font-weight-black">{{ groupedSlips.length }}</div>
          </div>
          <v-spacer />
          <div class="stat-icon-wrapper-glow purple-glowing-icon">
            <v-icon icon="mdi-clipboard-text-multiple" size="30" />
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="stat-card pa-5 d-flex align-center" rounded="xl">
          <div class="stat-info">
            <div class="stat-label text-uppercase mb-1">Đang mượn</div>
            <div class="stat-value text-purple font-weight-black">{{ borrowingCount }}</div>
          </div>
          <v-spacer />
          <div class="stat-icon-wrapper-glow purple-glowing-icon">
            <v-icon icon="mdi-book-clock-outline" size="30" />
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="stat-card pa-5 d-flex align-center" rounded="xl">
          <div class="stat-info">
            <div class="stat-label text-uppercase mb-1">Đã trả</div>
            <div class="stat-value text-teal font-weight-black">{{ returnedCount }}</div>
          </div>
          <v-spacer />
          <div class="stat-icon-wrapper-glow teal-glowing-icon">
            <v-icon icon="mdi-check-circle-outline" size="30" />
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="stat-card pa-5 d-flex align-center" rounded="xl">
          <div class="stat-info">
            <div class="stat-label text-uppercase mb-1">Tổng phí phạt</div>
            <div class="stat-value text-amber-darken-3 font-weight-black fine-stat-val">
              {{ formatMoney(totalFine) }}
            </div>
          </div>
          <v-spacer />
          <div class="stat-icon-wrapper-glow amber-glowing-icon">
            <v-icon icon="mdi-cash-minus" size="28" class="fine-icon-special" />
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Filter Card -->
    <v-card class="soft-card pa-5 mb-5">
      <v-row align="center">
        <v-col cols="12" md="4">
          <v-text-field
            v-model="keyword"
            label="Tìm mã phiếu hoặc tên sách"
            prepend-inner-icon="mdi-magnify"
            clearable
            hide-details
          />
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <v-select
            v-model="statusFilter"
            label="Trạng thái phiếu"
            :items="statusOptions"
            clearable
            hide-details
          />
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <v-select
            v-model="timeFilter"
            label="Thời gian mượn"
            :items="timeOptions"
            clearable
            hide-details
          />
        </v-col>

        <v-col cols="12" md="2">
          <v-btn
            color="secondary"
            variant="tonal"
            block
            prepend-icon="mdi-filter-remove"
            @click="resetFilters"
            class="h-100 py-3"
            style="min-height: 56px;"
          >
            Xóa lọc
          </v-btn>
        </v-col>
      </v-row>
    </v-card>

    <!-- Slips Grid list -->
    <div class="slips-container position-relative">
      <v-progress-linear
        v-show="loading"
        indeterminate
        color="primary"
        height="3"
        class="position-absolute"
        style="z-index: 2; top: -10px; left: 0; right: 0;"
      />

      <v-row class="mb-5 slip-list-wrapper">
        <v-col
          cols="12"
          sm="6"
          md="4"
          v-for="slip in paginatedSlips"
          :key="slip.id"
          class="slip-card-col"
        >
          <v-card class="slip-card pa-4" @click="openSlipDetail(slip)">
            <div class="d-flex align-center justify-space-between mb-3">
              <span class="slip-code font-weight-bold text-primary">Phiếu: #{{ shortId(slip.id) }}</span>
              <v-chip :color="getSlipStatusColor(slip.status)" size="small" variant="tonal">
                <v-icon start :icon="getSlipStatusIcon(slip.status)" size="14" />
                {{ getSlipStatusText(slip.status) }}
              </v-chip>
            </div>

            <v-divider class="mb-3" opacity="0.08" />

            <div class="slip-info-row mb-2 d-flex align-center">
              <v-icon icon="mdi-calendar-import" size="16" class="mr-2 text-grey-darken-1" />
              <span class="text-caption text-grey-darken-1">Ngày mượn:</span>
              <span class="text-body-2 font-weight-bold ml-1 text-secondary-dark">{{ formatDate(slip.borrowDate) }}</span>
            </div>

            <div class="slip-info-row mb-2 d-flex align-center">
              <v-icon icon="mdi-calendar-export" size="16" class="mr-2 text-grey-darken-1" />
              <span class="text-caption text-grey-darken-1">Hạn trả gốc:</span>
              <span
                class="text-body-2 font-weight-bold ml-1"
                :class="slip.status === 'Overdue' ? 'text-error' : 'text-secondary-dark'"
              >
                {{ formatDate(slip.dueDate) }}
              </span>
            </div>

            <div class="slip-info-row mb-3 d-flex align-center">
              <v-icon icon="mdi-book-multiple" size="16" class="mr-2 text-grey-darken-1" />
              <span class="text-caption text-grey-darken-1">Số lượng:</span>
              <span class="text-body-2 font-weight-black ml-1 text-primary">{{ slip.bookCount }} cuốn sách</span>
            </div>

            <v-divider class="my-3" opacity="0.08" />

            <div class="d-flex align-center justify-space-between">
              <span class="text-caption text-grey-darken-1">Tổng phạt tích lũy:</span>
              <span
                class="font-weight-black text-body-2"
                :class="slip.totalFineAmount > 0 ? 'text-error' : 'text-success'"
              >
                {{ formatMoney(slip.totalFineAmount) }}
              </span>
            </div>
          </v-card>
        </v-col>

        <!-- Empty State -->
        <v-col cols="12" v-if="filteredSlips.length === 0 && !loading" class="text-center pa-10">
          <v-card class="soft-card pa-8 d-flex flex-column align-center justify-center">
            <v-icon icon="mdi-clipboard-text-search-outline" size="56" color="grey-darken-1" />
            <div class="text-subtitle-1 font-weight-bold mt-3">Không tìm thấy phiếu mượn nào</div>
            <div class="text-caption text-grey">Bạn chưa mượn sách hoặc bộ lọc đang chọn không trả về kết quả.</div>
          </v-card>
        </v-col>
      </v-row>

      <!-- Pagination Footer -->
      <v-card class="soft-card pa-4 d-flex align-center justify-space-between flex-wrap ga-3" v-if="filteredSlips.length > 0">
        <div class="text-body-2 text-grey-darken-1">
          Hiển thị <b>{{ paginatedSlips.length }}</b> / <b>{{ filteredSlips.length }}</b> phiếu mượn
        </div>

        <div class="d-flex align-center ga-3">
          <v-select
            v-model="itemsPerPage"
            :items="[6, 12, 24]"
            label="Số dòng"
            density="compact"
            hide-details
            style="width: 100px;"
          />

          <v-pagination
            v-model="page"
            :length="pageCount"
            rounded="circle"
            density="comfortable"
            total-visible="5"
          />
        </div>
      </v-card>
    </div>

    <!-- Slip Detail Dialog -->
    <v-dialog v-model="detailDialog" max-width="720" transition="dialog-transition">
      <v-card class="scale-in-dialog" rounded="xl" v-if="selectedSlip">
        <v-card-title class="d-flex align-center pa-5">
          <v-icon icon="mdi-clipboard-text-outline" color="primary" class="mr-2" />
          <div>
            <div class="font-weight-black text-h6">Chi tiết phiếu mượn</div>
            <div class="text-caption text-grey">Mã phiếu: #{{ selectedSlip.id }}</div>
          </div>
          <v-spacer />
          <v-btn icon="mdi-close" variant="text" @click="detailDialog = false" />
        </v-card-title>

        <v-divider />

        <v-card-text class="pa-5">
          <!-- Quick summary inside modal -->
          <v-row class="mb-4">
            <v-col cols="12" sm="6" md="4">
              <div class="info-box">
                <div class="info-label">Ngày mượn</div>
                <div class="info-value">{{ formatDate(selectedSlip.borrowDate) }}</div>
              </div>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <div class="info-box">
                <div class="info-label">Hạn trả gốc</div>
                <div class="info-value" :class="selectedSlip.status === 'Overdue' ? 'text-error' : ''">
                  {{ formatDate(selectedSlip.dueDate) }}
                </div>
              </div>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <div class="info-box">
                <div class="info-label">Trạng thái phiếu</div>
                <div class="info-value">
                  <v-chip :color="getSlipStatusColor(selectedSlip.status)" size="small" variant="tonal">
                    {{ getSlipStatusText(selectedSlip.status) }}
                  </v-chip>
                </div>
              </div>
            </v-col>
          </v-row>

          <div class="text-subtitle-1 font-weight-black mb-3">Danh sách sách mượn</div>

          <v-table class="details-table border rounded-lg overflow-hidden">
            <thead>
              <tr>
                <th>Tên sách</th>
                <th>Hạn trả</th>
                <th>Ngày trả thực tế</th>
                <th>Trạng thái</th>
                <th>Phí phạt</th>
                <th class="text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in selectedSlip.items" :key="item.id">
                <td class="font-weight-bold">{{ item.bookTitle }}</td>
                <td>
                  <span :class="isItemOverdue(item) ? 'text-error font-weight-bold' : ''">
                    {{ formatDate(item.dueDate) }}
                  </span>
                </td>
                <td>{{ item.returnDate ? formatDate(item.returnDate) : '-' }}</td>
                <td>
                  <v-chip
                    :color="item.status === 'Borrowed' ? 'warning' : 'success'"
                    size="x-small"
                    variant="tonal"
                  >
                    {{ getBorrowStatusText(item.status) }}
                  </v-chip>
                </td>
                <td>
                  <div class="d-flex align-center">
                    <span :class="Number(item.fineAmount || 0) > 0 ? 'text-error font-weight-bold' : 'text-success'">
                      {{ formatMoney(item.fineAmount) }}
                    </span>
                    <v-tooltip text="Quét mã QR thanh toán" location="top" v-if="Number(item.fineAmount || 0) > 0 && !item.isFinePaid">
                      <template #activator="{ props }">
                        <v-btn
                          v-bind="props"
                          icon="mdi-qrcode"
                          size="x-small"
                          color="warning"
                          variant="tonal"
                          class="ml-2"
                          @click="showPaymentQr(item)"
                        />
                      </template>
                    </v-tooltip>
                  </div>
                </td>
                <td class="text-center">
                  <v-btn
                    v-if="item.status === 'Borrowed'"
                    icon="mdi-book-arrow-left"
                    size="x-small"
                    color="primary"
                    variant="tonal"
                    :loading="returningId === item.id"
                    @click="openReturnDialog(item)"
                  />
                  <v-chip
                    v-else
                    color="success"
                    variant="tonal"
                    size="x-small"
                  >
                    Đã trả xong
                  </v-chip>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card-text>

        <v-divider />

        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn variant="tonal" color="secondary" @click="detailDialog = false">
            Đóng
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog mã QR thanh toán phí phạt VietQR -->
    <v-dialog v-model="qrDialog" max-width="420">
      <v-card rounded="xl" class="scale-in-dialog">
        <v-card-title class="d-flex align-center pa-4">
          <v-icon icon="mdi-qrcode" color="warning" class="mr-2" />
          <span class="font-weight-black text-secondary text-subtitle-1">Mã QR Thanh Toán Phí Phạt</span>
          <v-spacer />
          <v-btn icon="mdi-close" variant="text" @click="qrDialog = false" />
        </v-card-title>
        <v-divider />
        <v-card-text class="text-center pa-5">
          <div v-if="qrLoading" class="d-flex flex-column align-center py-6">
            <v-progress-circular indeterminate color="primary" size="40" class="mb-3" />
            <div class="text-caption text-grey">Đang tạo mã QR thanh toán VietQR...</div>
          </div>
          <div v-else-if="qrData">
            <div class="text-caption text-grey mb-3">Quét mã bằng ứng dụng Ngân hàng (VietQR) để thanh toán trực tuyến</div>
            <v-img :src="qrData.qrImageUrl" max-width="240" class="mx-auto rounded-lg border mb-4 shadow-sm" />
            
            <div class="info-box text-left mb-3 pa-3 bg-grey-lighten-4 rounded-lg">
              <div class="d-flex justify-space-between mb-1">
                <span class="text-caption text-grey">Ngân hàng:</span>
                <span class="text-body-2 font-weight-bold text-secondary">{{ qrData.bankName }}</span>
              </div>
              <div class="d-flex justify-space-between mb-1">
                <span class="text-caption text-grey">Số tài khoản:</span>
                <span class="text-body-2 font-weight-bold text-secondary">{{ qrData.accountNo }}</span>
              </div>
              <div class="d-flex justify-space-between mb-1">
                <span class="text-caption text-grey">Chủ tài khoản:</span>
                <span class="text-body-2 font-weight-bold text-secondary">{{ qrData.accountName }}</span>
              </div>
              <div class="d-flex justify-space-between mb-1">
                <span class="text-caption text-grey">Số tiền phạt:</span>
                <span class="text-body-2 font-weight-black text-error">{{ formatMoney(qrData.fineAmount) }}</span>
              </div>
            </div>
            <v-alert type="info" variant="tonal" rounded="lg" class="text-left" density="compact">
              <div class="text-caption font-weight-bold">Nội dung chuyển khoản:</div>
              <div class="text-body-2 font-weight-black text-primary select-all">{{ qrData.paymentContent }}</div>
            </v-alert>
          </div>
          <v-alert v-else type="error" variant="tonal" rounded="lg">
            Không thể tải mã QR thanh toán từ hệ thống.
          </v-alert>
        </v-card-text>
        <v-divider />
        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn color="primary" variant="flat" rounded="xl" class="px-5 font-weight-bold" @click="qrDialog = false">
            Tôi đã chuyển khoản xong
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog báo trả sách -->
    <v-dialog v-model="returnDialog" max-width="520">
      <v-card class="scale-in-dialog" rounded="xl" v-if="selectedBorrow">
        <v-card-title class="d-flex align-center">
          <v-icon icon="mdi-book-arrow-left" color="primary" class="mr-2" />
          Báo trả sách

          <v-spacer />

          <v-btn icon="mdi-close" variant="text" @click="returnDialog = false" />
        </v-card-title>

        <v-divider />

        <v-card-text>
          <div class="info-box mb-4">
            <div class="info-label">Sách muốn trả</div>
            <div class="info-value">{{ selectedBorrow.bookTitle }}</div>
          </div>

          <div class="info-box mb-4">
            <div class="info-label">Hạn trả gốc</div>
            <div class="info-value" :class="isItemOverdue(selectedBorrow) ? 'text-error' : ''">
              {{ formatDate(selectedBorrow.dueDate) }}
              <v-chip
                v-if="isItemOverdue(selectedBorrow)"
                color="error"
                size="x-small"
                variant="tonal"
                class="ml-2"
              >
                Quá hạn {{ getLateDays(selectedBorrow.dueDate) }} ngày
              </v-chip>
            </div>
          </div>

          <v-alert
            v-if="isItemOverdue(selectedBorrow)"
            type="warning"
            variant="tonal"
            rounded="lg"
            class="mb-4"
          >
            Sách đã quá hạn <strong>{{ getLateDays(selectedBorrow.dueDate) }} ngày</strong>.
            Phí phạt dự kiến: <strong>{{ formatMoney(getEstimatedFine(selectedBorrow)) }}</strong>
          </v-alert>

          <v-text-field
            v-model="returnDate"
            label="Ngày trả (tự động điền hôm nay)"
            type="datetime-local"
            prepend-inner-icon="mdi-calendar-check"
          />

          <v-alert type="info" variant="tonal" rounded="lg" class="mt-2">
            Hệ thống sẽ ghi nhận yêu cầu trả sách. Thủ thư sẽ xác nhận khi bạn mang sách đến quầy.
          </v-alert>
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-spacer />

          <v-btn variant="text" @click="returnDialog = false">
            Hủy
          </v-btn>

          <v-btn
            color="primary"
            prepend-icon="mdi-check"
            :loading="returningId === selectedBorrow.id"
            @click="confirmReturn"
          >
            Xác nhận báo trả
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { borrowApi } from '../../api/borrowApi'

const borrows = ref([])
const keyword = ref('')
const statusFilter = ref(null)
const timeFilter = ref(null)
const loading = ref(false)
const message = ref('')
const success = ref(true)

const page = ref(1)
const itemsPerPage = ref(6)

const detailDialog = ref(false)
const selectedSlip = ref(null)

const returnDialog = ref(false)
const selectedBorrow = ref(null)
const returningId = ref('')
const returnDate = ref('')

const finePerLateDay = ref(5000)

async function loadSettings() {
  try {
    const res = await borrowApi.getSettings()
    finePerLateDay.value = Number(res.data.finePerLateDay || 5000)
  } catch (err) {
    console.warn('Không tải được cấu hình mượn trả, dùng mặc định 5000 đ/ngày:', err?.response?.status || err.message)
  }
}

const statusOptions = [
  { title: 'Tất cả trạng thái', value: null },
  { title: 'Đang mượn', value: 'Borrowed' },
  { title: 'Đã trả', value: 'Returned' },
  { title: 'Quá hạn', value: 'Overdue' }
]

const timeOptions = [
  { title: 'Tất cả thời gian', value: null },
  { title: 'Tháng này', value: 'thisMonth' },
  { title: '3 tháng gần nhất', value: 'threeMonths' }
]

const borrowingCount = computed(() =>
  groupedSlips.value.filter(s => s.status === 'Borrowed' || s.status === 'Overdue').length
)

const returnedCount = computed(() =>
  groupedSlips.value.filter(s => s.status === 'Returned').length
)

const totalFine = computed(() =>
  borrows.value.reduce((sum, item) => sum + Number(item.fineAmount || 0), 0)
)

// Group flat book loans into virtual borrow slips.
// Key = date string (YYYY-MM-DD) so borrowDate timestamp precision differences are ignored.
// Stable slip key stored separately from item.id to survive reload order changes.
const groupedSlips = computed(() => {
  const groups = {}
  const now = new Date()

  borrows.value.forEach(item => {
    // Normalize to date-only so millisecond differences don't split the same session
    const dateKey = item.borrowDate ? item.borrowDate.slice(0, 10) : 'unknown'
    if (!groups[dateKey]) {
      groups[dateKey] = {
        slipKey: dateKey,       // stable key independent of row order
        borrowDate: item.borrowDate,
        dueDate: item.dueDate,
        items: [],
        hasBorrowed: false,
        hasOverdue: false,
        totalFineAmount: 0
      }
    }
    const group = groups[dateKey]
    group.items.push(item)
    group.totalFineAmount += Number(item.fineAmount || 0)
    if (item.status === 'Borrowed') {
      group.hasBorrowed = true
      if (new Date(item.dueDate) < now) group.hasOverdue = true
    }
  })

  return Object.values(groups).map(group => {
    let status = 'Returned'
    if (group.hasOverdue) status = 'Overdue'
    else if (group.hasBorrowed) status = 'Borrowed'

    return {
      id: group.slipKey,        // stable ID for watcher find()
      slipKey: group.slipKey,
      borrowDate: group.borrowDate,
      dueDate: group.dueDate,
      items: group.items,
      status,
      totalFineAmount: group.totalFineAmount,
      bookCount: group.items.length
    }
  })
})

const filteredSlips = computed(() => {
  let slips = [...groupedSlips.value]

  if (keyword.value) {
    const search = keyword.value.toLowerCase()
    slips = slips.filter(slip =>
      shortId(slip.id).toLowerCase().includes(search) ||
      slip.items.some(item => String(item.bookTitle || '').toLowerCase().includes(search))
    )
  }

  if (statusFilter.value) {
    slips = slips.filter(slip => slip.status === statusFilter.value)
  }

  if (timeFilter.value) {
    const now = new Date()
    slips = slips.filter(slip => {
      const borrowDate = new Date(slip.borrowDate)
      if (timeFilter.value === 'thisMonth') {
        return borrowDate.getMonth() === now.getMonth() && borrowDate.getFullYear() === now.getFullYear()
      } else if (timeFilter.value === 'threeMonths') {
        const diffTime = Math.abs(now - borrowDate)
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return diffDays <= 90
      }
      return true
    })
  }

  return slips
})

const pageCount = computed(() => {
  const total = Math.ceil(filteredSlips.value.length / itemsPerPage.value)
  return total || 1
})

const paginatedSlips = computed(() => {
  const start = (page.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredSlips.value.slice(start, end)
})

watch([keyword, statusFilter, timeFilter, itemsPerPage], () => {
  page.value = 1
})

// Sync detail modal contents if the borrows list reloads.
// Use slipKey (stable date string) not item.id (order-dependent).
watch(borrows, () => {
  if (selectedSlip.value) {
    const fresh = groupedSlips.value.find(s => s.slipKey === selectedSlip.value.slipKey)
    if (fresh) {
      selectedSlip.value = fresh
    } else {
      selectedSlip.value = null
      detailDialog.value = false
    }
  }
})

async function loadMyBorrows() {
  loading.value = true
  message.value = ''

  loadSettings()

  try {
    const res = await borrowApi.getMyBorrows()
    borrows.value = res.data
    success.value = true
  } catch (err) {
    success.value = false
    message.value = err.response?.data?.message || 'Không tải được lịch sử mượn'
    console.error(err.response || err)
  } finally {
    loading.value = false
  }
}

function resetFilters() {
  keyword.value = ''
  statusFilter.value = null
  timeFilter.value = null
  page.value = 1
}

function openSlipDetail(slip) {
  selectedSlip.value = slip
  detailDialog.value = true
}

function openReturnDialog(item) {
  selectedBorrow.value = item
  returnDate.value = toDateTimeLocal(new Date())
  returnDialog.value = true
}

async function confirmReturn() {
  if (!selectedBorrow.value) return

  returningId.value = selectedBorrow.value.id
  message.value = ''

  try {
    await borrowApi.returnBook(selectedBorrow.value.id, {
      returnDate: new Date(returnDate.value).toISOString()
    })

    success.value = true
    message.value = `Báo trả sách "${selectedBorrow.value.bookTitle}" thành công. Vui lòng mang sách đến quầy để thủ thư xác nhận.`

    returnDialog.value = false
    await loadMyBorrows()
  } catch (err) {
    success.value = false
    message.value = err.response?.data?.message || 'Báo trả sách thất bại'
    console.error(err.response || err)
  } finally {
    returningId.value = ''
  }
}

function getBorrowStatusText(status) {
  if (status === 'Borrowed') return 'Đang mượn'
  if (status === 'Returned') return 'Đã trả'
  return status || '-'
}

function isItemOverdue(item) {
  if (item.isOverdue) return true
  if (item.status !== 'Borrowed') return false
  if (!item.dueDate) return false
  return new Date(item.dueDate).getTime() < new Date().getTime()
}

function getLateDays(dueDate) {
  if (!dueDate) return 0
  const diff = new Date().getTime() - new Date(dueDate).getTime()
  return diff > 0 ? Math.ceil(diff / (1000 * 60 * 60 * 24)) : 0
}

// Estimates fine per book
function getEstimatedFine(item) {
  const currentFine = Number(item.fineAmount || 0)
  if (currentFine > 0) return currentFine
  return getLateDays(item.dueDate) * finePerLateDay.value
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

// Truncates long ID to 8 chars
function shortId(value) {
  if (!value) return '-'
  return String(value).slice(0, 8)
}

function toDateTimeLocal(date) {
  const pad = (n) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function getSlipStatusText(status) {
  if (status === 'Borrowed') return 'Đang mượn'
  if (status === 'Returned') return 'Đã trả'
  if (status === 'Overdue') return 'Quá hạn'
  return status || '-'
}

function getSlipStatusColor(status) {
  if (status === 'Borrowed') return 'warning'
  if (status === 'Returned') return 'success'
  if (status === 'Overdue') return 'error'
  return 'secondary'
}

function getSlipStatusIcon(status) {
  if (status === 'Borrowed') return 'mdi-book-clock'
  if (status === 'Returned') return 'mdi-check-circle'
  if (status === 'Overdue') return 'mdi-alert-circle'
  return 'mdi-help-circle'
}

const qrDialog = ref(false)
const qrLoading = ref(false)
const qrData = ref(null)

async function showPaymentQr(item) {
  qrDialog.value = true
  qrLoading.value = true
  qrData.value = null
  try {
    const res = await borrowApi.getFinePaymentQr(item.id)
    qrData.value = res.data
  } catch (err) {
    console.error('Không tải được mã QR thanh toán:', err)
  } finally {
    qrLoading.value = false
  }
}

onMounted(loadMyBorrows)
</script>

<style scoped>
.fine-stat-val {
  font-size: 22px !important;
  letter-spacing: -0.02em;
}

.slip-list-wrapper {
  animation: slipFadeIn 0.25s ease-out forwards;
}

@keyframes slipFadeIn {
  0% {
    opacity: 0;
    transform: translateY(12px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.slip-card {
  border-radius: 12px !important;
  border: 1px solid rgba(239, 68, 68, 0.22) !important;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
  cursor: pointer;
  background: var(--card-bg, #ffffff) !important;
}

body:not(.dark-theme) .slip-card {
  box-shadow: 0 4px 10px rgba(15, 23, 42, 0.02) !important;
}

body:not(.dark-theme) .slip-card:hover {
  transform: translateY(-3px);
  border-color: rgba(239, 68, 68, 0.45) !important;
  box-shadow: 0 8px 24px rgba(239, 68, 68, 0.08) !important;
}

body.dark-theme .slip-card {
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.7) 100%) !important;
  border-color: rgba(239, 68, 68, 0.3) !important;
}

body.dark-theme .slip-card:hover {
  transform: translateY(-3px);
  border-color: rgba(239, 68, 68, 0.55) !important;
  box-shadow: 0 0 15px rgba(239, 68, 68, 0.15), 0 8px 24px rgba(0, 0, 0, 0.3) !important;
}

.scale-in-dialog {
  animation: dialogScaleIn 0.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

@keyframes dialogScaleIn {
  0% {
    transform: scale(0.92);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.info-box {
  min-height: 72px;
  padding: 14px 16px;
  border-radius: 18px;
  background: #f8fafc;
  border: 1px solid #eef2f7;
}

body.dark-theme .info-box {
  background: rgba(30, 41, 59, 0.5);
  border-color: rgba(255, 255, 255, 0.08);
}

.info-label {
  color: #64748b;
  font-size: 13px;
  font-weight: 700;
  margin-bottom: 6px;
}

body.dark-theme .info-label {
  color: #94a3b8;
}

.info-value {
  color: #0f172a;
  font-size: 15px;
  font-weight: 800;
  word-break: break-word;
}

body.dark-theme .info-value {
  color: #ffffff;
}
</style>
