<template>
  <PublicLayout>
    <div class="public-container py-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-h4 font-weight-black text-secondary mb-2">Hướng dẫn &amp; Quy định</h1>
        <p class="text-subtitle-2 text-grey">Tìm hiểu quy trình đăng ký thẻ thư viện và quy chế mượn trả tài liệu</p>
      </div>

      <!-- Đăng ký thẻ -->
      <section class="mb-12">
        <div class="text-center mb-6">
          <h2 class="text-h5 font-weight-black text-secondary">Quy trình đăng ký thẻ thư viện</h2>
        </div>

        <v-row>
          <v-col v-for="step in steps" :key="step.title" cols="12" md="4">
            <v-card class="table-card pa-6 text-center h-full d-flex flex-column align-center" rounded="xl">
              <div class="stat-icon-wrapper-glow info-glowing-icon mb-4" style="width: 52px; height: 52px;">
                <v-icon :icon="step.icon" size="24" />
              </div>
              <div class="text-caption font-weight-black text-warning tracking-wide mb-1">BƯỚC {{ step.number }}</div>
              <h3 class="text-subtitle-1 font-weight-bold text-secondary mb-2">{{ step.title }}</h3>
              <p class="text-caption text-grey">{{ step.description }}</p>
            </v-card>
          </v-col>
        </v-row>

        <div class="text-center mt-6">
          <v-btn
            color="primary"
            variant="flat"
            rounded="xl"
            size="large"
            append-icon="mdi-arrow-right"
            class="font-weight-bold"
            @click="router.push('/register')"
          >
            Đăng ký thẻ ngay
          </v-btn>
        </div>
      </section>

      <!-- Quy chế mượn trả -->
      <section class="mb-12">
        <div class="text-center mb-6">
          <h2 class="text-h5 font-weight-black text-secondary">Quy định mượn - trả sách</h2>
        </div>

        <v-card class="table-card overflow-hidden" rounded="xl">
          <v-table class="premium-table">
            <thead>
              <tr class="bg-grey-lighten-4">
                <th class="font-weight-bold text-secondary text-left">Hạng mục quy định</th>
                <th class="font-weight-bold text-secondary text-left">Chi tiết quy chế</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="font-weight-bold text-secondary">
                  <v-icon icon="mdi-book-multiple-outline" size="18" color="primary" class="mr-2" />
                  Số lượng mượn tối đa
                </td>
                <td class="text-secondary">Tối đa <strong>5 cuốn sách</strong> cùng một thời điểm</td>
              </tr>
              <tr>
                <td class="font-weight-bold text-secondary">
                  <v-icon icon="mdi-calendar-clock-outline" size="18" color="primary" class="mr-2" />
                  Thời hạn mượn mặc định
                </td>
                <td class="text-secondary"><strong>14 ngày</strong> kể từ thời điểm nhận sách</td>
              </tr>
              <tr>
                <td class="font-weight-bold text-secondary">
                  <v-icon icon="mdi-cash-multiple" size="18" color="error" class="mr-2" />
                  Mức phí phạt quá hạn
                </td>
                <td>
                  <v-chip color="error" size="small" variant="flat" class="font-weight-bold">
                    5.000 đ / ngày / cuốn
                  </v-chip>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
        <p class="text-caption text-grey text-center mt-3">* Độc giả có thể thực hiện gia hạn thời gian mượn trực tuyến thêm 07 ngày (áp dụng 01 lần duy nhất).</p>
      </section>

      <!-- FAQ Panels -->
      <section class="mb-6">
        <div class="text-center mb-6">
          <h2 class="text-h5 font-weight-black text-secondary">Câu hỏi thường gặp</h2>
        </div>

        <v-expansion-panels variant="accordion">
          <v-expansion-panel v-for="faq in faqs" :key="faq.question" rounded="lg" class="mb-2 border">
            <v-expansion-panel-title class="font-weight-bold text-secondary">{{ faq.question }}</v-expansion-panel-title>
            <v-expansion-panel-text class="text-body-2 text-grey-darken-2">{{ faq.answer }}</v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </section>
    </div>
  </PublicLayout>
</template>

<script setup>
import { useRouter } from 'vue-router'
import PublicLayout from '../../layouts/PublicLayout.vue'

const router = useRouter()

const steps = [
  {
    number: 1,
    icon: 'mdi-form-select',
    title: 'Đăng ký trực tuyến',
    description: 'Khai báo hồ sơ trực tuyến qua form Đăng Ký Thẻ. Bạn sẽ cần chuẩn bị thẻ học sinh/sinh viên hoặc giấy tờ tuỳ thân liên quan.'
  },
  {
    number: 2,
    icon: 'mdi-shield-check-outline',
    title: 'Đối chiếu & Xác minh',
    description: 'Mang theo giấy tờ đối chiếu bản gốc đến quầy làm việc gần nhất để thủ thư duyệt cấp thẻ thư viện.'
  },
  {
    number: 3,
    icon: 'mdi-qrcode',
    title: 'Nhận thẻ thư viện QR',
    description: 'QR Code định danh thẻ thư viện của bạn sẽ hiển thị ngay lập tức trong tài khoản người dùng, sẵn sàng để mượn sách.'
  }
]

const faqs = [
  {
    question: 'Khi mất thẻ thư viện tôi nên làm gì?',
    answer: 'Vui lòng báo ngay cho quầy thủ thư để vô hiệu hóa mã QR cũ tránh thất thoát sách mượn bất hợp pháp, sau đó thực hiện cấp đổi thẻ mới.'
  },
  {
    question: 'Làm thế nào để gia hạn hạn trả sách đang giữ?',
    answer: 'Đăng nhập vào hệ thống cá nhân → lịch sử mượn trả → bấm Gia Hạn. Lưu ý chỉ được gia hạn khi sách chưa quá hạn trả và không có độc giả nào khác đặt giữ chỗ trước.'
  },
  {
    question: 'Làm hỏng sách hoặc mất sách thì đền bù thế nào?',
    answer: 'Liên hệ trực tiếp thủ thư chi nhánh để kiểm tra mức độ hư hại và tính giá đền bù theo quy chế bồi hoàn ấn phẩm thư viện.'
  }
]
</script>
