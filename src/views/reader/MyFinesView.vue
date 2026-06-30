<template>
  <div style="max-width: 800px;">
    <!-- Page header -->
    <div class="mb-6">
      <h2 class="page-title font-weight-black text-secondary">Công nợ của tôi</h2>
      <p class="page-subtitle">Theo dõi các khoản phí phạt phát sinh từ việc trả sách quá hạn</p>
    </div>

    <!-- Unpaid warning banner -->
    <v-fade-transition>
      <v-alert
        v-if="unpaidFines.length"
        type="warning"
        variant="tonal"
        rounded="lg"
        class="mb-6"
        icon="mdi-alert-circle"
      >
        Bạn hiện có <strong>{{ unpaidFines.length }}</strong> khoản phạt chưa thanh toán (tổng <strong>{{ formatMoney(totalUnpaid) }}</strong>). Vui lòng quét mã QR thanh toán hoặc đóng phí tại quầy thủ thư.
      </v-alert>
    </v-fade-transition>

    <!-- Loading Skeleton -->
    <div v-if="loading" class="d-flex flex-column ga-3">
      <v-skeleton-loader
        v-for="n in 3"
        :key="n"
        type="list-item-avatar-three-line"
        class="border rounded-xl pa-3"
      />
    </div>

    <!-- Empty State -->
    <div v-else-if="!fines.length" class="d-flex flex-column align-center justify-center py-12 text-center text-grey">
      <div class="stat-icon-wrapper-glow success-glowing-icon mb-4" style="width: 56px; height: 56px;">
        <v-icon icon="mdi-emoticon-happy-outline" size="28" />
      </div>
      <h3 class="text-subtitle-1 font-weight-bold text-secondary">Bạn không có khoản phạt nào!</h3>
      <p class="text-caption mt-1">Hãy tiếp tục giữ vững thói quen trả sách đúng hẹn nhé.</p>
    </div>

    <!-- Fine List -->
    <div v-else class="d-flex flex-column ga-4">
      <v-card v-for="item in fines" :key="item.id" class="table-card pa-5" rounded="xl">
        <div class="d-flex align-start justify-between flex-wrap ga-2">
          <div class="d-flex align-start">
            <div class="stat-icon-wrapper-glow info-glowing-icon mr-3 mt-1">
              <v-icon icon="mdi-book-open-page-variant-outline" size="20" />
            </div>
            <div>
              <h4 class="text-subtitle-2 font-weight-bold text-secondary">{{ item.bookTitle }}</h4>
              <p class="text-caption text-grey mt-1">
                <template v-if="item.returnDate">
                  Trả muộn ({{ formatDate(item.dueDate) }} → {{ formatDate(item.returnDate) }})
                </template>
                <template v-else>
                  Chưa trả sách, đang quá hạn (Hạn trả: {{ formatDate(item.dueDate) }})
                </template>
              </p>
            </div>
          </div>

          <div class="text-right">
            <div class="text-subtitle-1 font-weight-black text-secondary">{{ formatMoney(item.fineAmount) }}</div>
            <v-chip
              size="x-small"
              :color="item.isFinePaid ? 'success' : 'warning'"
              variant="flat"
              class="font-weight-bold mt-1 px-2"
            >
              {{ item.isFinePaid ? 'Đã đóng' : 'Chưa đóng' }}
            </v-chip>
          </div>
        </div>

        <div v-if="item.isFinePaid" class="d-flex justify-end mt-2">
          <v-btn
            variant="text"
            size="small"
            color="primary"
            prepend-icon="mdi-receipt-text-outline"
            class="font-weight-bold px-0"
            @click="openReceipt(item)"
          >
            Xem biên lai
          </v-btn>
        </div>
      </v-card>
    </div>

    <!-- Receipt Dialog -->
    <v-dialog v-model="receiptDialog" max-width="380">
      <v-card rounded="xl" class="pa-6 scale-in-dialog text-center">
        <div v-if="receiptLoading" class="py-8">
          <v-progress-circular indeterminate color="primary" />
        </div>

        <template v-else-if="receiptInvoice">
          <div class="stat-icon-wrapper-glow success-glowing-icon d-inline-flex mb-4" style="width: 52px; height: 52px;">
            <v-icon icon="mdi-check" size="26" />
          </div>
          <h3 class="text-h6 font-weight-black text-secondary mb-4">Biên lai thanh toán</h3>

          <div class="d-flex justify-between py-2 border-b text-body-2 text-grey-darken-1">
            <span>Mã hóa đơn</span>
            <strong class="text-secondary">{{ shortId(receiptInvoice.id) }}</strong>
          </div>
          <div class="d-flex justify-between py-2 border-b text-body-2 text-grey-darken-1">
            <span>Nội dung</span>
            <strong class="text-secondary text-right">{{ receiptInvoice.description }}</strong>
          </div>
          <div class="d-flex justify-between py-2 border-b text-body-2 text-grey-darken-1">
            <span>Số tiền</span>
            <strong class="text-secondary">{{ formatMoney(receiptInvoice.amount) }}</strong>
          </div>
          <div class="d-flex justify-between py-2 text-body-2 text-grey-darken-1">
            <span>Ngày lập</span>
            <strong class="text-secondary">{{ formatDate(receiptInvoice.createdAt) }}</strong>
          </div>
        </template>

        <template v-else>
          <div class="stat-icon-wrapper-glow error-glowing-icon d-inline-flex mb-4" style="width: 52px; height: 52px;">
            <v-icon icon="mdi-receipt-text-remove-outline" size="26" />
          </div>
          <h3 class="text-h6 font-weight-black text-error mb-2">Không tìm thấy hóa đơn</h3>
          <p class="text-caption text-grey">Hóa đơn phạt này chưa được đồng bộ trên hệ thống.</p>
        </template>

        <v-btn block color="primary" variant="tonal" class="mt-6 font-weight-bold" rounded="xl" @click="receiptDialog = false">
          Đóng
        </v-btn>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { borrowApi, invoiceApi } from '../../api/borrowApi'

const fines = ref([])
const loading = ref(true)
const receiptDialog = ref(false)
const receiptLoading = ref(false)
const receiptInvoice = ref(null)

const unpaidFines = computed(() => fines.value.filter(f => !f.isFinePaid))
const totalUnpaid = computed(() => unpaidFines.value.reduce((sum, f) => sum + Number(f.fineAmount || 0), 0))

function formatDate(value) {
  if (!value) return '-'
  return new Date(value).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  })
}

function formatMoney(value) {
  return new Intl.NumberFormat('vi-VN').format(value || 0) + ' đ'
}

function shortId(id) {
  return id ? String(id).slice(0, 8).toUpperCase() : '-'
}

async function openReceipt(item) {
  receiptDialog.value = true
  receiptLoading.value = true
  receiptInvoice.value = null

  try {
    const res = await invoiceApi.getByBorrow(item.id)
    const invoices = Array.isArray(res.data) ? res.data : [res.data].filter(Boolean)
    receiptInvoice.value = invoices.find(inv => inv.type === 'FinePayment') || invoices[0] || null
  } catch (err) {
    receiptInvoice.value = null
    console.error(err.response || err)
  } finally {
    receiptLoading.value = false
  }
}

async function loadFines() {
  loading.value = true
  try {
    const res = await borrowApi.getMyBorrows()
    fines.value = (res.data || []).filter(b => Number(b.fineAmount || 0) > 0)
  } catch (err) {
    fines.value = []
    console.error(err.response || err)
  } finally {
    loading.value = false
  }
}

onMounted(loadFines)
</script>
