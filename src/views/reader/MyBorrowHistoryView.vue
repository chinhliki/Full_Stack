<template>
  <div>
    <div class="action-bar">
      <div>
        <div class="page-title">Lịch sử mượn của tôi</div>
        <div class="page-subtitle">
          Theo dõi sách đang mượn, lịch sử trả sách và phí phạt phát sinh
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

    <v-row class="mb-5">
      <v-col cols="12" sm="6" md="3">
        <v-card class="stat-card pa-5 d-flex align-center" rounded="xl">
          <div class="stat-info">
            <div class="stat-label text-uppercase mb-1">Tổng phiếu mượn</div>
            <div class="stat-value text-primary font-weight-black">{{ borrows.length }}</div>
          </div>
          <v-spacer />
          <div class="stat-icon-wrapper-glow info-glowing-icon">
            <v-icon icon="mdi-clipboard-text-outline" size="30" />
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
            <v-icon icon="mdi-cash-alert" size="30" />
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Cảnh báo sắp đạt giới hạn mượn -->
    <v-alert
      v-if="borrowingCount >= 4"
      :type="borrowingCount >= 5 ? 'error' : 'warning'"
      variant="tonal"
      class="mb-4"
      rounded="lg"
      :icon="borrowingCount >= 5 ? 'mdi-alert-circle' : 'mdi-alert'"
    >
      <template v-if="borrowingCount >= 5">
        Bạn đang mượn tối đa <strong>5 quyển</strong>. Vui lòng trả bớt sách để có thể mượn thêm.
      </template>
      <template v-else>
        Bạn đang mượn <strong>{{ borrowingCount }}/5 quyển</strong>. Còn có thể mượn thêm {{ 5 - borrowingCount }} quyển.
      </template>
    </v-alert>

    <v-card class="soft-card pa-5 mb-5">
      <v-row align="center">
        <v-col cols="12" md="5">
          <v-text-field
            v-model="keyword"
            label="Tìm theo tên sách"
            prepend-inner-icon="mdi-magnify"
            clearable
            hide-details
          />
        </v-col>

        <v-col cols="12" md="3">
          <v-select
            v-model="statusFilter"
            label="Trạng thái"
            :items="statusOptions"
            clearable
            hide-details
          />
        </v-col>

        <v-col cols="12" md="4">
          <div class="d-flex align-center ga-3">
            <div class="text-body-2 text-grey-darken-1">
              Hiển thị <b>{{ filteredBorrows.length }}</b> / {{ borrows.length }} phiếu
            </div>
            <v-spacer />
            <v-btn
              color="secondary"
              variant="tonal"
              size="small"
              prepend-icon="mdi-filter-remove"
              @click="resetFilters"
            >
              Xóa lọc
            </v-btn>
          </div>
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
      <v-table>
        <thead>
          <tr>
            <th>#</th>
            <th>Sách</th>
            <th>Ngày mượn</th>
            <th>Hạn trả</th>
            <th>Ngày trả</th>
            <th>Trạng thái</th>
            <th>Quá hạn</th>
            <th>Tiền phạt</th>
            <th>Trạng thái phạt</th>
            <th class="text-center">Thao tác</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(item, index) in paginatedBorrows" :key="item.id">
            <td>
              <span class="index-badge">{{ (page - 1) * itemsPerPage + index + 1 }}</span>
            </td>

            <td>
              <div class="d-flex align-center">
                <div class="book-icon-wrap mr-3">
                  <v-icon icon="mdi-book-open-page-variant" color="primary" size="22" />
                </div>

                <div>
                  <div class="font-weight-bold">
                    {{ item.bookTitle }}
                  </div>
                  <div class="text-caption text-grey-darken-1">
                    Mã phiếu: {{ shortId(item.id) }}
                  </div>
                </div>
              </div>
            </td>

            <td>{{ formatDate(item.borrowDate) }}</td>
            <td>
              <span :class="isItemOverdue(item) ? 'text-error font-weight-bold' : ''">
                {{ formatDate(item.dueDate) }}
              </span>
            </td>
            <td>{{ item.returnDate ? formatDate(item.returnDate) : '-' }}</td>

            <td>
              <v-chip
                :color="item.status === 'Borrowed' ? 'warning' : 'success'"
                size="small"
                variant="tonal"
              >
                <v-icon
                  start
                  :icon="item.status === 'Borrowed' ? 'mdi-book-clock' : 'mdi-check-circle'"
                />
                {{ getBorrowStatusText(item.status) }}
              </v-chip>
            </td>

            <td>
              <v-chip
                :color="isItemOverdue(item) ? 'error' : 'success'"
                size="small"
                variant="tonal"
              >
                <v-icon
                  start
                  :icon="isItemOverdue(item) ? 'mdi-clock-alert-outline' : 'mdi-check'"
                />
                {{ isItemOverdue(item) ? 'Quá hạn' : 'Đúng hạn' }}
              </v-chip>
            </td>

            <td>
              <span :class="Number(item.fineAmount || 0) > 0 ? 'text-error font-weight-bold' : ''">
                {{ formatMoney(item.fineAmount) }}
              </span>
            </td>

            <td>
              <v-chip
                :color="getFineStatusColor(item)"
                size="small"
                variant="tonal"
              >
                {{ getFineStatusText(item) }}
              </v-chip>
            </td>

            <td class="text-center">
              <v-tooltip text="Báo trả sách" v-if="item.status === 'Borrowed'">
                <template #activator="{ props }">
                  <v-btn
                    v-bind="props"
                    icon="mdi-book-arrow-left"
                    size="small"
                    color="primary"
                    variant="tonal"
                    :loading="returningId === item.id"
                    @click="openReturnDialog(item)"
                  />
                </template>
              </v-tooltip>

              <v-chip
                v-if="item.status === 'Returned'"
                color="success"
                variant="tonal"
                size="small"
              >
                <v-icon start icon="mdi-check-circle" />
                Đã trả
              </v-chip>
            </td>
          </tr>

          <tr v-if="filteredBorrows.length === 0">
            <td colspan="10" class="text-center pa-8">
              <v-icon icon="mdi-database-search-outline" size="42" color="grey" />
              <div class="text-subtitle-1 font-weight-bold mt-2">
                Không có dữ liệu phù hợp
              </div>
              <div class="text-body-2 text-grey-darken-1">
                Bạn chưa có lịch sử mượn sách hoặc bộ lọc chưa phù hợp.
              </div>
            </td>
          </tr>
        </tbody>
      </v-table>

      <v-divider />

      <div class="d-flex align-center justify-space-between flex-wrap pa-4 ga-3">
        <div class="text-body-2 text-grey-darken-1">
          Hiển thị <b>{{ paginatedBorrows.length }}</b> / <b>{{ filteredBorrows.length }}</b> phiếu
        </div>

        <div class="d-flex align-center ga-3">
          <v-select
            v-model="itemsPerPage"
            :items="[5, 10, 20]"
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

    <!-- Dialog báo trả sách -->
    <v-dialog v-model="returnDialog" max-width="520">
      <v-card v-if="selectedBorrow">
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
const loading = ref(false)
const message = ref('')
const success = ref(true)

const page = ref(1)
const itemsPerPage = ref(10)

const returnDialog = ref(false)
const selectedBorrow = ref(null)
const returningId = ref('')
const returnDate = ref('')

const finePerLateDay = 5000

const statusOptions = [
  { title: 'Đang mượn', value: 'Borrowed' },
  { title: 'Đã trả', value: 'Returned' }
]

const borrowingCount = computed(() =>
  borrows.value.filter(x => x.status === 'Borrowed').length
)

const returnedCount = computed(() =>
  borrows.value.filter(x => x.status === 'Returned').length
)

const totalFine = computed(() =>
  borrows.value.reduce((sum, item) => sum + Number(item.fineAmount || 0), 0)
)

const filteredBorrows = computed(() => {
  let data = [...borrows.value]

  if (keyword.value) {
    const search = keyword.value.toLowerCase()
    data = data.filter(x =>
      String(x.bookTitle || '').toLowerCase().includes(search)
    )
  }

  if (statusFilter.value) {
    data = data.filter(x => x.status === statusFilter.value)
  }

  return data
})

const pageCount = computed(() => {
  const total = Math.ceil(filteredBorrows.value.length / itemsPerPage.value)
  return total || 1
})

const paginatedBorrows = computed(() => {
  const start = (page.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredBorrows.value.slice(start, end)
})

watch([keyword, statusFilter, itemsPerPage], () => {
  page.value = 1
})

async function loadMyBorrows() {
  loading.value = true
  message.value = ''

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
  page.value = 1
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

function getEstimatedFine(item) {
  const currentFine = Number(item.fineAmount || 0)
  if (currentFine > 0) return currentFine
  return getLateDays(item.dueDate) * finePerLateDay
}

function getFineStatusText(item) {
  const fine = Number(item.fineAmount || 0)
  if (fine <= 0) return 'Không phát sinh'
  if (item.isFinePaid) return 'Đã thanh toán'
  return 'Chưa thanh toán'
}

function getFineStatusColor(item) {
  const fine = Number(item.fineAmount || 0)
  if (fine <= 0) return 'success'
  if (item.isFinePaid) return 'success'
  return 'error'
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

function shortId(value) {
  if (!value) return '-'
  return String(value).slice(0, 8)
}

function toDateTimeLocal(date) {
  const pad = (n) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

onMounted(loadMyBorrows)
</script>

<style scoped>
.fine-stat-val {
  font-size: 22px !important;
  letter-spacing: -0.02em;
}

.book-icon-wrap {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  background: rgba(37, 99, 235, 0.08);
  border: 1px solid rgba(37, 99, 235, 0.15);
  flex-shrink: 0;
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

.info-box {
  min-height: 72px;
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
</style>
