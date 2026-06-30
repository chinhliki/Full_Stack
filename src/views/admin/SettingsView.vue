<template>
  <div>
    <!-- Page header -->
    <div class="d-flex align-center mb-6">
      <div>
        <h2 class="page-title font-weight-black text-secondary">Cấu hình hệ thống</h2>
        <p class="page-subtitle">Quản lý các quy định mượn sách, trả sách và phí phạt quá hạn của thư viện số</p>
      </div>
      <v-spacer />
      <v-btn
        color="primary"
        variant="tonal"
        prepend-icon="mdi-refresh"
        rounded="xl"
        class="font-weight-bold"
        :loading="loading"
        @click="loadSettings"
      >
        Tải lại
      </v-btn>
    </div>

    <v-alert
      v-if="message"
      :type="success ? 'success' : 'error'"
      variant="tonal"
      rounded="lg"
      class="mb-6"
      closable
      @click:close="message = ''"
    >
      {{ message }}
    </v-alert>

    <v-row>
      <v-col cols="12" md="6" lg="5">
        <v-card class="table-card pa-6" rounded="xl" :loading="loading">
          <div class="d-flex align-center mb-6">
            <div class="stat-icon-wrapper-glow info-glowing-icon mr-3">
              <v-icon icon="mdi-tune-variant" size="24" />
            </div>
            <span class="text-h6 font-weight-black text-secondary">Quy định mượn &amp; phạt</span>
          </div>

          <v-form ref="settingsForm" class="mt-4">
            <!-- Max borrowing books -->
            <div class="mb-5">
              <div class="text-caption font-weight-bold text-grey-darken-1 mb-2">
                SỐ LƯỢNG SÁCH TỐI ĐA ĐƯỢC MƯỢN CÙNG LÚC
              </div>
              <v-text-field
                v-model.number="form.maxBorrowingBooks"
                type="number"
                variant="outlined"
                density="comfortable"
                min="1"
                max="20"
                suffix="cuốn"
                rounded="lg"
                prepend-inner-icon="mdi-book-multiple"
                :rules="[
                  v => v !== null && v !== undefined || 'Không được để trống',
                  v => v >= 1 && v <= 20 || 'Số lượng từ 1 đến 20 cuốn'
                ]"
              />
              <p class="text-caption text-grey mt-1">Giới hạn số lượng bản sách tối đa một độc giả được phép giữ cùng một lúc.</p>
            </div>

            <!-- Fine per day -->
            <div class="mb-6">
              <div class="text-caption font-weight-bold text-grey-darken-1 mb-2">
                PHÍ PHẠT QUÁ HẠN MỖI NGÀY TRỄ
              </div>
              <v-text-field
                v-model.number="form.finePerLateDay"
                type="number"
                variant="outlined"
                density="comfortable"
                min="0"
                max="500000"
                suffix="đ / ngày"
                rounded="lg"
                prepend-inner-icon="mdi-cash-marker"
                :rules="[
                  v => v !== null && v !== undefined || 'Không được để trống',
                  v => v >= 0 && v <= 500000 || 'Phí phạt từ 0đ đến 500.000đ'
                ]"
              />
              <p class="text-caption text-grey mt-1">Đơn giá tiền phạt áp dụng tự động cho mỗi ngày trả sách quá hạn.</p>
            </div>

            <v-divider class="mb-5" />

            <div class="d-flex justify-end">
              <v-btn
                color="primary"
                rounded="xl"
                class="px-6 font-weight-bold"
                :loading="saving"
                prepend-icon="mdi-content-save"
                @click="confirmDialog = true"
              >
                Lưu thay đổi
              </v-btn>
            </div>
          </v-form>
        </v-card>
      </v-col>
    </v-row>

    <!-- Confirm dialog -->
    <v-dialog v-model="confirmDialog" max-width="440">
      <v-card rounded="xl" class="pa-4 scale-in-dialog">
        <v-card-title class="d-flex align-center font-weight-black text-secondary">
          <v-icon icon="mdi-alert-circle" color="warning" class="mr-2" />
          Xác nhận thay đổi
        </v-card-title>
        <v-card-text class="pt-2 text-body-2 text-grey-darken-2">
          Thay đổi này sẽ áp dụng cho <strong>toàn bộ hệ thống</strong> ngay lập tức, ảnh hưởng đến tất cả phiếu mượn và tính phí phạt trễ hạn mới. Bạn chắc chắn muốn lưu cấu hình này?
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn variant="tonal" color="secondary" @click="confirmDialog = false" rounded="xl">Hủy</v-btn>
          <v-btn color="primary" variant="flat" :loading="saving" @click="saveSettings" rounded="xl" class="px-5 font-weight-bold">
            Xác nhận lưu
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { borrowSettingsApi } from '../../api/borrowApi'

const message = ref('')
const success = ref(true)
const confirmDialog = ref(false)
const loading = ref(false)
const saving = ref(false)

const settingsForm = ref(null)

const form = ref({ maxBorrowingBooks: 5, finePerLateDay: 5000 })

async function loadSettings() {
  loading.value = true
  message.value = ''
  try {
    const res = await borrowSettingsApi.get()
    form.value = {
      maxBorrowingBooks: res.data?.maxBorrowingBooks ?? 5,
      finePerLateDay: res.data?.finePerLateDay ?? 5000
    }
  } catch (err) {
    success.value = false
    message.value = err.response?.data?.message || 'Không tải được cấu hình mượn/phạt từ máy chủ.'
    console.error(err.response || err)
  } finally {
    loading.value = false
  }
}

async function saveSettings() {
  const { valid } = await settingsForm.value.validate()
  if (!valid) {
    confirmDialog.value = false
    return
  }

  saving.value = true
  try {
    await borrowSettingsApi.update(form.value)
    success.value = true
    message.value = 'Đã lưu cấu hình mượn/phạt thành công!'
    confirmDialog.value = false
  } catch (err) {
    success.value = false
    message.value = err.response?.data?.message || 'Lưu cấu hình thất bại.'
    console.error(err.response || err)
  } finally {
    saving.value = false
  }
}

onMounted(loadSettings)
</script>
