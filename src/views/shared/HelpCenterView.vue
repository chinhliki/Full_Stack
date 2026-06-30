<template>
  <div style="max-width: 800px;">
    <!-- Page header -->
    <div class="mb-6">
      <h2 class="page-title font-weight-black text-secondary">Trợ giúp &amp; Hỗ trợ</h2>
      <p class="page-subtitle">Câu hỏi thường gặp và thông tin liên hệ hỗ trợ vận hành thư viện số</p>
    </div>

    <!-- FAQ Card -->
    <v-card class="table-card pa-6 mb-6" rounded="xl">
      <div class="d-flex align-center mb-4">
        <div class="stat-icon-wrapper-glow info-glowing-icon mr-3">
          <v-icon icon="mdi-help-circle-outline" size="22" />
        </div>
        <h3 class="text-subtitle-1 font-weight-black text-secondary">Câu hỏi thường gặp (FAQs)</h3>
      </div>

      <v-expansion-panels variant="accordion" class="mt-3">
        <v-expansion-panel v-for="faq in faqs[auth.role] || faqs.default" :key="faq.q" rounded="lg" class="mb-2 border">
          <v-expansion-panel-title class="font-weight-bold text-secondary">{{ faq.q }}</v-expansion-panel-title>
          <v-expansion-panel-text class="text-body-2 text-grey-darken-2">{{ faq.a }}</v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card>

    <!-- Contact support -->
    <v-card class="table-card pa-6" rounded="xl">
      <div class="d-flex align-center mb-2">
        <div class="stat-icon-wrapper-glow teal-glowing-icon mr-3">
          <v-icon icon="mdi-card-account-phone-outline" size="22" />
        </div>
        <h3 class="text-subtitle-1 font-weight-black text-secondary">Liên hệ bộ phận kỹ thuật</h3>
      </div>
      <p class="text-caption text-grey mb-6">Bạn gặp sự cố phát sinh ngoài các lỗi trên? Hãy liên hệ trực tiếp với chúng tôi qua các kênh sau:</p>

      <v-row>
        <v-col cols="12" sm="6">
          <v-card variant="outlined" rounded="lg" class="pa-4 d-flex align-center">
            <v-icon icon="mdi-email-outline" size="24" color="primary" class="mr-3" />
            <div>
              <div class="text-caption text-grey">Hòm thư hỗ trợ</div>
              <div class="text-subtitle-2 font-weight-bold text-secondary">support@thuviendigital.vn</div>
            </div>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6">
          <v-card variant="outlined" rounded="lg" class="pa-4 d-flex align-center">
            <v-icon icon="mdi-phone-outline" size="24" color="primary" class="mr-3" />
            <div>
              <div class="text-caption text-grey">Đường dây nóng</div>
              <div class="text-subtitle-2 font-weight-bold text-secondary">1900 1234 (8:00 - 21:00)</div>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script setup>
import { useAuthStore } from '../../stores/authStore'

const auth = useAuthStore()

const faqs = {
  Admin: [
    { q: 'Làm sao để tạo tài khoản Thủ thư mới?', a: 'Vào phần "Quản lý tài khoản" ở menu bên trái → Bấm "Tạo tài khoản mới" → Điền thông tin họ tên, email, mật khẩu và phân quyền Librarian.' },
    { q: 'Tôi có thể nhập hàng loạt sách cùng lúc không?', a: 'Có, truy cập danh mục "Sách" → Bấm nút "Nhập Excel" → Tải file mẫu CSV về máy, điền đầy đủ các thông tin bắt buộc rồi thực hiện tải tệp lên.' },
    { q: 'Cấu hình thời gian mượn và phí phạt quá hạn ở đâu?', a: 'Vào mục "Cấu hình hệ thống" (chỉ dành riêng cho Admin) để điều chỉnh số ngày mượn tối đa và đơn giá tiền phạt trễ hạn mỗi ngày.' }
  ],
  Librarian: [
    { q: 'Làm sao để thực hiện quy trình mượn/trả sách cho độc giả?', a: 'Truy cập vào trang "Quầy lưu thông" (Circulation) từ menu phụ. Nhập mã thẻ độc giả hoặc quét barcode, sau đó chọn đầu sách cần đăng ký mượn/trả.' },
    { q: 'Tôi có thể khóa thẻ thư viện của độc giả không?', a: 'Có, truy cập vào trang "Độc giả" → Tìm độc giả cụ thể → Bấm nút "Khóa thẻ" ở cột Thao tác.' }
  ],
  Reader: [
    { q: 'Làm thế nào để tôi có thể gia hạn hạn trả sách?', a: 'Vào trang "Lịch sử mượn trả", tìm phiếu mượn tương ứng và ấn nút "Gia hạn" nếu sách chưa quá hạn và không bị giữ chỗ.' },
    { q: 'Tôi quên mật khẩu tài khoản thì xử lý như thế nào?', a: 'Bạn hãy liên hệ với thủ thư tại quầy thư viện hoặc admin quản trị để được hỗ trợ đặt lại mật khẩu tạm thời.' },
    { q: 'Mức phạt sách quá hạn của thư viện được quy định như thế nào?', a: 'Mức phạt quá hạn sẽ được tính tự động theo số ngày trễ hạn nhân với đơn giá phí ngày phạt đã quy định trong hệ thống.' }
  ],
  default: [
    { q: 'Làm sao để nhận được hỗ trợ kỹ thuật?', a: 'Vui lòng gửi email đến support@thuviendigital.vn hoặc liên hệ qua số hotline 1900 1234.' }
  ]
}
</script>
