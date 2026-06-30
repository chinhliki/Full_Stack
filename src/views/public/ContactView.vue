<template>
  <PublicLayout>
    <div class="public-container py-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-h4 font-weight-black text-secondary mb-2">Liên hệ với chúng tôi</h1>
        <p class="text-subtitle-2 text-grey">Đóng góp ý kiến hoặc gửi yêu cầu hỗ trợ trực tiếp đến bộ phận kỹ thuật</p>
      </div>

      <v-row>
        <!-- Form card -->
        <v-col cols="12" md="7">
          <v-card class="table-card pa-6" rounded="xl" style="height: 100%;">
            <template v-if="!submitted">
              <h3 class="text-h6 font-weight-black text-secondary mb-4">Gửi lời nhắn phản hồi</h3>

              <v-form ref="contactForm" @submit.prevent="handleSubmit">
                <v-row dense>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="form.name"
                      label="Họ và tên"
                      variant="outlined"
                      rounded="lg"
                      required
                    />
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="form.email"
                      label="Email liên hệ"
                      type="email"
                      variant="outlined"
                      rounded="lg"
                      required
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="form.subject"
                      label="Chủ đề lời nhắn"
                      variant="outlined"
                      rounded="lg"
                      required
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-textarea
                      v-model="form.message"
                      label="Nội dung lời nhắn"
                      variant="outlined"
                      rounded="lg"
                      rows="5"
                      required
                    />
                  </v-col>
                </v-row>

                <div class="d-flex justify-end mt-4">
                  <v-btn
                    type="submit"
                    color="primary"
                    variant="flat"
                    rounded="xl"
                    size="large"
                    class="font-weight-bold px-6 shadow-sm"
                    :loading="sending"
                  >
                    Gửi lời nhắn
                  </v-btn>
                </div>
              </v-form>
            </template>

            <!-- Success state -->
            <div v-else class="text-center py-12">
              <div class="stat-icon-wrapper-glow success-glowing-icon d-inline-flex mb-4" style="width: 56px; height: 56px;">
                <v-icon icon="mdi-check" size="28" />
              </div>
              <h3 class="text-h6 font-weight-black text-secondary">Đã gửi tin nhắn thành công!</h3>
              <p class="text-body-2 text-grey mt-2 mb-6">Chúng tôi đã tiếp nhận ý kiến của bạn và sẽ trả lời qua hòm thư điện tử sớm nhất.</p>
              <v-btn variant="tonal" color="primary" rounded="xl" @click="submitted = false">Gửi thêm phản hồi</v-btn>
            </div>
          </v-card>
        </v-col>

        <!-- Branches & Map Info -->
        <v-col cols="12" md="5" class="d-flex flex-column ga-6">
          <v-card class="table-card pa-6" rounded="xl">
            <h3 class="text-h6 font-weight-black text-secondary mb-4">Các chi nhánh thư viện</h3>

            <div v-for="(branch, idx) in branches" :key="branch.name" class="mb-4">
              <div class="d-flex align-center font-weight-bold text-secondary text-body-2 mb-2">
                <v-icon icon="mdi-map-marker-outline" size="18" color="primary" class="mr-2" />
                {{ branch.name }}
              </div>
              <p class="text-caption text-grey-darken-1 pl-6 mb-2">{{ branch.address }}</p>
              <div class="pl-6 text-caption text-grey">
                <div class="d-flex align-center mb-1">
                  <v-icon icon="mdi-clock-outline" size="14" class="mr-2" /> Giờ làm việc: {{ branch.hours }}
                </div>
                <div class="d-flex align-center">
                  <v-icon icon="mdi-phone-outline" size="14" class="mr-2" /> Hotline: {{ branch.phone }}
                </div>
              </div>
              <v-divider v-if="idx < branches.length - 1" class="my-4" />
            </div>
          </v-card>

          <!-- Map placeholder -->
          <v-card class="table-card pa-6 d-flex flex-column align-center justify-center bg-grey-lighten-4" rounded="xl" style="min-height: 200px; flex-grow: 1;">
            <v-icon icon="mdi-map-outline" size="36" color="grey" class="mb-2" />
            <span class="text-caption text-grey">Bản đồ chi nhánh đang tải...</span>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </PublicLayout>
</template>

<script setup>
import { reactive, ref } from 'vue'
import PublicLayout from '../../layouts/PublicLayout.vue'

const sending = ref(false)
const submitted = ref(false)

const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const branches = [
  {
    name: 'Chi nhánh 1 - Cơ sở chính',
    address: '123 Đường Sách Giáo Dục, Phường Bến Nghé, Quận 1, TP.HCM',
    hours: '08:00 - 21:00 (Thứ 2 - Chủ Nhật)',
    phone: '1900 1234'
  },
  {
    name: 'Chi nhánh 2 - Cơ sở công nghệ',
    address: '456 Đại lộ Nguyễn Văn Linh, Phường Tân Phú, Quận 7, TP.HCM',
    hours: '08:00 - 21:00 (Thứ 2 - Chủ Nhật)',
    phone: '1900 5678'
  }
]

async function handleSubmit() {
  sending.value = true
  await new Promise(resolve => setTimeout(resolve, 600))
  sending.value = false
  submitted.value = true
  form.name = ''
  form.email = ''
  form.subject = ''
  form.message = ''
}
</script>
