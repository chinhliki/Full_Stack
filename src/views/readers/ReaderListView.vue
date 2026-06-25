<template>
  <div>
    <div class="action-bar">
      <div>
        <div class="page-title">Quản lý độc giả</div>
        <div class="page-subtitle">
          Quản lý hồ sơ độc giả, tài khoản, thẻ thư viện và trạng thái sử dụng
        </div>
      </div>

      <v-spacer />

      <v-btn
        color="primary"
        variant="tonal"
        prepend-icon="mdi-refresh"
        :loading="loading"
        @click="loadReaders"
      >
        Tải lại
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

    <v-row class="mb-5">
      <v-col cols="12" sm="6" md="3">
        <v-card class="stat-card pa-5 d-flex align-center" rounded="xl">
          <div class="stat-info">
            <div class="stat-label text-uppercase mb-1">Tổng độc giả</div>
            <div class="stat-value text-primary font-weight-black">{{ readers.length }}</div>
          </div>
          <v-spacer />
          <div class="stat-icon-wrapper-glow info-glowing-icon">
            <v-icon icon="mdi-account-group" size="30" />
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="stat-card pa-5 d-flex align-center" rounded="xl">
          <div class="stat-info">
            <div class="stat-label text-uppercase mb-1">Tài khoản hoạt động</div>
            <div class="stat-value text-success font-weight-black">{{ activeUserCount }}</div>
          </div>
          <v-spacer />
          <div class="stat-icon-wrapper-glow success-glowing-icon">
            <v-icon icon="mdi-account-check" size="30" />
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="stat-card pa-5 d-flex align-center" rounded="xl">
          <div class="stat-info">
            <div class="stat-label text-uppercase mb-1">Tài khoản bị khóa</div>
            <div class="stat-value text-error font-weight-black">{{ lockedUserCount }}</div>
          </div>
          <v-spacer />
          <div class="stat-icon-wrapper-glow error-glowing-icon">
            <v-icon icon="mdi-account-lock" size="30" />
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="stat-card pa-5 d-flex align-center" rounded="xl">
          <div class="stat-info">
            <div class="stat-label text-uppercase mb-1">Thẻ hết hạn</div>
            <div class="stat-value text-amber-darken-3 font-weight-black">{{ expiredCardCount }}</div>
          </div>
          <v-spacer />
          <div class="stat-icon-wrapper-glow amber-glowing-icon">
            <v-icon icon="mdi-card-account-details-star" size="30" />
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-card class="soft-card pa-5 mb-5">
      <v-row align="center">
        <v-col cols="12" md="4">
          <v-text-field
            v-model="keyword"
            label="Tìm mã độc giả / tên / email / số thẻ"
            prepend-inner-icon="mdi-magnify"
            clearable
            hide-details
          />
        </v-col>

        <v-col cols="12" md="2">
          <v-select
            v-model="userStatusFilter"
            label="Trạng thái TK"
            :items="userStatusOptions"
            prepend-inner-icon="mdi-account-filter"
            clearable
            hide-details
          />
        </v-col>

        <v-col cols="12" md="2">
          <v-select
            v-model="cardStatusFilter"
            label="Trạng thái thẻ"
            :items="cardStatusOptions"
            prepend-inner-icon="mdi-card-account-details"
            clearable
            hide-details
          />
        </v-col>

        <v-col cols="12" md="2">
          <v-text-field
            v-model="expiredFromDate"
            label="Hạn thẻ từ"
            type="date"
            prepend-inner-icon="mdi-calendar-start"
            clearable
            hide-details
          />
        </v-col>

        <v-col cols="12" md="2">
          <div class="d-flex ga-2">
            <v-text-field
              v-model="expiredToDate"
              label="Hạn thẻ đến"
              type="date"
              prepend-inner-icon="mdi-calendar-end"
              clearable
              hide-details
            />

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
      <div class="table-scroll">
        <v-table>
          <thead>
            <tr>
              <th>Mã độc giả</th>
              <th>Độc giả</th>
              <th>Email</th>
              <th>SĐT</th>
              <th>Vai trò</th>
              <th>Trạng thái TK</th>
              <th>Số thẻ</th>
              <th>Hạn thẻ</th>
              <th>Trạng thái thẻ</th>
              <th class="text-center">Hành động</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="reader in paginatedReaders" :key="reader.userId">
              <td>
                <div class="font-weight-bold text-primary">
                  {{ getReaderCode(reader) }}
                </div>
                <div class="text-caption text-grey-darken-1">
                  ID: {{ shortId(reader.userId) }}
                </div>
              </td>

              <td>
                <div class="d-flex align-center">
                  <v-avatar color="primary" variant="tonal" size="40" class="mr-3">
                    <v-icon icon="mdi-account" />
                  </v-avatar>

                  <div>
                    <div class="font-weight-bold">
                      {{ reader.fullName }}
                    </div>
                    <div class="text-caption text-grey-darken-1">
                      {{ reader.studentCode || 'Chưa có mã SV' }}
                    </div>
                  </div>
                </div>
              </td>

              <td>{{ reader.email }}</td>
              <td>{{ reader.phone || '-' }}</td>

              <td>
                <v-chip
                  :color="getRoleColor(reader.role)"
                  size="small"
                  variant="tonal"
                >
                  <v-icon start :icon="getRoleIcon(reader.role)" />
                  {{ getRoleText(reader.role) }}
                </v-chip>
              </td>

              <td>
                <v-chip
                  :color="getUserStatusColor(reader.userStatus)"
                  size="small"
                  variant="tonal"
                >
                  <v-icon
                    start
                    :icon="reader.userStatus === 'Active' ? 'mdi-account-check' : 'mdi-account-lock'"
                  />
                  {{ getUserStatusText(reader.userStatus) }}
                </v-chip>
              </td>

              <td>
                <div class="font-weight-bold">
                  {{ reader.cardNumber || '-' }}
                </div>
              </td>

              <td>
                <div>
                  {{ formatDate(reader.expiredDate) }}
                </div>

                <div
                  class="text-caption"
                  :class="isCardExpired(reader) ? 'text-error' : 'text-grey-darken-1'"
                >
                  {{ getCardExpiredText(reader) }}
                </div>
              </td>

              <td>
                <v-chip
                  :color="getCardStatusColor(reader.cardStatus)"
                  size="small"
                  variant="tonal"
                >
                  <v-icon
                    start
                    :icon="reader.cardStatus === 'Active' ? 'mdi-card-account-details-star' : 'mdi-card-account-details-outline'"
                  />
                  {{ getCardStatusText(reader.cardStatus) }}
                </v-chip>
              </td>

              <td>
                <div class="d-flex justify-center ga-2">
                  <v-tooltip text="Xem thẻ">
                    <template #activator="{ props }">
                      <v-btn
                        v-bind="props"
                        icon="mdi-card-account-details"
                        size="small"
                        color="info"
                        variant="tonal"
                        @click="viewCard(reader)"
                      />
                    </template>
                  </v-tooltip>

                  <v-tooltip text="Gia hạn thẻ">
                    <template #activator="{ props }">
                      <v-btn
                        v-if="canManageCard"
                        v-bind="props"
                        icon="mdi-calendar-plus"
                        size="small"
                        color="primary"
                        variant="tonal"
                        :loading="loadingId === reader.userId + '-renew'"
                        @click="renewCard(reader)"
                      />
                    </template>
                  </v-tooltip>

                  <v-tooltip text="Khóa thẻ">
                    <template #activator="{ props }">
                      <v-btn
                        v-if="canManageCard && reader.cardStatus === 'Active'"
                        v-bind="props"
                        icon="mdi-card-off"
                        size="small"
                        color="warning"
                        variant="tonal"
                        :loading="loadingId === reader.userId + '-lock-card'"
                        @click="lockCard(reader)"
                      />
                    </template>
                  </v-tooltip>

                  <v-tooltip text="Mở khóa thẻ">
                    <template #activator="{ props }">
                      <v-btn
                        v-if="canManageCard && reader.cardStatus === 'Locked'"
                        v-bind="props"
                        icon="mdi-card-account-details-star"
                        size="small"
                        color="success"
                        variant="tonal"
                        :loading="loadingId === reader.userId + '-unlock-card'"
                        @click="unlockCard(reader)"
                      />
                    </template>
                  </v-tooltip>

                  <v-tooltip text="Khóa tài khoản">
                    <template #activator="{ props }">
                      <v-btn
                        v-if="canManageUser && reader.userStatus === 'Active'"
                        v-bind="props"
                        icon="mdi-lock"
                        size="small"
                        color="error"
                        variant="tonal"
                        :loading="loadingId === reader.userId + '-lock-user'"
                        @click="lockUser(reader)"
                      />
                    </template>
                  </v-tooltip>

                  <v-tooltip text="Mở tài khoản">
                    <template #activator="{ props }">
                      <v-btn
                        v-if="canManageUser && reader.userStatus === 'Locked'"
                        v-bind="props"
                        icon="mdi-lock-open"
                        size="small"
                        color="success"
                        variant="tonal"
                        :loading="loadingId === reader.userId + '-unlock-user'"
                        @click="unlockUser(reader)"
                      />
                    </template>
                  </v-tooltip>

                  <!-- Phân quyền vai trò (Admin only) -->
                  <v-tooltip text="Phân quyền vai trò">
                    <template #activator="{ props }">
                      <v-btn
                        v-if="canManageUser"
                        v-bind="props"
                        icon="mdi-shield-account"
                        size="small"
                        color="purple"
                        variant="tonal"
                        :loading="loadingId === reader.userId + '-role'"
                        @click="openRoleDialog(reader)"
                      />
                    </template>
                  </v-tooltip>
                </div>
              </td>
            </tr>

            <tr v-if="paginatedReaders.length === 0">
              <td colspan="10" class="text-center pa-8">
                <v-icon icon="mdi-database-search-outline" size="46" color="grey" />
                <div class="text-subtitle-1 font-weight-bold mt-2">
                  Không tìm thấy độc giả phù hợp
                </div>
                <div class="text-body-2 text-grey-darken-1">
                  Thử thay đổi từ khóa, trạng thái tài khoản, trạng thái thẻ hoặc khoảng hạn thẻ.
                </div>
              </td>
            </tr>
          </tbody>
        </v-table>
      </div>

      <v-divider />

      <div class="d-flex align-center justify-space-between flex-wrap pa-4 ga-3">
        <div class="text-body-2 text-grey-darken-1">
          Hiển thị
          <b>{{ paginatedReaders.length }}</b>
          /
          <b>{{ filteredReaders.length }}</b>
          độc giả
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

    <!-- Dialog phân quyền vai trò -->
    <v-dialog v-model="roleDialog" max-width="460">
      <v-card v-if="selectedForRole">
        <v-card-title class="d-flex align-center">
          <v-icon icon="mdi-shield-account" color="purple" class="mr-2" />
          Phân quyền vai trò

          <v-spacer />

          <v-btn icon="mdi-close" variant="text" @click="roleDialog = false" />
        </v-card-title>

        <v-divider />

        <v-card-text>
          <div class="info-box-premium mb-4">
            <div class="info-label-premium">Tài khoản</div>
            <div class="info-value-premium">{{ selectedForRole.fullName }}</div>
          </div>

          <div class="info-box-premium mb-4">
            <div class="info-label-premium">Vai trò hiện tại</div>
            <div class="info-value-premium mt-1">
              <v-chip :color="getRoleColor(selectedForRole.role)" variant="tonal" size="small">
                <v-icon start :icon="getRoleIcon(selectedForRole.role)" />
                {{ getRoleText(selectedForRole.role) }}
              </v-chip>
            </div>
          </div>

          <v-select
            v-model="newRole"
            label="Chọn vai trò mới"
            :items="roleOptions"
            prepend-inner-icon="mdi-shield-account"
          />

          <v-alert type="warning" variant="tonal" rounded="lg" class="mt-2">
            Thay đổi vai trò sẽ ảnh hưởng đến quyền truy cập của người dùng trong hệ thống.
          </v-alert>
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-spacer />

          <v-btn variant="text" @click="roleDialog = false">
            Hủy
          </v-btn>

          <v-btn
            color="purple"
            prepend-icon="mdi-check"
            :loading="loadingId === selectedForRole.userId + '-role'"
            :disabled="!newRole || newRole === selectedForRole.role"
            @click="confirmSetRole"
          >
            Xác nhận phân quyền
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="cardDialog" max-width="780" transition="dialog-scale-transition">
      <v-card v-if="selectedCard">
        <v-card-title class="d-flex align-center">
          <v-icon icon="mdi-card-account-details" color="primary" class="mr-2" />
          Thông tin thẻ thư viện

          <v-spacer />

          <v-btn icon="mdi-close" variant="text" @click="cardDialog = false" />
        </v-card-title>

        <v-divider />

        <v-card-text>
          <v-row>
            <v-col cols="12" md="5">
              <v-card class="library-card-premium pa-6">
                <div class="d-flex align-center justify-space-between mb-7">
                  <div>
                    <div class="text-caption text-white opacity-80 card-title-glow">
                      LIBRARY CARD
                    </div>
                    <div class="text-h6 font-weight-black text-white">
                      Digital Library
                    </div>
                  </div>

                  <v-avatar color="white" size="46" class="card-icon-glow">
                    <v-icon icon="mdi-library" color="primary" />
                  </v-avatar>
                </div>

                <div class="text-caption text-white opacity-80 card-title-glow">
                  SỐ THẺ
                </div>

                <div class="card-number-glow">
                  {{ selectedCard.cardNumber }}
                </div>

                <div class="mt-7">
                  <div class="text-caption text-white opacity-80 card-title-glow">
                    CHỦ THẺ
                  </div>
                  <div class="text-white font-weight-bold">
                    {{ selectedCard.fullName }}
                  </div>
                </div>

                <div class="mt-5">
                  <div class="text-caption text-white opacity-80 card-title-glow">
                    TRẠNG THÁI
                  </div>

                  <v-chip
                    class="mt-1"
                    :color="selectedCard.status === 'Active' ? 'success' : 'error'"
                    size="small"
                    variant="flat"
                  >
                    {{ getCardStatusText(selectedCard.status) }}
                  </v-chip>
                </div>
              </v-card>
            </v-col>

            <v-col cols="12" md="7">
              <v-row>
                <v-col cols="12" md="6">
                  <div class="info-box-premium">
                    <div class="info-label-premium">Độc giả</div>
                    <div class="info-value-premium">{{ selectedCard.fullName }}</div>
                  </div>
                </v-col>

                <v-col cols="12" md="6">
                  <div class="info-box-premium">
                    <div class="info-label-premium">Email</div>
                    <div class="info-value-premium">{{ selectedCard.email }}</div>
                  </div>
                </v-col>

                <v-col cols="12" md="6">
                  <div class="info-box-premium">
                    <div class="info-label-premium">Số thẻ</div>
                    <div class="info-value-premium">{{ selectedCard.cardNumber }}</div>
                  </div>
                </v-col>

                <v-col cols="12" md="6">
                  <div class="info-box-premium">
                    <div class="info-label-premium">Trạng thái</div>
                    <div class="info-value-premium mt-1">
                      <v-chip
                        :color="selectedCard.status === 'Active' ? 'success' : 'error'"
                        size="small"
                        variant="tonal"
                      >
                        {{ getCardStatusText(selectedCard.status) }}
                      </v-chip>
                    </div>
                  </div>
                </v-col>

                <v-col cols="12" md="6">
                  <div class="info-box-premium">
                    <div class="info-label-premium">Ngày cấp</div>
                    <div class="info-value-premium">{{ formatDate(selectedCard.issuedDate) }}</div>
                  </div>
                </v-col>

                <v-col cols="12" md="6">
                  <div class="info-box-premium">
                    <div class="info-label-premium">Ngày hết hạn</div>
                    <div class="info-value-premium">{{ formatDate(selectedCard.expiredDate) }}</div>
                  </div>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-spacer />

          <v-btn variant="text" @click="cardDialog = false">
            Đóng
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { readerApi } from '../../api/readerApi'
import { userApi } from '../../api/userApi'
import { libraryCardApi } from '../../api/libraryCardApi'
import { useAuthStore } from '../../stores/authStore'

const auth = useAuthStore()

const readers = ref([])
const keyword = ref('')
const userStatusFilter = ref(null)
const cardStatusFilter = ref(null)
const expiredFromDate = ref('')
const expiredToDate = ref('')

const page = ref(1)
const itemsPerPage = ref(10)

const loading = ref(false)
const loadingId = ref('')
const message = ref('')
const success = ref(true)

const cardDialog = ref(false)
const selectedCard = ref(null)

const roleDialog = ref(false)
const selectedForRole = ref(null)
const newRole = ref('')

const roleOptions = [
  { title: 'Độc giả (Reader)', value: 'Reader' },
  { title: 'Thủ thư (Librarian)', value: 'Librarian' },
  { title: 'Quản trị viên (Admin)', value: 'Admin' }
]

const userStatusOptions = [
  { title: 'Hoạt động', value: 'Active' },
  { title: 'Bị khóa', value: 'Locked' }
]

const cardStatusOptions = [
  { title: 'Hoạt động', value: 'Active' },
  { title: 'Bị khóa', value: 'Locked' },
  { title: 'Hết hạn', value: 'Expired' }
]

const canManageUser = computed(() => auth.role === 'Admin')

const canManageCard = computed(() =>
  ['Admin', 'Librarian'].includes(auth.role)
)

const activeUserCount = computed(() =>
  readers.value.filter(x => x.userStatus === 'Active').length
)

const lockedUserCount = computed(() =>
  readers.value.filter(x => x.userStatus === 'Locked').length
)

const expiredCardCount = computed(() =>
  readers.value.filter(x => isCardExpired(x)).length
)

const filteredReaders = computed(() => {
  let data = [...readers.value]

  if (keyword.value) {
    const search = keyword.value.toLowerCase().trim()

    data = data.filter(reader =>
      String(getReaderCode(reader)).toLowerCase().includes(search) ||
      String(reader.fullName || '').toLowerCase().includes(search) ||
      String(reader.email || '').toLowerCase().includes(search) ||
      String(reader.phone || '').toLowerCase().includes(search) ||
      String(reader.cardNumber || '').toLowerCase().includes(search) ||
      String(reader.userId || '').toLowerCase().includes(search)
    )
  }

  if (userStatusFilter.value) {
    data = data.filter(reader => reader.userStatus === userStatusFilter.value)
  }

  if (cardStatusFilter.value) {
    data = data.filter(reader => reader.cardStatus === cardStatusFilter.value)
  }

  if (expiredFromDate.value) {
    const from = new Date(expiredFromDate.value)
    data = data.filter(reader =>
      reader.expiredDate && new Date(reader.expiredDate) >= from
    )
  }

  if (expiredToDate.value) {
    const to = new Date(expiredToDate.value)
    to.setHours(23, 59, 59, 999)

    data = data.filter(reader =>
      reader.expiredDate && new Date(reader.expiredDate) <= to
    )
  }

  return data
})

const pageCount = computed(() => {
  const total = Math.ceil(filteredReaders.value.length / itemsPerPage.value)
  return total || 1
})

const paginatedReaders = computed(() => {
  const start = (page.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value

  return filteredReaders.value.slice(start, end)
})

watch([keyword, userStatusFilter, cardStatusFilter, expiredFromDate, expiredToDate, itemsPerPage], () => {
  page.value = 1
})

async function loadReaders() {
  loading.value = true
  message.value = ''

  try {
    const res = await readerApi.getAll()
    readers.value = res.data
    success.value = true
  } catch (err) {
    success.value = false
    message.value = err.response?.data?.message || 'Không tải được danh sách độc giả'
    console.error(err.response || err)
  } finally {
    loading.value = false
  }
}

function resetFilters() {
  keyword.value = ''
  userStatusFilter.value = null
  cardStatusFilter.value = null
  expiredFromDate.value = ''
  expiredToDate.value = ''
  page.value = 1
}

async function viewCard(reader) {
  message.value = ''

  try {
    const res = await libraryCardApi.getCard(reader.userId)

    selectedCard.value = res.data
    cardDialog.value = true
  } catch (err) {
    success.value = false
    message.value = err.response?.data?.message || 'Không xem được thẻ thư viện'
    console.error(err.response || err)
  }
}

async function renewCard(reader) {
  const confirmed = confirm(`Gia hạn thẻ thư viện cho "${reader.fullName}" thêm 1 năm?`)

  if (!confirmed) return

  loadingId.value = reader.userId + '-renew'
  message.value = ''

  try {
    const res = await libraryCardApi.renewCard(reader.userId)

    success.value = true
    message.value = res.data.message || 'Gia hạn thẻ thành công'

    await loadReaders()
  } catch (err) {
    success.value = false
    message.value = err.response?.data?.message || 'Gia hạn thẻ thất bại'
    console.error(err.response || err)
  } finally {
    loadingId.value = ''
  }
}

async function lockCard(reader) {
  const confirmed = confirm(`Khóa thẻ thư viện của "${reader.fullName}"?`)

  if (!confirmed) return

  loadingId.value = reader.userId + '-lock-card'
  message.value = ''

  try {
    const res = await libraryCardApi.lockCard(reader.userId)

    success.value = true
    message.value = res.data.message || 'Khóa thẻ thành công'

    await loadReaders()
  } catch (err) {
    success.value = false
    message.value = err.response?.data?.message || 'Khóa thẻ thất bại'
    console.error(err.response || err)
  } finally {
    loadingId.value = ''
  }
}

async function unlockCard(reader) {
  const confirmed = confirm(`Mở khóa thẻ thư viện của "${reader.fullName}"?`)

  if (!confirmed) return

  loadingId.value = reader.userId + '-unlock-card'
  message.value = ''

  try {
    const res = await libraryCardApi.unlockCard(reader.userId)

    success.value = true
    message.value = res.data.message || 'Mở khóa thẻ thành công'

    await loadReaders()
  } catch (err) {
    success.value = false
    message.value = err.response?.data?.message || 'Mở khóa thẻ thất bại'
    console.error(err.response || err)
  } finally {
    loadingId.value = ''
  }
}

async function lockUser(reader) {
  const confirmed = confirm(`Khóa tài khoản "${reader.fullName}"? Độc giả sẽ không thể mượn sách.`)

  if (!confirmed) return

  loadingId.value = reader.userId + '-lock-user'
  message.value = ''

  try {
    const res = await userApi.lockUser(reader.userId)

    success.value = true
    message.value = res.data.message || 'Khóa tài khoản thành công'

    await loadReaders()
  } catch (err) {
    success.value = false
    message.value = err.response?.data?.message || 'Khóa tài khoản thất bại'
    console.error(err.response || err)
  } finally {
    loadingId.value = ''
  }
}

async function unlockUser(reader) {
  const confirmed = confirm(`Mở khóa tài khoản "${reader.fullName}"?`)

  if (!confirmed) return

  loadingId.value = reader.userId + '-unlock-user'
  message.value = ''

  try {
    const res = await userApi.unlockUser(reader.userId)

    success.value = true
    message.value = res.data.message || 'Mở khóa tài khoản thành công'

    await loadReaders()
  } catch (err) {
    success.value = false
    message.value = err.response?.data?.message || 'Mở khóa tài khoản thất bại'
    console.error(err.response || err)
  } finally {
    loadingId.value = ''
  }
}

function openRoleDialog(reader) {
  selectedForRole.value = reader
  newRole.value = reader.role || 'Reader'
  roleDialog.value = true
}

async function confirmSetRole() {
  if (!selectedForRole.value || !newRole.value) return

  loadingId.value = selectedForRole.value.userId + '-role'
  message.value = ''

  try {
    const res = await userApi.setRole(selectedForRole.value.userId, newRole.value)

    success.value = true
    message.value = res.data?.message || `Đã phân quyền "${getRoleText(newRole.value)}" cho ${selectedForRole.value.fullName}`

    roleDialog.value = false
    await loadReaders()
  } catch (err) {
    success.value = false
    message.value = err.response?.data?.message || 'Phân quyền thất bại'
    console.error(err.response || err)
  } finally {
    loadingId.value = ''
  }
}

function getRoleText(role) {
  if (role === 'Admin') return 'Quản trị viên'
  if (role === 'Librarian') return 'Thủ thư'
  if (role === 'Reader') return 'Độc giả'
  return role || 'Độc giả'
}

function getRoleColor(role) {
  if (role === 'Admin') return 'error'
  if (role === 'Librarian') return 'primary'
  return 'success'
}

function getRoleIcon(role) {
  if (role === 'Admin') return 'mdi-shield-crown'
  if (role === 'Librarian') return 'mdi-book-account'
  return 'mdi-account'
}

function getReaderCode(reader) {
  return reader.studentCode || reader.cardNumber || shortId(reader.userId)
}

function getUserStatusText(status) {
  if (status === 'Active') return 'Hoạt động'
  if (status === 'Locked') return 'Bị khóa'
  return status || '-'
}

function getUserStatusColor(status) {
  if (status === 'Active') return 'success'
  if (status === 'Locked') return 'error'
  return 'secondary'
}

function getCardStatusText(status) {
  if (status === 'Active') return 'Hoạt động'
  if (status === 'Locked') return 'Bị khóa'
  if (status === 'Expired') return 'Hết hạn'
  return status || '-'
}

function getCardStatusColor(status) {
  if (status === 'Active') return 'success'
  if (status === 'Locked') return 'error'
  if (status === 'Expired') return 'warning'
  return 'secondary'
}

function isCardExpired(reader) {
  if (!reader.expiredDate) return false

  return new Date(reader.expiredDate).getTime() < new Date().getTime()
}

function getCardExpiredText(reader) {
  if (!reader.expiredDate) return 'Chưa có hạn thẻ'

  const expired = new Date(reader.expiredDate).getTime()
  const now = new Date().getTime()
  const diff = expired - now
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24))

  if (days < 0) return `Đã hết hạn ${Math.abs(days)} ngày`
  if (days === 0) return 'Hết hạn hôm nay'

  return `Còn ${days} ngày`
}

function formatDate(value) {
  if (!value) return '-'

  return new Date(value).toLocaleString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

function shortId(value) {
  if (!value) return '-'
  return String(value).slice(0, 8)
}

onMounted(loadReaders)
</script>

<style scoped>
.table-scroll {
  overflow-x: auto;
}

.table-scroll table {
  min-width: 1320px;
}

.address-cell {
  max-width: 180px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

</style>