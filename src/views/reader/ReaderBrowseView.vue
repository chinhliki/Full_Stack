<template>
  <div>
    <!-- Page Hero Banner -->
    <v-card
      class="table-card pa-8 mb-6 text-center text-md-left d-flex flex-column flex-md-row align-center justify-between"
      rounded="xl"
      style="background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.05), rgba(var(--v-theme-secondary), 0.02)); border: 1px solid rgba(var(--v-theme-primary), 0.1) !important;"
    >
      <div class="mb-4 mb-md-0">
        <h2 class="text-h4 font-weight-black text-secondary mb-2">Khám phá kho tàng tri thức</h2>
        <p class="text-subtitle-2 text-grey-darken-1">Hàng ngàn đầu sách chọn lọc đang chờ đón bạn. Tìm kiếm theo tựa đề hoặc tác giả.</p>
      </div>

      <div class="browse-search-wrapper w-full max-w-sm">
        <v-text-field
          v-model="keyword"
          placeholder="Nhập tên sách, tác giả..."
          prepend-inner-icon="mdi-magnify"
          density="comfortable"
          variant="outlined"
          rounded="xl"
          hide-details
          clearable
          class="glassmorphic-search"
        />
      </div>
    </v-card>

    <!-- Category Filter Row -->
    <div class="d-flex ga-2 flex-wrap mb-6 align-center">
      <v-chip
        variant="flat"
        :color="!activeCategory ? 'primary' : 'grey-lighten-3'"
        :class="!activeCategory ? 'text-white' : 'text-secondary'"
        class="font-weight-bold px-4"
        style="cursor: pointer;"
        @click="activeCategory = null"
      >
        Tất cả thể loại
      </v-chip>

      <v-chip
        v-for="cat in categories"
        :key="cat"
        variant="flat"
        :color="activeCategory === cat ? 'primary' : 'grey-lighten-3'"
        :class="activeCategory === cat ? 'text-white' : 'text-secondary'"
        class="font-weight-bold px-4"
        style="cursor: pointer;"
        @click="activeCategory = cat"
      >
        {{ cat }}
      </v-chip>
    </div>

    <!-- Loading -->
    <div v-if="loading">
      <v-row>
        <v-col v-for="n in 8" :key="n" cols="12" sm="6" md="4" lg="3">
          <v-skeleton-loader type="card" class="rounded-xl border" />
        </v-col>
      </v-row>
    </div>

    <template v-else>
      <!-- Recommendations Section -->
      <section v-if="!activeCategory && !keyword" class="mb-8">
        <div class="d-flex align-center mb-4">
          <div class="stat-icon-wrapper-glow success-glowing-icon mr-3" style="width: 38px; height: 38px;">
            <v-icon icon="mdi-heart-outline" size="18" />
          </div>
          <h3 class="text-subtitle-1 font-weight-black text-secondary">Sách khuyên đọc dành cho bạn</h3>
        </div>

        <v-row dense>
          <v-col v-for="book in recommended" :key="book.id" cols="12" sm="6" md="4" lg="3">
            <v-card class="table-card h-full d-flex flex-column hover-card cursor-pointer" rounded="xl" @click="openDetail(book)">
              <div class="book-cover-container" style="position: relative; aspect-ratio: 2/3; overflow: hidden; background: #eee;">
                <v-img v-if="book.coverImageUrl" :src="book.coverImageUrl" height="100%" cover />
                <div v-else class="d-flex flex-column align-center justify-center w-full h-full text-grey-lighten-1 bg-grey-lighten-3">
                  <v-icon icon="mdi-book-open-page-variant" size="48" />
                  <span class="text-caption mt-1">Không có bìa</span>
                </div>
                <v-chip
                  size="x-small"
                  :color="isAvailable(book) ? 'success' : 'error'"
                  variant="flat"
                  class="font-weight-bold"
                  style="position: absolute; top: 12px; right: 12px; z-index: 2;"
                >
                  {{ isAvailable(book) ? 'Còn sách' : 'Hết sách' }}
                </v-chip>
              </div>
              <v-card-text class="pa-4 flex-grow-1 d-flex flex-column justify-between">
                <div>
                  <div class="text-caption text-primary font-weight-bold uppercase mb-1">{{ book.category || 'Khác' }}</div>
                  <h4 class="text-subtitle-2 font-weight-black text-secondary line-clamp-2" style="line-height: 1.3;">{{ book.title }}</h4>
                </div>
                <div class="text-caption text-grey mt-2">{{ book.author }}</div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </section>

      <!-- Main Catalog List -->
      <section class="mb-8">
        <div class="d-flex align-center mb-4">
          <div class="stat-icon-wrapper-glow info-glowing-icon mr-3" style="width: 38px; height: 38px;">
            <v-icon icon="mdi-book-multiple-outline" size="18" />
          </div>
          <h3 class="text-subtitle-1 font-weight-black text-secondary">
            {{ (keyword || activeCategory) ? 'Kết quả tìm kiếm' : 'Tất cả đầu sách trong thư viện' }}
          </h3>
        </div>

        <div v-if="!filteredBooks.length" class="text-center py-12 text-grey">
          <v-icon icon="mdi-book-search-outline" size="56" color="grey-lighten-1" class="mb-3" />
          <p class="text-subtitle-2 font-weight-bold">Không tìm thấy đầu sách nào phù hợp</p>
          <p class="text-caption">Vui lòng thử lại với từ khóa khác.</p>
        </div>

        <v-row v-else dense>
          <v-col v-for="book in filteredBooks" :key="book.id" cols="12" sm="6" md="4" lg="3">
            <v-card class="table-card h-full d-flex flex-column hover-card cursor-pointer" rounded="xl" @click="openDetail(book)">
              <div class="book-cover-container" style="position: relative; aspect-ratio: 2/3; overflow: hidden; background: #eee;">
                <v-img v-if="book.coverImageUrl" :src="book.coverImageUrl" height="100%" cover />
                <div v-else class="d-flex flex-column align-center justify-center w-full h-full text-grey-lighten-1 bg-grey-lighten-3">
                  <v-icon icon="mdi-book-open-page-variant" size="48" />
                  <span class="text-caption mt-1">Không có bìa</span>
                </div>
                <v-chip
                  size="x-small"
                  :color="isAvailable(book) ? 'success' : 'error'"
                  variant="flat"
                  class="font-weight-bold"
                  style="position: absolute; top: 12px; right: 12px; z-index: 2;"
                >
                  {{ isAvailable(book) ? 'Còn sách' : 'Hết sách' }}
                </v-chip>
              </div>
              <v-card-text class="pa-4 flex-grow-1 d-flex flex-column justify-between">
                <div>
                  <div class="text-caption text-primary font-weight-bold uppercase mb-1">{{ book.category || 'Khác' }}</div>
                  <h4 class="text-subtitle-2 font-weight-black text-secondary line-clamp-2" style="line-height: 1.3;">{{ book.title }}</h4>
                </div>
                <div class="text-caption text-grey mt-2">{{ book.author }}</div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </section>
    </template>

    <!-- Detail Dialog -->
    <v-dialog v-model="detailDialog" max-width="520">
      <v-card v-if="detailBook" rounded="xl" class="overflow-hidden">
        <div class="detail-hero-banner" style="position: relative; height: 180px; background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.1), rgba(var(--v-theme-secondary), 0.05));">
          <div class="d-flex align-center justify-center w-full h-full">
            <v-icon icon="mdi-book-open-page-variant" size="64" color="primary" style="opacity: 0.2;" />
          </div>
        </div>

        <v-card-text class="pa-6" style="margin-top: -60px;">
          <!-- Book Cover Floating -->
          <div class="d-flex align-end mb-4">
            <v-card class="elevation-4 mr-4" rounded="lg" style="width: 100px; height: 140px; overflow: hidden; background: #fff;">
              <v-img v-if="detailBook.coverImageUrl" :src="detailBook.coverImageUrl" height="100%" cover />
              <div v-else class="d-flex align-center justify-center w-full h-full bg-grey-lighten-3 text-grey">
                <v-icon icon="mdi-book" size="28" />
              </div>
            </v-card>
            <div>
              <v-chip size="x-small" color="primary" class="font-weight-bold mb-2">{{ detailBook.category || 'Khác' }}</v-chip>
              <h3 class="text-h6 font-weight-black text-secondary line-clamp-2" style="line-height: 1.3;">{{ detailBook.title }}</h3>
              <p class="text-caption text-grey mt-1">{{ detailBook.author }}</p>
            </div>
          </div>

          <v-divider class="my-4" />

          <!-- Information Grid -->
          <v-row dense class="text-body-2 text-grey-darken-2">
            <v-col cols="6">
              <v-icon icon="mdi-domain" size="16" class="mr-1 text-grey" /> Nhà xuất bản:
            </v-col>
            <v-col cols="6" class="font-weight-bold text-secondary text-right">
              {{ detailBook.publisher || 'Chưa rõ' }}
            </v-col>
            <v-col cols="6">
              <v-icon icon="mdi-calendar-range" size="16" class="mr-1 text-grey" /> Năm xuất bản:
            </v-col>
            <v-col cols="6" class="font-weight-bold text-secondary text-right">
              {{ detailBook.publishingYear || 'Chưa rõ' }}
            </v-col>
            <v-col cols="6">
              <v-icon icon="mdi-check-circle-outline" size="16" class="mr-1 text-grey" /> Trạng thái kho:
            </v-col>
            <v-col cols="6" :class="isAvailable(detailBook) ? 'text-success' : 'text-error'" class="font-weight-bold text-right">
              {{ isAvailable(detailBook) ? `Sẵn sàng (${detailBook.availableCopies} cuốn)` : 'Hết sách' }}
            </v-col>
          </v-row>

          <v-divider class="my-4" />

          <!-- Borrow Request Action -->
          <v-btn
            block
            color="primary"
            rounded="xl"
            size="large"
            class="font-weight-bold mt-4"
            prepend-icon="mdi-book-clock-outline"
            :disabled="!isAvailable(detailBook)"
            @click="confirmReserveDialog = true"
          >
            Đăng ký mượn sách
          </v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Confirm Borrow Request Dialog -->
    <v-dialog v-model="confirmReserveDialog" max-width="400">
      <v-card rounded="xl" class="pa-4 scale-in-dialog">
        <v-card-title class="d-flex align-center font-weight-black text-secondary">
          <v-icon icon="mdi-book-clock" color="primary" class="mr-2" />
          Yêu cầu mượn sách
        </v-card-title>
        <v-card-text class="pt-2 text-body-2 text-grey-darken-2">
          Bạn muốn gửi yêu cầu mượn cuốn <strong>{{ detailBook?.title }}</strong>? Thủ thư sẽ kiểm tra và phê duyệt phiếu mượn cho bạn tại quầy.
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn variant="tonal" color="secondary" @click="confirmReserveDialog = false" rounded="xl">Hủy</v-btn>
          <v-btn color="primary" variant="flat" :loading="reserving" @click="submitReserve" rounded="xl" class="px-5 font-weight-bold">
            Gửi yêu cầu
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Info/Result Alert Dialog -->
    <v-dialog v-model="reserveInfoDialog" max-width="380">
      <v-card rounded="xl" class="pa-6 text-center scale-in-dialog">
        <div class="d-inline-flex mb-4">
          <div :class="reserveSuccess ? 'success-glowing-icon' : 'error-glowing-icon'" class="stat-icon-wrapper-glow" style="width: 52px; height: 52px;">
            <v-icon :icon="reserveSuccess ? 'mdi-clock-check-outline' : 'mdi-alert-circle-outline'" size="26" />
          </div>
        </div>
        <h3 class="text-h6 font-weight-black text-secondary mb-2">
          {{ reserveSuccess ? 'Đã gửi yêu cầu' : 'Không thể gửi yêu cầu' }}
        </h3>
        <p class="text-body-2 text-grey-darken-1 mb-4">{{ reserveMessage }}</p>
        <v-btn block color="primary" rounded="xl" class="font-weight-bold" @click="reserveInfoDialog = false">
          Đã hiểu
        </v-btn>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { bookApi } from '../../api/bookApi'
import { borrowApi } from '../../api/borrowApi'

const route = useRoute()

const books = ref([])
const loading = ref(true)
const keyword = ref(route.query.keyword || '')
const activeCategory = ref(route.query.category || null)
const detailDialog = ref(false)
const detailBook = ref(null)
const reserveInfoDialog = ref(false)
const confirmReserveDialog = ref(false)
const reserving = ref(false)
const reserveSuccess = ref(true)
const reserveMessage = ref('')

async function submitReserve() {
  reserving.value = true
  try {
    await borrowApi.requestBorrow({
      bookId: detailBook.value.id,
      requestedDays: 14
    })
    reserveSuccess.value = true
    reserveMessage.value = 'Yêu cầu của bạn đã được gửi lên hệ thống. Hãy theo dõi trạng thái phê duyệt tại thẻ mượn.'
    confirmReserveDialog.value = false
    detailDialog.value = false
  } catch (err) {
    reserveSuccess.value = false
    reserveMessage.value = err.response?.data?.message || 'Có lỗi xảy ra khi gửi yêu cầu mượn.'
    console.error(err.response || err)
  } finally {
    reserving.value = false
    reserveInfoDialog.value = true
  }
}

const categories = computed(() => {
  const set = new Set(books.value.map(b => b.category).filter(Boolean))
  return Array.from(set).slice(0, 8)
})

const filteredBooks = computed(() => {
  return books.value.filter(book => {
    if (activeCategory.value && book.category !== activeCategory.value) return false
    if (keyword.value) {
      const k = keyword.value.toLowerCase().trim()
      return String(book.title || '').toLowerCase().includes(k) ||
        String(book.author || '').toLowerCase().includes(k)
    }
    return true
  })
})

const recommended = computed(() => books.value.slice(0, 4))

function isAvailable(book) {
  return Number(book.availableCopies || 0) > 0
}

function openDetail(book) {
  detailBook.value = book
  detailDialog.value = true
}

async function loadBooks() {
  loading.value = true
  try {
    const res = await bookApi.getAll({})
    books.value = Array.isArray(res.data) ? res.data : []
  } catch (err) {
    books.value = []
    console.error(err.response || err)
  } finally {
    loading.value = false
  }
}

onMounted(loadBooks)
</script>

<style scoped>
.hover-card {
  transition: transform 0.25s ease, box-shadow 0.25s ease !important;
}
.hover-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0,0,0,0.08) !important;
}
</style>
