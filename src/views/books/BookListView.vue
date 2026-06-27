<template>
  <div>
    <!-- BorrowCartDrawer — FAB + slide drawer (Reader only) -->
    <BorrowCartDrawer
      v-if="isReader"
      ref="cartDrawerRef"
      :my-active-borrow-count="myActiveBorrowCount"
      @checkout-success="onCartCheckoutSuccess"
    />

    <div class="action-bar">
      <div>
        <div class="page-title">{{ isReader ? 'Danh sách sách' : 'Quản lý sách' }}</div>
        <div class="page-subtitle">
          {{ isReader
            ? 'Tìm và thêm sách vào giỏ mượn, hoặc đặt chỗ khi sách tạm hết'
            : 'Quản lý thông tin sách, ảnh bìa, số lượng bản và trạng thái sẵn sàng cho mượn' }}
        </div>
      </div>

      <v-spacer />

      <v-btn
        color="primary"
        variant="tonal"
        prepend-icon="mdi-refresh"
        :loading="loading"
        @click="loadBooks"
      >
        Tải lại
      </v-btn>

      <v-btn
        v-if="canManageBook"
        color="error"
        variant="tonal"
        prepend-icon="mdi-delete-sweep"
        :disabled="selectedBookIds.length === 0"
        @click="deleteSelectedBooks"
      >
        Xóa đã chọn
      </v-btn>

      <v-btn
        v-if="canManageBook"
        color="primary"
        prepend-icon="mdi-plus"
        @click="openCreateDialog"
      >
        Thêm sách
      </v-btn>
    </div>

    <v-alert
      v-if="message"
      :type="success ? 'success' : 'error'"
      variant="tonal"
      class="mb-4"
      rounded="lg"
    >
      {{ message }}
    </v-alert>

    <v-alert
      v-if="isReader && myActiveBorrowCount >= 5"
      type="error"
      variant="tonal"
      class="mb-4"
      rounded="lg"
      icon="mdi-alert-circle"
    >
      Bạn đang mượn <b>5/5</b> quyển sách (đã đạt giới hạn tối đa). Vui lòng trả sách trước khi mượn thêm.
    </v-alert>

    <v-alert
      v-else-if="isReader && myActiveBorrowCount >= 4"
      type="warning"
      variant="tonal"
      class="mb-4"
      rounded="lg"
      icon="mdi-alert"
    >
      Bạn đang mượn <b>{{ myActiveBorrowCount }}/5</b> quyển. Bạn chỉ còn có thể mượn thêm <b>{{ 5 - myActiveBorrowCount }}</b> quyển nữa.
    </v-alert>

    <v-row class="mb-5">
      <v-col cols="12" sm="6" md="3">
        <v-card class="stat-card pa-5 d-flex align-center" rounded="xl">
          <div class="stat-info">
            <div class="stat-label text-uppercase mb-1">Tổng sách</div>
            <div class="stat-value text-primary font-weight-black text-h4">{{ books.length }}</div>
          </div>
          <v-spacer />
          <div class="stat-icon-wrapper-glow info-glowing-icon">
            <v-icon icon="mdi-bookshelf" size="30" />
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="stat-card pa-5 d-flex align-center" rounded="xl">
          <div class="stat-info">
            <div class="stat-label text-uppercase mb-1">Có thể mượn</div>
            <div class="stat-value text-success font-weight-black text-h4">{{ availableBookCount }}</div>
          </div>
          <v-spacer />
          <div class="stat-icon-wrapper-glow success-glowing-icon">
            <v-icon icon="mdi-book-check" size="30" />
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="stat-card pa-5 d-flex align-center" rounded="xl">
          <div class="stat-info">
            <div class="stat-label text-uppercase mb-1">Hết sách</div>
            <div class="stat-value text-error font-weight-black text-h4">{{ unavailableBookCount }}</div>
          </div>
          <v-spacer />
          <div class="stat-icon-wrapper-glow error-glowing-icon">
            <v-icon icon="mdi-book-remove" size="30" />
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <!-- Admin: checkbox selected count | Reader: cart count -->
        <v-card
          class="stat-card pa-5 d-flex align-center"
          :class="{ 'cursor-pointer': isReader && cart.count > 0 }"
          rounded="xl"
          @click="isReader && cart.count > 0 ? cartDrawerRef?.open() : null"
        >
          <div class="stat-info">
            <div class="stat-label text-uppercase mb-1">{{ isReader ? 'Trong giỏ' : 'Đã chọn' }}</div>
            <div class="stat-value text-purple font-weight-black text-h4">
              {{ isReader ? cart.count : selectedBookIds.length }}
            </div>
          </div>
          <v-spacer />
          <div class="stat-icon-wrapper-glow purple-glowing-icon">
            <v-icon :icon="isReader ? 'mdi-cart' : 'mdi-checkbox-marked-circle-outline'" size="30" />
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-card class="soft-card pa-5 mb-5">
      <v-row align="center">
        <v-col cols="12" md="4">
          <v-text-field
            v-model="keyword"
            label="Tìm theo mã sách / tên / tác giả / ISBN"
            prepend-inner-icon="mdi-magnify"
            clearable
            hide-details
            @keyup.enter="loadBooks"
          />
        </v-col>

        <v-col cols="12" md="2">
          <v-text-field
            v-model="category"
            label="Thể loại"
            prepend-inner-icon="mdi-shape-outline"
            clearable
            hide-details
            @keyup.enter="loadBooks"
          />
        </v-col>

        <v-col cols="12" md="2">
          <v-text-field
            v-model="publishingYear"
            label="Năm xuất bản"
            prepend-inner-icon="mdi-calendar"
            type="number"
            clearable
            hide-details
            @keyup.enter="loadBooks"
          />
        </v-col>

        <v-col cols="12" md="2">
          <v-select
            v-model="statusFilter"
            label="Trạng thái"
            :items="statusOptions"
            prepend-inner-icon="mdi-filter"
            clearable
            hide-details
          />
        </v-col>

        <v-col cols="12" md="2">
          <div class="d-flex ga-2">
            <v-tooltip text="Tìm kiếm">
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  color="primary"
                  icon="mdi-magnify"
                  @click="loadBooks"
                />
              </template>
            </v-tooltip>

            <v-tooltip text="Xóa bộ lọc">
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  color="secondary"
                  variant="tonal"
                  icon="mdi-filter-remove"
                  @click="resetFilters"
                />
              </template>
            </v-tooltip>
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
            <th v-if="canManageBook" style="width: 48px;">
              <v-checkbox-btn
                v-model="allCurrentPageSelected"
                :indeterminate="isCurrentPageIndeterminate"
                color="primary"
              />
            </th>
            <th>Ảnh</th>
            <th>Mã sách / ISBN</th>
            <th>Tên sách</th>
            <th>Tác giả</th>
            <th>NXB</th>
            <th>Thể loại</th>
            <th>Năm XB</th>
            <th>Tổng</th>
            <th>Còn</th>
            <th>Trạng thái</th>
            <th v-if="canManageBook" class="text-center">Hành động</th>
            <th v-if="isReader" class="text-center">Thao tác</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="book in paginatedBooks" :key="book.id">
            <td v-if="canManageBook">
              <v-checkbox-btn
                v-model="selectedBookIds"
                :value="book.id"
                color="primary"
              />
            </td>

            <td>
              <div class="book-cover">
                <v-img
                  v-if="hasCover(book)"
                  :src="book.coverImageUrl"
                  width="58"
                  height="78"
                  cover
                  rounded="lg"
                  @error="markImageError(book.id)"
                >
                  <template #placeholder>
                    <div class="cover-placeholder">
                      <v-progress-circular indeterminate size="20" />
                    </div>
                  </template>
                </v-img>

                <div v-else class="cover-fallback">
                  <v-icon icon="mdi-book-open-page-variant" size="30" />
                </div>
              </div>
            </td>

            <td>
              <div class="font-weight-bold text-primary">
                {{ book.isbn || shortId(book.id) }}
              </div>
              <div class="text-caption text-grey-darken-1">
                ID: {{ shortId(book.id) }}
              </div>
            </td>

            <td>
              <div class="font-weight-bold">
                {{ book.title }}
              </div>
              <div class="text-caption text-grey-darken-1">
                {{ book.coverImageUrl ? 'Có ảnh bìa' : 'Chưa có ảnh bìa' }}
              </div>
            </td>

            <td>{{ book.author }}</td>
            <td>{{ book.publisher || '-' }}</td>
            <td>{{ book.category || '-' }}</td>
            <td>{{ book.publishingYear || '-' }}</td>
            <td>{{ book.totalCopies }}</td>

            <td>
              <span :class="Number(book.availableCopies || 0) > 0 ? 'text-success font-weight-bold' : 'text-error font-weight-bold'">
                {{ book.availableCopies }}
              </span>
            </td>

            <td>
              <v-chip
                :color="isBookAvailable(book) ? 'success' : 'error'"
                size="small"
                variant="tonal"
              >
                <v-icon
                  start
                  :icon="isBookAvailable(book) ? 'mdi-check-circle' : 'mdi-close-circle'"
                />
                {{ isBookAvailable(book) ? 'Có thể mượn' : 'Hết sách' }}
              </v-chip>
            </td>

            <td v-if="canManageBook">
              <div class="d-flex justify-center ga-2">
                <v-tooltip text="Xem chi tiết">
                  <template #activator="{ props }">
                    <v-btn
                      v-bind="props"
                      icon="mdi-eye"
                      size="small"
                      color="info"
                      variant="tonal"
                      @click="openDetailDialog(book)"
                    />
                  </template>
                </v-tooltip>

                <v-tooltip text="Sửa sách">
                  <template #activator="{ props }">
                    <v-btn
                      v-bind="props"
                      icon="mdi-pencil"
                      size="small"
                      color="warning"
                      variant="tonal"
                      @click="openEditDialog(book)"
                    />
                  </template>
                </v-tooltip>

                <v-tooltip text="Xóa sách">
                  <template #activator="{ props }">
                    <v-btn
                      v-bind="props"
                      icon="mdi-delete"
                      size="small"
                      color="error"
                      variant="tonal"
                      @click="deleteBook(book)"
                    />
                  </template>
                </v-tooltip>
              </div>
            </td>

            <td v-if="isReader" class="text-center">
              <BookActionBtn
                :book="book"
                :my-active-borrow-count="myActiveBorrowCount"
              />
            </td>
          </tr>

          <tr v-if="paginatedBooks.length === 0">
            <td :colspan="canManageBook ? 12 : isReader ? 12 : 11" class="text-center pa-8">
              <v-icon icon="mdi-database-search-outline" size="46" color="grey" />
              <div class="text-subtitle-1 font-weight-bold mt-2">
                Không tìm thấy sách phù hợp
              </div>
              <div class="text-body-2 text-grey-darken-1">
                Thử thay đổi từ khóa, thể loại, năm xuất bản hoặc trạng thái lọc.
              </div>
            </td>
          </tr>
        </tbody>
      </v-table>

      <v-divider />

      <div class="d-flex align-center justify-space-between flex-wrap pa-4 ga-3">
        <div class="text-body-2 text-grey-darken-1">
          Hiển thị
          <b>{{ paginatedBooks.length }}</b>
          /
          <b>{{ filteredBooks.length }}</b>
          sách
        </div>

        <div class="d-flex align-center ga-3">
          <v-select
            v-model="itemsPerPage"
            :items="[5, 10, 20, 50]"
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

    <v-dialog v-model="borrowDialog" max-width="520">
      <v-card v-if="borrowingBook">
        <v-card-title class="d-flex align-center">
          <v-icon icon="mdi-book-plus" color="primary" class="mr-2" />
          Đăng ký mượn sách

          <v-spacer />

          <v-btn
            icon="mdi-close"
            variant="text"
            @click="borrowDialog = false"
          />
        </v-card-title>

        <v-divider />

        <v-card-text class="pt-5">
          <div class="d-flex align-center ga-4 mb-5">
            <div class="book-cover">
              <v-img
                v-if="hasCover(borrowingBook)"
                :src="borrowingBook.coverImageUrl"
                width="58"
                height="78"
                cover
                rounded="lg"
              />
              <div v-else class="cover-fallback">
                <v-icon icon="mdi-book-open-page-variant" size="28" />
              </div>
            </div>

            <div>
              <div class="text-subtitle-1 font-weight-black">{{ borrowingBook.title }}</div>
              <div class="text-body-2 text-grey-darken-1">{{ borrowingBook.author }}</div>
              <v-chip size="x-small" color="success" variant="tonal" class="mt-1">
                Còn {{ borrowingBook.availableCopies }} bản
              </v-chip>
            </div>
          </div>

          <v-alert
            v-if="myActiveBorrowCount >= 4"
            :type="myActiveBorrowCount >= 5 ? 'error' : 'warning'"
            variant="tonal"
            class="mb-4"
            rounded="lg"
            density="compact"
          >
            Bạn đang mượn <b>{{ myActiveBorrowCount }}/5</b> quyển.
            <span v-if="myActiveBorrowCount < 5">Còn có thể mượn thêm <b>{{ 5 - myActiveBorrowCount }}</b> quyển.</span>
            <span v-else>Đã đạt giới hạn tối đa.</span>
          </v-alert>

          <v-text-field
            v-model="borrowForm.dueDate"
            label="Hạn trả sách"
            type="datetime-local"
            prepend-inner-icon="mdi-calendar-clock"
            hint="Mặc định 14 ngày từ hôm nay"
            persistent-hint
          />
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-spacer />

          <v-btn variant="text" @click="borrowDialog = false">
            Hủy
          </v-btn>

          <v-btn
            color="primary"
            prepend-icon="mdi-check"
            :loading="borrowing"
            :disabled="myActiveBorrowCount >= 5"
            @click="confirmBorrowBook"
          >
            Xác nhận mượn
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialog" max-width="980">
      <v-card>
        <v-card-title class="d-flex align-center">
          <v-icon
            :icon="isEditMode ? 'mdi-pencil' : 'mdi-plus-circle'"
            class="mr-2"
            color="primary"
          />
          {{ isEditMode ? 'Sửa thông tin sách' : 'Thêm sách mới' }}

          <v-spacer />

          <v-btn
            icon="mdi-close"
            variant="text"
            @click="dialog = false"
          />
        </v-card-title>

        <v-divider />

        <v-card-text>
          <v-row>
            <v-col cols="12" md="8">
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="form.isbn"
                    label="Mã sách / ISBN"
                    prepend-inner-icon="mdi-barcode"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="form.title"
                    label="Tên sách"
                    prepend-inner-icon="mdi-book-open-page-variant"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="form.author"
                    label="Tác giả"
                    prepend-inner-icon="mdi-account-edit"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="form.publisher"
                    label="Nhà xuất bản"
                    prepend-inner-icon="mdi-domain"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="form.category"
                    label="Thể loại"
                    prepend-inner-icon="mdi-shape-outline"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model.number="form.publishingYear"
                    label="Năm xuất bản"
                    type="number"
                    prepend-inner-icon="mdi-calendar"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model.number="form.totalCopies"
                    label="Tổng số bản"
                    type="number"
                    prepend-inner-icon="mdi-counter"
                  />
                </v-col>

                <v-col cols="12" md="6" v-if="isEditMode">
                  <v-text-field
                    v-model.number="form.availableCopies"
                    label="Số bản còn lại"
                    type="number"
                    prepend-inner-icon="mdi-book-check"
                  />
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    v-model="form.coverImageUrl"
                    label="Link ảnh bìa"
                    prepend-inner-icon="mdi-image"
                  />
                </v-col>
              </v-row>
            </v-col>

            <v-col cols="12" md="4">
              <v-card class="soft-card pa-4 h-100">
                <div class="text-subtitle-2 font-weight-bold mb-3">
                  Xem trước ảnh bìa
                </div>

                <div class="preview-cover">
                  <v-img
                    v-if="form.coverImageUrl"
                    :src="form.coverImageUrl"
                    height="260"
                    cover
                    rounded="xl"
                  >
                    <template #error>
                      <div class="preview-fallback">
                        <v-icon icon="mdi-image-broken" size="42" />
                        <div class="text-body-2 mt-2">
                          Không tải được ảnh
                        </div>
                      </div>
                    </template>
                  </v-img>

                  <div v-else class="preview-fallback">
                    <v-icon icon="mdi-book-open-page-variant" size="56" />
                    <div class="text-body-2 mt-2">
                      Chưa nhập link ảnh bìa
                    </div>
                  </div>
                </div>

                <div class="text-caption text-grey-darken-1 mt-3">
                  Nên dùng ảnh dọc, rõ bìa sách, định dạng JPG/PNG/WebP.
                </div>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-spacer />

          <v-btn variant="text" @click="dialog = false">
            Hủy
          </v-btn>

          <v-btn
            color="primary"
            prepend-icon="mdi-content-save"
            :loading="saving"
            @click="saveBook"
          >
            Lưu
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="detailDialog" max-width="760">
      <v-card v-if="selectedBook">
        <v-card-title class="d-flex align-center">
          <v-icon icon="mdi-book-information-variant" color="primary" class="mr-2" />
          Chi tiết sách

          <v-spacer />

          <v-btn
            icon="mdi-close"
            variant="text"
            @click="detailDialog = false"
          />
        </v-card-title>

        <v-divider />

        <v-card-text>
          <v-row>
            <v-col cols="12" md="4">
              <div class="detail-cover">
                <v-img
                  v-if="hasCover(selectedBook)"
                  :src="selectedBook.coverImageUrl"
                  height="280"
                  cover
                  rounded="xl"
                >
                  <template #error>
                    <div class="preview-fallback">
                      <v-icon icon="mdi-image-broken" size="42" />
                    </div>
                  </template>
                </v-img>

                <div v-else class="preview-fallback">
                  <v-icon icon="mdi-book-open-page-variant" size="56" />
                  <div class="text-body-2 mt-2">Không có ảnh bìa</div>
                </div>
              </div>
            </v-col>

            <v-col cols="12" md="8">
              <div class="text-h5 font-weight-black text-secondary mb-2">
                {{ selectedBook.title }}
              </div>

              <v-chip
                :color="isBookAvailable(selectedBook) ? 'success' : 'error'"
                variant="tonal"
                class="mb-5"
              >
                {{ isBookAvailable(selectedBook) ? 'Có thể mượn' : 'Hết sách' }}
              </v-chip>

              <v-row>
                <v-col cols="12" md="6">
                  <div class="info-box">
                    <div class="info-label">Mã sách / ISBN</div>
                    <div class="info-value">{{ selectedBook.isbn || shortId(selectedBook.id) }}</div>
                  </div>
                </v-col>

                <v-col cols="12" md="6">
                  <div class="info-box">
                    <div class="info-label">Tác giả</div>
                    <div class="info-value">{{ selectedBook.author }}</div>
                  </div>
                </v-col>

                <v-col cols="12" md="6">
                  <div class="info-box">
                    <div class="info-label">Nhà xuất bản</div>
                    <div class="info-value">{{ selectedBook.publisher || '-' }}</div>
                  </div>
                </v-col>

                <v-col cols="12" md="6">
                  <div class="info-box">
                    <div class="info-label">Thể loại</div>
                    <div class="info-value">{{ selectedBook.category || '-' }}</div>
                  </div>
                </v-col>

                <v-col cols="12" md="6">
                  <div class="info-box">
                    <div class="info-label">Năm xuất bản</div>
                    <div class="info-value">{{ selectedBook.publishingYear || '-' }}</div>
                  </div>
                </v-col>

                <v-col cols="12" md="6">
                  <div class="info-box">
                    <div class="info-label">Số lượng</div>
                    <div class="info-value">
                      Còn {{ selectedBook.availableCopies }} / Tổng {{ selectedBook.totalCopies }}
                    </div>
                  </div>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { bookApi } from '../../api/bookApi'
import { borrowApi } from '../../api/borrowApi'
import { useAuthStore } from '../../stores/authStore'
import { useCartStore } from '../../stores/cartStore'
import BorrowCartDrawer from '../../components/BorrowCartDrawer.vue'
import BookActionBtn from '../../components/BookActionBtn.vue'

const auth = useAuthStore()
const cart = useCartStore()
const cartDrawerRef = ref(null)

const books = ref([])
const selectedBookIds = ref([])
const brokenImageIds = ref([])

const keyword = ref('')
const category = ref('')
const publishingYear = ref('')
const statusFilter = ref(null)

const page = ref(1)
const itemsPerPage = ref(10)

const dialog = ref(false)
const detailDialog = ref(false)
const selectedBook = ref(null)

const loading = ref(false)
const saving = ref(false)
const isEditMode = ref(false)
const selectedBookId = ref(null)

const message = ref('')
const success = ref(true)

const form = ref({
  isbn: '',
  title: '',
  author: '',
  publisher: '',
  publishingYear: new Date().getFullYear(),
  category: '',
  coverImageUrl: '',
  totalCopies: 1,
  availableCopies: 1
})

const statusOptions = [
  { title: 'Có thể mượn', value: 'available' },
  { title: 'Hết sách', value: 'unavailable' }
]

const canManageBook = computed(() =>
  ['Admin', 'Librarian'].includes(auth.role)
)

const isReader = computed(() => auth.role === 'Reader')

const borrowDialog = ref(false)
const borrowingBook = ref(null)
const borrowForm = ref({ dueDate: '' })
const borrowing = ref(false)
const myActiveBorrowCount = ref(0)

function toDateTimeLocal(date) {
  const pad = (n) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function addDays(date, days) {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

async function loadMyActiveBorrowCount() {
  if (!isReader.value) return
  try {
    const res = await borrowApi.getMyBorrows()
    myActiveBorrowCount.value = res.data.filter(b => b.status === 'Borrowed').length
  } catch {
    myActiveBorrowCount.value = 0
  }
}

function openBorrowDialog(book) {
  borrowingBook.value = book
  borrowForm.value.dueDate = toDateTimeLocal(addDays(new Date(), 14))
  borrowDialog.value = true
}

async function confirmBorrowBook() {
  if (!borrowingBook.value) return

  if (myActiveBorrowCount.value >= 5) {
    success.value = false
    message.value = 'Bạn đang mượn tối đa 5 quyển. Vui lòng trả bớt sách trước khi mượn thêm.'
    borrowDialog.value = false
    return
  }

  // Thử nhiều field name có thể có từ backend
  const readerId = auth.user?.id
    || auth.user?.userId
    || auth.user?.readerId
    || auth.user?.sub

  if (!readerId) {
    success.value = false
    message.value = 'Không xác định được ID người dùng. Vui lòng đăng xuất và đăng nhập lại.'
    console.error('[Borrow] auth.user object:', JSON.stringify(auth.user))
    borrowDialog.value = false
    return
  }

  borrowing.value = true
  message.value = ''

  const payload = {
    readerId,
    bookId: borrowingBook.value.id,
    borrowDate: new Date().toISOString(),
    dueDate: new Date(borrowForm.value.dueDate).toISOString()
  }
  console.log('[Borrow] payload:', payload)

  try {
    await borrowApi.create(payload)

    success.value = true
    message.value = `Đăng ký mượn sách "${borrowingBook.value.title}" thành công! Đến quầy thủ thư để nhận sách.`
    myActiveBorrowCount.value += 1

    borrowDialog.value = false
    await loadBooks()
  } catch (err) {
    success.value = false
    const status = err.response?.status
    const errData = err.response?.data
    const errMsg = errData?.message || errData?.detail || errData?.title || errData?.error
    message.value = errMsg || `Đăng ký mượn sách thất bại${status ? ` (HTTP ${status})` : ''}`
    console.error('[Borrow] error:', { status, data: errData, payload })
  } finally {
    borrowing.value = false
  }
}

async function onCartCheckoutSuccess() {
  success.value = true
  message.value = 'Đã gửi yêu cầu mượn thành công! Đến quầy thủ thư để nhận sách.'
  await loadMyActiveBorrowCount()
  await loadBooks()
}

const availableBookCount = computed(() =>
  books.value.filter(book => isBookAvailable(book)).length
)

const unavailableBookCount = computed(() =>
  books.value.filter(book => !isBookAvailable(book)).length
)

const filteredBooks = computed(() => {
  let data = [...books.value]

  if (keyword.value) {
    const search = keyword.value.toLowerCase().trim()

    data = data.filter(book =>
      String(book.isbn || '').toLowerCase().includes(search) ||
      String(book.title || '').toLowerCase().includes(search) ||
      String(book.author || '').toLowerCase().includes(search) ||
      String(book.id || '').toLowerCase().includes(search)
    )
  }

  if (category.value) {
    const searchCategory = category.value.toLowerCase().trim()

    data = data.filter(book =>
      String(book.category || '').toLowerCase().includes(searchCategory)
    )
  }

  if (publishingYear.value) {
    data = data.filter(book =>
      String(book.publishingYear || '').includes(String(publishingYear.value))
    )
  }

  if (statusFilter.value === 'available') {
    data = data.filter(book => isBookAvailable(book))
  }

  if (statusFilter.value === 'unavailable') {
    data = data.filter(book => !isBookAvailable(book))
  }

  return data
})

const pageCount = computed(() => {
  const total = Math.ceil(filteredBooks.value.length / itemsPerPage.value)
  return total || 1
})

const paginatedBooks = computed(() => {
  const start = (page.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value

  return filteredBooks.value.slice(start, end)
})

const allCurrentPageSelected = computed({
  get() {
    if (paginatedBooks.value.length === 0) return false

    return paginatedBooks.value.every(book =>
      selectedBookIds.value.includes(book.id)
    )
  },
  set(value) {
    const ids = paginatedBooks.value.map(book => book.id)

    if (value) {
      selectedBookIds.value = Array.from(
        new Set([...selectedBookIds.value, ...ids])
      )
    } else {
      selectedBookIds.value = selectedBookIds.value.filter(id =>
        !ids.includes(id)
      )
    }
  }
})

const isCurrentPageIndeterminate = computed(() => {
  const ids = paginatedBooks.value.map(book => book.id)
  const selectedCount = ids.filter(id => selectedBookIds.value.includes(id)).length

  return selectedCount > 0 && selectedCount < ids.length
})

watch([keyword, category, publishingYear, statusFilter, itemsPerPage], () => {
  page.value = 1
})

async function loadBooks() {
  loading.value = true
  message.value = ''

  const params = {}

  if (keyword.value) params.keyword = keyword.value
  if (category.value) params.category = category.value
  if (publishingYear.value) params.publishingYear = publishingYear.value

  try {
    const res = await bookApi.getAll(params)
    books.value = res.data
    selectedBookIds.value = []

    success.value = true
  } catch (err) {
    success.value = false
    message.value = err.response?.data?.message || 'Không tải được danh sách sách'
    console.error(err.response || err)
  } finally {
    loading.value = false
  }
}

function resetFilters() {
  keyword.value = ''
  category.value = ''
  publishingYear.value = ''
  statusFilter.value = null
  page.value = 1

  loadBooks()
}

function resetForm() {
  form.value = {
    isbn: '',
    title: '',
    author: '',
    publisher: '',
    publishingYear: new Date().getFullYear(),
    category: '',
    coverImageUrl: '',
    totalCopies: 1,
    availableCopies: 1
  }
}

function openCreateDialog() {
  isEditMode.value = false
  selectedBookId.value = null
  resetForm()
  dialog.value = true
}

function openEditDialog(book) {
  isEditMode.value = true
  selectedBookId.value = book.id

  form.value = {
    isbn: book.isbn,
    title: book.title,
    author: book.author,
    publisher: book.publisher,
    publishingYear: book.publishingYear,
    category: book.category,
    coverImageUrl: book.coverImageUrl,
    totalCopies: book.totalCopies,
    availableCopies: book.availableCopies
  }

  dialog.value = true
}

function openDetailDialog(book) {
  selectedBook.value = book
  detailDialog.value = true
}

function validateForm() {
  if (!form.value.isbn) return 'Mã sách / ISBN không được để trống'
  if (!form.value.title) return 'Tên sách không được để trống'
  if (!form.value.author) return 'Tác giả không được để trống'
  if (!form.value.publishingYear || form.value.publishingYear <= 0) return 'Năm xuất bản không hợp lệ'
  if (!form.value.totalCopies || form.value.totalCopies <= 0) return 'Tổng số bản phải lớn hơn 0'

  if (isEditMode.value) {
    if (form.value.availableCopies < 0) return 'Số bản còn lại không được âm'
    if (form.value.availableCopies > form.value.totalCopies) {
      return 'Số bản còn lại không được lớn hơn tổng số bản'
    }
  }

  return ''
}

async function saveBook() {
  const error = validateForm()

  if (error) {
    success.value = false
    message.value = error
    return
  }

  saving.value = true
  message.value = ''

  try {
    if (isEditMode.value) {
      await bookApi.update(selectedBookId.value, {
        isbn: form.value.isbn,
        title: form.value.title,
        author: form.value.author,
        publisher: form.value.publisher,
        publishingYear: form.value.publishingYear,
        category: form.value.category,
        coverImageUrl: form.value.coverImageUrl,
        totalCopies: form.value.totalCopies,
        availableCopies: form.value.availableCopies
      })

      success.value = true
      message.value = 'Cập nhật sách thành công'
    } else {
      await bookApi.create({
        isbn: form.value.isbn,
        title: form.value.title,
        author: form.value.author,
        publisher: form.value.publisher,
        publishingYear: form.value.publishingYear,
        category: form.value.category,
        coverImageUrl: form.value.coverImageUrl,
        totalCopies: form.value.totalCopies
      })

      success.value = true
      message.value = 'Thêm sách thành công'
    }

    dialog.value = false
    await loadBooks()
  } catch (err) {
    success.value = false
    message.value = err.response?.data?.message || 'Lưu sách thất bại'
    console.error(err.response || err)
  } finally {
    saving.value = false
  }
}

async function deleteBook(book) {
  const confirmed = confirm(`Bạn có chắc muốn xóa sách "${book.title}" không?`)

  if (!confirmed) return

  try {
    await bookApi.remove(book.id)

    success.value = true
    message.value = 'Xóa sách thành công'

    await loadBooks()
  } catch (err) {
    success.value = false
    message.value = err.response?.data?.message || 'Xóa sách thất bại'
    console.error(err.response || err)
  }
}

async function deleteSelectedBooks() {
  if (selectedBookIds.value.length === 0) return

  const confirmed = confirm(`Bạn có chắc muốn xóa ${selectedBookIds.value.length} sách đã chọn không?`)

  if (!confirmed) return

  loading.value = true
  message.value = ''

  try {
    for (const id of selectedBookIds.value) {
      await bookApi.remove(id)
    }

    success.value = true
    message.value = `Đã xóa ${selectedBookIds.value.length} sách`

    selectedBookIds.value = []
    await loadBooks()
  } catch (err) {
    success.value = false
    message.value = err.response?.data?.message || 'Xóa nhiều sách thất bại'
    console.error(err.response || err)
  } finally {
    loading.value = false
  }
}

function isBookAvailable(book) {
  if (typeof book.isAvailable === 'boolean') return book.isAvailable
  return Number(book.availableCopies || 0) > 0
}

function hasCover(book) {
  if (!book?.coverImageUrl) return false
  return !brokenImageIds.value.includes(book.id)
}

function markImageError(id) {
  if (!brokenImageIds.value.includes(id)) {
    brokenImageIds.value.push(id)
  }
}

function shortId(value) {
  if (!value) return '-'
  return String(value).slice(0, 8)
}

onMounted(async () => {
  await loadBooks()
  await loadMyActiveBorrowCount()
})
</script>

<style scoped>
.book-cover {
  width: 58px;
  height: 78px;
  border-radius: 14px;
  overflow: hidden;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
}

.cover-fallback,
.cover-placeholder,
.preview-fallback {
  width: 100%;
  height: 100%;
  min-height: 78px;
  display: grid;
  place-items: center;
  color: #64748b;
  background: #f8fafc;
  text-align: center;
}

.preview-cover {
  min-height: 260px;
  border-radius: 22px;
  overflow: hidden;
  background: #f8fafc;
  border: 1px solid #eef2f7;
}

.detail-cover {
  min-height: 280px;
  border-radius: 22px;
  overflow: hidden;
  background: #f8fafc;
  border: 1px solid #eef2f7;
}

.info-box {
  min-height: 88px;
  padding: 16px;
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
  font-weight: 700;
  word-break: break-word;
}
</style>