<template>
  <PublicLayout>
    <div class="public-container py-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-h4 font-weight-black text-secondary mb-2">Danh mục tài liệu số</h1>
        <p class="text-subtitle-2 text-grey">Tìm kiếm và tra cứu nhanh các ấn phẩm lưu trữ hiện có tại thư viện</p>
      </div>

      <v-row>
        <!-- Sidebar filters -->
        <v-col cols="12" md="3">
          <v-card class="table-card pa-5 mb-4" rounded="xl">
            <h3 class="text-subtitle-1 font-weight-black text-secondary mb-4">Bộ lọc tìm kiếm</h3>

            <!-- Categories -->
            <div class="mb-4">
              <div class="text-caption font-weight-bold text-grey-darken-1 mb-2">DANH MỤC SÁCH</div>
              <div class="d-flex flex-column ga-1 max-h-60 overflow-y-auto">
                <v-checkbox
                  v-for="cat in categoryOptions"
                  :key="cat.name"
                  v-model="selectedCategories"
                  :value="cat.name"
                  :label="`${cat.name} (${cat.count})`"
                  density="compact"
                  color="primary"
                  hide-details
                />
              </div>
            </div>

            <!-- Availability -->
            <v-divider class="my-4" />
            <div>
              <div class="text-caption font-weight-bold text-grey-darken-1 mb-2">TRẠNG THÁI KHO</div>
              <v-checkbox
                v-model="onlyAvailable"
                label="Chỉ hiển thị sách sẵn có"
                density="compact"
                color="primary"
                hide-details
              />
            </div>

            <!-- Clear filters -->
            <v-btn
              v-if="selectedCategories.length || onlyAvailable || keyword"
              variant="tonal"
              color="secondary"
              block
              rounded="xl"
              class="mt-6 font-weight-bold"
              size="small"
              @click="resetFilters"
            >
              Xóa tất cả bộ lọc
            </v-btn>
          </v-card>
        </v-col>

        <!-- Book Catalog Grid -->
        <v-col cols="12" md="9">
          <!-- Search box & Info bar -->
          <v-card class="table-card pa-4 mb-6" rounded="xl">
            <v-row dense class="align-center">
              <v-col cols="12" sm="8">
                <v-text-field
                  v-model="keyword"
                  placeholder="Tìm kiếm tựa sách, tên tác giả..."
                  prepend-inner-icon="mdi-magnify"
                  density="comfortable"
                  variant="outlined"
                  rounded="xl"
                  hide-details
                  clearable
                />
              </v-col>
              <v-col cols="12" sm="4" class="text-sm-right mt-2 mt-sm-0 text-caption text-grey">
                <span v-if="!loading">
                  Hiển thị <strong>{{ pageStart }}-{{ pageEnd }}</strong> trong số {{ filteredBooks.length }} đầu sách
                </span>
              </v-col>
            </v-row>
          </v-card>

          <!-- Skeleton loading -->
          <div v-if="loading">
            <v-row>
              <v-col v-for="n in 6" :key="n" cols="12" sm="6" md="4">
                <v-skeleton-loader type="card" class="rounded-xl border" />
              </v-col>
            </v-row>
          </div>

          <!-- Empty state -->
          <div v-else-if="!filteredBooks.length" class="text-center py-12 text-grey">
            <v-icon icon="mdi-book-search-outline" size="56" color="grey-lighten-1" class="mb-3" />
            <h3 class="text-subtitle-2 font-weight-bold">Không tìm thấy sách phù hợp</h3>
            <p class="text-caption">Hãy thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
            <v-btn color="primary" variant="tonal" rounded="xl" class="mt-4 font-weight-bold" @click="resetFilters">
              Đặt lại bộ lọc
            </v-btn>
          </div>

          <!-- Book Grid -->
          <template v-else>
            <v-row>
              <v-col v-for="book in pagedBooks" :key="book.id" cols="12" sm="6" md="4">
                <v-card class="table-card h-full d-flex flex-column hover-card" rounded="xl">
                  <div class="book-cover-container" style="position: relative; aspect-ratio: 4/3; overflow: hidden; background: #eee;">
                    <v-img v-if="book.coverImageUrl" :src="book.coverImageUrl" height="100%" cover />
                    <div v-else class="d-flex align-center justify-center w-full h-full text-grey bg-grey-lighten-3">
                      <v-icon icon="mdi-book-open-page-variant" size="36" />
                    </div>
                    <v-chip
                      size="x-small"
                      :color="isAvailable(book) ? 'success' : 'error'"
                      variant="flat"
                      class="font-weight-bold"
                      style="position: absolute; top: 12px; right: 12px; z-index: 2;"
                    >
                      {{ isAvailable(book) ? 'Còn sách' : 'Đã mượn' }}
                    </v-chip>
                  </div>
                  <v-card-text class="pa-4 flex-grow-1 d-flex flex-column justify-between">
                    <div>
                      <div class="text-caption text-primary font-weight-bold uppercase mb-1">{{ book.category || 'Khác' }}</div>
                      <h4 class="text-subtitle-2 font-weight-black text-secondary line-clamp-2" style="line-height: 1.3;">{{ book.title }}</h4>
                      <p class="text-caption text-grey mt-1">{{ book.author }}</p>
                    </div>

                    <div class="d-flex align-center justify-between mt-4">
                      <span class="text-caption text-grey-darken-1">Có sẵn: {{ book.availableCopies }} bản</span>
                      <v-btn
                        size="small"
                        icon="mdi-bookmark-plus-outline"
                        color="primary"
                        variant="tonal"
                        :disabled="!isAvailable(book)"
                        :title="isAvailable(book) ? 'Đăng ký mượn sách' : 'Hết sách'"
                        @click="handleReserve(book)"
                      />
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <!-- Pagination -->
            <v-pagination
              v-if="totalPages > 1"
              v-model="page"
              :length="totalPages"
              rounded="circle"
              class="mt-8"
              color="primary"
              density="comfortable"
            />
          </template>
        </v-col>
      </v-row>
    </div>
  </PublicLayout>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PublicLayout from '../../layouts/PublicLayout.vue'
import { useAuthStore } from '../../stores/authStore'
import { bookApi } from '../../api/bookApi'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const books = ref([])
const loading = ref(true)
const keyword = ref(route.query.keyword || '')
const selectedCategories = ref(route.query.category ? [route.query.category] : [])
const onlyAvailable = ref(false)
const page = ref(1)
const pageSize = 9

const categoryOptions = computed(() => {
  const counts = {}
  books.value.forEach(book => {
    const name = book.category || 'Khác'
    counts[name] = (counts[name] || 0) + 1
  })
  return Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
})

const filteredBooks = computed(() => {
  return books.value.filter(book => {
    if (keyword.value) {
      const k = keyword.value.toLowerCase().trim()
      const matches = String(book.title || '').toLowerCase().includes(k) ||
        String(book.author || '').toLowerCase().includes(k)
      if (!matches) return false
    }
    if (selectedCategories.value.length) {
      const cat = book.category || 'Khác'
      if (!selectedCategories.value.includes(cat)) return false
    }
    if (onlyAvailable.value && !isAvailable(book)) return false
    return true
  })
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredBooks.value.length / pageSize)))

const pagedBooks = computed(() => {
  const start = (page.value - 1) * pageSize
  return filteredBooks.value.slice(start, start + pageSize)
})

const pageStart = computed(() => filteredBooks.value.length ? (page.value - 1) * pageSize + 1 : 0)
const pageEnd = computed(() => Math.min(page.value * pageSize, filteredBooks.value.length))

function isAvailable(book) {
  return Number(book.availableCopies || 0) > 0
}

function resetFilters() {
  keyword.value = ''
  selectedCategories.value = []
  onlyAvailable.value = false
}

function handleReserve(book) {
  if (!isAvailable(book)) return

  if (!auth.isLoggedIn) {
    router.push('/login')
    return
  }

  // Redirect to browse view inside app
  router.push('/app/browse')
}

watch([keyword, selectedCategories, onlyAvailable], () => {
  page.value = 1
})

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
  transition: transform 0.2s ease, box-shadow 0.2s ease !important;
}
.hover-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.08) !important;
}
.max-h-60 {
  max-height: 240px;
}
</style>
