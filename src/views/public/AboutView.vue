<template>
  <PublicLayout>
    <!-- Mission Hero Section -->
    <div
      class="py-16 text-center"
      style="background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.05), rgba(var(--v-theme-secondary), 0.02)); border-bottom: 1px solid #eee;"
    >
      <div class="public-container" style="max-width: 800px;">
        <h1 class="text-h4 font-weight-black text-secondary mb-4">Sứ mệnh của chúng tôi</h1>
        <p class="text-subtitle-1 text-grey-darken-1" style="line-height: 1.6;">
          Xây dựng cầu nối tri thức vững chắc giữa di sản học thuật truyền thống và kỷ nguyên số, mang đến trải nghiệm tiếp cận và nghiên cứu thông tin đẳng cấp cho toàn bộ độc giả.
        </p>
      </div>
    </div>

    <!-- Story & Stats Section -->
    <div class="public-container py-12">
      <v-row class="align-center">
        <v-col cols="12" md="7">
          <v-card class="table-card pa-6" rounded="xl">
            <span class="text-caption font-weight-bold text-primary tracking-wide mb-2 d-block">CÂU CHUYỆN THƯ VIỆN SỐ</span>
            <h2 class="text-h5 font-weight-black text-secondary mb-4">Nền tảng số hóa tri thức hiện đại</h2>
            <p class="text-body-2 text-grey-darken-1 mb-4" style="line-height: 1.7;">
              Khởi nguồn từ khát vọng số hóa hệ sinh thái tri thức đồ sộ của hệ thống giáo dục đại học, Thư Viện Số không đơn thuần chỉ là một hệ lưu trữ file tài liệu tĩnh. Chúng tôi là một cổng giao tiếp học thuật sống động, nơi sách báo, luận văn và các tài liệu nghiên cứu được bảo tồn, phân tích và chia sẻ tiện lợi nhất.
            </p>
            <p class="text-body-2 text-grey-darken-1" style="line-height: 1.7;">
              Bằng việc áp dụng công nghệ tìm kiếm tiên tiến và giao diện tối giản mang tính ứng dụng cao, chúng tôi tái tạo không gian nghiên cứu tĩnh lặng, tập trung của một thư viện truyền thống ngay trên màn hình thiết bị cá nhân của bạn.
            </p>
          </v-card>
        </v-col>

        <v-col cols="12" md="5">
          <v-row dense>
            <v-col cols="12">
              <v-card class="pa-6 text-white text-center" rounded="xl" color="secondary" style="background: linear-gradient(135deg, var(--v-theme-secondary), #111b15);">
                <v-icon icon="mdi-file-document-multiple-outline" size="32" color="warning" class="mb-2" />
                <div class="text-h3 font-weight-black text-warning">45.000+</div>
                <div class="text-caption font-weight-bold text-grey-lighten-1 mt-1">ẤN PHẨM SỐ HÓA</div>
              </v-card>
            </v-col>
            <v-col cols="12">
              <v-card class="pa-6 text-center table-card" rounded="xl">
                <v-icon icon="mdi-bank-outline" size="32" color="primary" class="mb-2" />
                <div class="text-h3 font-weight-black text-secondary">3</div>
                <div class="text-caption font-weight-bold text-grey mt-1">CHI NHÁNH LIÊN KẾT</div>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </div>

    <!-- Core Values -->
    <div class="bg-grey-lighten-4 py-12">
      <div class="public-container">
        <div class="text-center mb-8">
          <h2 class="text-h5 font-weight-black text-secondary mb-2">Giá trị cốt lõi</h2>
          <div class="mx-auto" style="width: 48px; height: 3px; background: orange; border-radius: 9px;"></div>
        </div>

        <v-row>
          <v-col v-for="value in coreValues" :key="value.title" cols="12" md="4">
            <v-card class="table-card pa-6 text-center h-full d-flex flex-column align-center" rounded="xl">
              <div class="stat-icon-wrapper-glow info-glowing-icon mb-4" style="width: 56px; height: 56px;">
                <v-icon :icon="value.icon" size="26" />
              </div>
              <h3 class="text-subtitle-1 font-weight-bold text-secondary mb-2">{{ value.title }}</h3>
              <p class="text-caption text-grey">{{ value.description }}</p>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </div>

    <!-- Timeline Journey -->
    <div class="public-container py-12">
      <div class="text-center mb-8">
        <h2 class="text-h5 font-weight-black text-secondary">Hành trình phát triển</h2>
      </div>

      <div style="max-width: 600px; margin: 0 auto;">
        <v-timeline side="end" align="start">
          <v-timeline-item
            v-for="item in timeline"
            :key="item.year"
            dot-color="primary"
            size="small"
          >
            <template #opposite>
              <span class="font-weight-bold text-secondary text-subtitle-1">{{ item.year }}</span>
            </template>
            <div>
              <h4 class="font-weight-bold text-secondary text-subtitle-2 mb-1">{{ item.title }}</h4>
              <p class="text-caption text-grey">{{ item.description }}</p>
            </div>
          </v-timeline-item>
        </v-timeline>
      </div>
    </div>
  </PublicLayout>
</template>

<script setup>
import PublicLayout from '../../layouts/PublicLayout.vue'

const coreValues = [
  {
    icon: 'mdi-school-outline',
    title: 'Học thuật xuất sắc',
    description: 'Đảm bảo cung cấp nguồn tư liệu phong phú, hữu ích và tin cậy nhất phục vụ cho các đề án giảng dạy, học tập chuyên sâu.'
  },
  {
    icon: 'mdi-human-handsup',
    title: 'Tiếp cận không ranh giới',
    description: 'Phá bỏ mọi rào cản địa lý và thời gian, mang tri thức đến mọi thiết bị di động với trải nghiệm tối ưu.'
  },
  {
    icon: 'mdi-account-group-outline',
    title: 'Cộng đồng phát triển',
    description: 'Xây dựng môi trường chia sẻ giao lưu kết nối học tập thân thiện giữa độc giả, thủ thư và chuyên gia.'
  }
]

const timeline = [
  {
    year: '2020',
    title: 'Khởi tạo dự án',
    description: 'Kế hoạch số hóa tài nguyên liên chi nhánh được thành lập, khởi đầu số hóa kho tài liệu bản giấy.'
  },
  {
    year: '2022',
    title: 'Đồng bộ hóa hệ thống',
    description: 'Kết nối liên thông thư viện 3 cơ sở đào tạo, đồng bộ hóa hơn 20.000 đầu sách học thuật số.'
  },
  {
    year: 'Hiện tại',
    title: 'Hệ sinh thái kết nối số',
    description: 'Nâng cấp giao diện trực quan thế hệ mới tích hợp quy trình mượn trả tự động và quản trị thông minh.'
  }
]
</script>
