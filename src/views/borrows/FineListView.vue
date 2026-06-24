<template>
  <div>
    <div class="d-flex align-center mb-4">
      <h2>Công nợ phí phạt</h2>

      <v-spacer />

      <v-btn color="primary" variant="tonal" @click="loadFines">
        Tải lại
      </v-btn>
    </div>

    <v-alert
      v-if="message"
      :type="success ? 'success' : 'error'"
      variant="tonal"
      class="mb-4"
    >
      {{ message }}
    </v-alert>

    <v-row class="mb-4">
      <v-col cols="12" sm="6" md="4">
        <v-card class="stat-card pa-5 d-flex align-center" rounded="xl">
          <div class="stat-info">
            <div class="stat-label text-uppercase mb-1">Phiếu chưa thu phạt</div>
            <div class="stat-value text-amber-darken-3 font-weight-black text-h4">{{ fines.length }}</div>
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
            <div class="stat-value text-error font-weight-black text-h4">{{ formatMoney(totalUnpaidFine) }}</div>
          </div>
          <v-spacer />
          <div class="stat-icon-wrapper-glow error-glowing-icon">
            <v-icon icon="mdi-cash-alert" size="30" />
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-card>
      <v-table>
        <thead>
          <tr>
            <th>Độc giả</th>
            <th>Sách</th>
            <th>Ngày mượn</th>
            <th>Hạn trả</th>
            <th>Ngày trả</th>
            <th>Tiền phạt</th>
            <th>Trạng thái thu</th>
            <th>Thao tác</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="item in fines" :key="item.id">
            <td>{{ item.readerName }}</td>
            <td>{{ item.bookTitle }}</td>
            <td>{{ formatDate(item.borrowDate) }}</td>
            <td>{{ formatDate(item.dueDate) }}</td>
            <td>{{ formatDate(item.returnDate) }}</td>
            <td>{{ formatMoney(item.fineAmount) }}</td>
            <td>
              <v-chip
                :color="item.isFinePaid ? 'green' : 'red'"
                size="small"
              >
                {{ item.isFinePaid ? 'Đã thu' : 'Chưa thu' }}
              </v-chip>
            </td>
            <td>
              <v-btn
                v-if="!item.isFinePaid"
                color="success"
                size="small"
                :loading="loadingId === item.id"
                @click="payFine(item.id)"
              >
                Thu phạt
              </v-btn>
            </td>
          </tr>

          <tr v-if="fines.length === 0">
            <td colspan="8" class="text-center pa-4">
              Không có công nợ phí phạt chưa thanh toán
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { borrowApi } from '../../api/borrowApi'

const fines = ref([])
const message = ref('')
const success = ref(true)
const loadingId = ref('')

const totalUnpaidFine = computed(() => {
  return fines.value.reduce((sum, item) => sum + Number(item.fineAmount || 0), 0)
})

async function loadFines() {
  message.value = ''

  try {
    const res = await borrowApi.getFines()
    fines.value = res.data
  } catch (err) {
    success.value = false
    message.value = err.response?.data?.message || 'Không tải được danh sách công nợ phí phạt'
    console.error(err.response || err)
  }
}

async function payFine(id) {
  loadingId.value = id
  message.value = ''

  try {
    const res = await borrowApi.payFine(id)

    success.value = true
    message.value = res.data.message || 'Thanh toán phí phạt thành công'

    await loadFines()
  } catch (err) {
    success.value = false
    message.value = err.response?.data?.message || 'Thanh toán phí phạt thất bại'
    console.error(err.response || err)
  } finally {
    loadingId.value = ''
  }
}

function formatDate(value) {
  if (!value) return '-'
  return new Date(value).toLocaleString('vi-VN')
}

function formatMoney(value) {
  return new Intl.NumberFormat('vi-VN').format(value || 0) + ' đ'
}

onMounted(loadFines)
</script>