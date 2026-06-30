<template>
  <div>
    <!-- Page header -->
    <div class="d-flex align-center justify-between mb-6 flex-wrap ga-3">
      <div>
        <h2 class="page-title font-weight-black text-secondary">Quản lý tài khoản</h2>
        <p class="page-subtitle">Quản lý tài khoản thủ thư và độc giả, phân quyền vai trò và bảo mật đăng nhập</p>
      </div>
      <v-spacer />
      <div class="d-flex align-center ga-2 flex-wrap">
        <v-btn
          color="primary"
          variant="tonal"
          prepend-icon="mdi-refresh"
          rounded="xl"
          class="font-weight-bold"
          :loading="loading"
          @click="loadAccounts"
        >
          Tải lại
        </v-btn>
        <v-btn
          color="success"
          variant="tonal"
          prepend-icon="mdi-file-excel-outline"
          rounded="xl"
          class="font-weight-bold"
          @click="importDialog = true"
        >
          Nhập Excel
        </v-btn>
        <v-btn
          color="primary"
          prepend-icon="mdi-account-plus-outline"
          rounded="xl"
          class="font-weight-bold shadow-sm"
          @click="openCreateDialog"
        >
          Tạo tài khoản mới
        </v-btn>
      </div>
    </div>

    <!-- Import excel component -->
    <ImportExcelDialog
      v-model="importDialog"
      entity-label="tài khoản"
      :template-columns="accountImportColumns"
      :create-fn="importAccountRow"
      @imported="loadAccounts"
    />

    <!-- Notifications -->
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

    <!-- Stats row -->
    <v-row class="mb-6">
      <v-col cols="12" sm="6" md="3">
        <v-card class="table-card pa-5 d-flex align-center" rounded="xl">
          <div class="stat-icon-wrapper-glow info-glowing-icon mr-4">
            <v-icon icon="mdi-account-group-outline" size="24" />
          </div>
          <div>
            <div class="text-caption font-weight-bold text-grey-darken-1">TỔNG TÀI KHOẢN</div>
            <div class="text-h4 font-weight-black text-secondary mt-1">{{ accounts.length }}</div>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="table-card pa-5 d-flex align-center" rounded="xl">
          <div class="stat-icon-wrapper-glow success-glowing-icon mr-4">
            <v-icon icon="mdi-shield-account-outline" size="24" />
          </div>
          <div>
            <div class="text-caption font-weight-bold text-grey-darken-1">THỦ THƯ</div>
            <div class="text-h4 font-weight-black text-success mt-1">{{ countByRole('Librarian') }}</div>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="table-card pa-5 d-flex align-center" rounded="xl">
          <div class="stat-icon-wrapper-glow warning-glowing-icon mr-4">
            <v-icon icon="mdi-card-account-details-outline" size="24" />
          </div>
          <div>
            <div class="text-caption font-weight-bold text-grey-darken-1">ĐỘC GIẢ</div>
            <div class="text-h4 font-weight-black text-warning mt-1">{{ countByRole('Reader') }}</div>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="table-card pa-5 d-flex align-center" rounded="xl">
          <div class="stat-icon-wrapper-glow error-glowing-icon mr-4">
            <v-icon icon="mdi-account-lock-outline" size="24" />
          </div>
          <div>
            <div class="text-caption font-weight-bold text-grey-darken-1">TÀI KHOẢN KHÓA</div>
            <div class="text-h4 font-weight-black text-error mt-1">{{ lockedCount }}</div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Filters -->
    <v-card class="table-card pa-4 mb-6" rounded="xl">
      <v-row dense class="align-center">
        <v-col cols="12" md="6" lg="4">
          <v-text-field
            v-model="keyword"
            label="Tìm theo họ tên hoặc email"
            prepend-inner-icon="mdi-magnify"
            density="comfortable"
            variant="outlined"
            rounded="xl"
            clearable
            hide-details
          />
        </v-col>

        <v-col cols="12" md="4" lg="3">
          <v-select
            v-model="roleFilter"
            :items="['Librarian', 'Reader']"
            label="Bộ lọc vai trò"
            density="comfortable"
            variant="outlined"
            rounded="xl"
            clearable
            hide-details
          />
        </v-col>
      </v-row>
    </v-card>

    <!-- Accounts Table -->
    <v-card class="table-card overflow-hidden" rounded="xl">
      <v-table class="premium-table">
        <thead>
          <tr>
            <th style="width: 44px;">
              <v-checkbox-btn
                :model-value="allAccountsSelected"
                :indeterminate="isAccountsIndeterminate"
                color="primary"
                @update:model-value="toggleSelectAllAccounts"
              />
            </th>
            <th class="font-weight-black text-secondary">Họ tên</th>
            <th class="font-weight-black text-secondary">Email</th>
            <th class="font-weight-black text-secondary">Vai trò</th>
            <th class="font-weight-black text-secondary">Trạng thái</th>
            <th class="font-weight-black text-secondary">Đăng nhập gần nhất</th>
            <th class="text-center font-weight-black text-secondary">Thao tác</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="acc in filteredAccounts" :key="acc.userId || acc.id" class="hover-row">
            <td>
              <v-checkbox-btn v-model="selectedAccountIds" :value="acc.userId" color="primary" />
            </td>
            <td class="font-weight-bold text-secondary">{{ acc.fullName }}</td>
            <td>{{ acc.email }}</td>
            <td>
              <v-chip
                size="small"
                :color="acc.role === 'Librarian' ? 'success' : (acc.role === 'Admin' ? 'primary' : 'warning')"
                variant="flat"
                class="font-weight-bold px-3"
              >
                {{ roleLabel(acc.role) }}
              </v-chip>
            </td>
            <td>
              <v-chip size="small" :color="acc.isLocked ? 'error' : 'success'" variant="tonal" class="font-weight-bold">
                {{ acc.isLocked ? 'Đã khóa' : 'Hoạt động' }}
              </v-chip>
            </td>
            <td class="text-grey-darken-1">{{ acc.lastLoginAt ? formatDate(acc.lastLoginAt) : '-' }}</td>
            <td>
              <div class="d-flex justify-center ga-1">
                <v-tooltip text="Đặt lại mật khẩu">
                  <template #activator="{ props }">
                    <v-btn
                      v-bind="props"
                      icon="mdi-lock-reset"
                      size="small"
                      variant="text"
                      color="secondary"
                      @click="openResetDialog(acc)"
                    />
                  </template>
                </v-tooltip>

                <v-tooltip :text="acc.isLocked ? 'Mở khóa tài khoản' : 'Khóa tài khoản'">
                  <template #activator="{ props }">
                    <v-btn
                      v-bind="props"
                      :icon="acc.isLocked ? 'mdi-lock-open-variant-outline' : 'mdi-lock-outline'"
                      size="small"
                      variant="text"
                      :color="acc.isLocked ? 'success' : 'error'"
                      @click="openLockDialog(acc)"
                    />
                  </template>
                </v-tooltip>
              </div>
            </td>
          </tr>

          <tr v-if="!loading && !filteredAccounts.length">
            <td colspan="7" class="text-center pa-8 text-medium-emphasis">
              <v-icon icon="mdi-account-question-outline" size="48" color="grey" class="mb-2" />
              <div>Không tìm thấy tài khoản phù hợp với bộ lọc</div>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>

    <!-- Floating Bulk Actions -->
    <transition name="dl-fade">
      <div v-if="selectedAccountIds.length" class="bulk-bar glassmorphic shadow-lg">
        <div class="bulk-count text-secondary font-weight-bold">
          <strong>{{ selectedAccountIds.length }}</strong> tài khoản đã chọn
        </div>
        <v-divider vertical class="mx-4" style="height: 24px;" />
        <v-btn
          color="error"
          variant="flat"
          rounded="xl"
          prepend-icon="mdi-lock-outline"
          class="font-weight-bold px-5"
          @click="confirmBulkLock = true"
        >
          Khóa loạt
        </v-btn>
        <v-btn
          variant="tonal"
          color="secondary"
          rounded="xl"
          class="ml-2 font-weight-bold"
          @click="selectedAccountIds = []"
        >
          Hủy chọn
        </v-btn>
      </div>
    </transition>

    <!-- Bulk lock confirm -->
    <v-dialog v-model="confirmBulkLock" max-width="420">
      <v-card rounded="xl" class="pa-4 scale-in-dialog">
        <v-card-title class="d-flex align-center font-weight-black text-secondary">
          <v-icon icon="mdi-alert-circle" color="error" class="mr-2" />
          Khóa tài khoản hàng loạt
        </v-card-title>
        <v-card-text class="pt-2 text-body-2 text-grey-darken-2">
          Bạn chắc chắn muốn khóa <strong>{{ selectedAccountIds.length }}</strong> tài khoản đã chọn? Những người dùng này sẽ lập tức mất quyền truy cập hệ thống.
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn variant="tonal" color="secondary" @click="confirmBulkLock = false" rounded="xl">Hủy</v-btn>
          <v-btn color="error" variant="flat" :loading="bulkActing" @click="bulkLockAccounts" rounded="xl" class="px-5 font-weight-bold">
            Xác nhận khóa
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog tạo tài khoản mới -->
    <v-dialog v-model="createDialog" max-width="480">
      <v-card rounded="xl" class="pa-4">
        <v-card-title class="font-weight-black text-secondary mb-4">Tạo tài khoản mới</v-card-title>
        <v-card-text class="pa-0">
          <v-text-field v-model="newAccount.fullName" label="Họ và tên" variant="outlined" rounded="lg" class="mb-3" />
          <v-text-field v-model="newAccount.email" label="Email" variant="outlined" rounded="lg" class="mb-3" />
          <v-text-field v-model="newAccount.password" label="Mật khẩu tạm thời" type="password" variant="outlined" rounded="lg" class="mb-4" />
          <v-select v-model="newAccount.role" :items="['Librarian', 'Reader']" label="Vai trò hệ thống" variant="outlined" rounded="lg" />
        </v-card-text>
        <v-card-actions class="pt-4">
          <v-spacer />
          <v-btn variant="tonal" color="secondary" @click="createDialog = false" rounded="xl">Hủy</v-btn>
          <v-btn color="primary" variant="flat" :loading="creating" @click="submitCreate" rounded="xl" class="px-5 font-weight-bold">
            Tạo tài khoản
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog reset mật khẩu -->
    <v-dialog v-model="resetDialog" max-width="420">
      <v-card rounded="xl" class="pa-4 scale-in-dialog">
        <v-card-title class="d-flex align-center font-weight-black text-secondary">
          <v-icon icon="mdi-lock-reset" color="warning" class="mr-2" />
          Đặt lại mật khẩu
        </v-card-title>
        <v-card-text class="pt-2 text-body-2 text-grey-darken-2">
          Gửi mã/email đặt lại mật khẩu cho tài khoản <strong>{{ targetAccount?.email }}</strong>. Xác nhận tiếp tục?
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn variant="tonal" color="secondary" @click="resetDialog = false" rounded="xl">Hủy</v-btn>
          <v-btn color="primary" variant="flat" :loading="acting" @click="submitReset" rounded="xl" class="px-5 font-weight-bold">
            Xác nhận
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog khóa/mở khóa đơn lẻ -->
    <v-dialog v-model="lockDialog" max-width="420">
      <v-card rounded="xl" class="pa-4 scale-in-dialog">
        <v-card-title class="d-flex align-center font-weight-black text-secondary">
          <v-icon :icon="targetAccount?.isLocked ? 'mdi-lock-open-variant-outline' : 'mdi-lock-outline'" :color="targetAccount?.isLocked ? 'success' : 'error'" class="mr-2" />
          {{ targetAccount?.isLocked ? 'Mở khóa tài khoản' : 'Khóa tài khoản' }}
        </v-card-title>
        <v-card-text class="pt-2 text-body-2 text-grey-darken-2">
          <template v-if="targetAccount?.isLocked">
            Mở khóa hoạt động cho tài khoản <strong>{{ targetAccount?.fullName }}</strong>?
          </template>
          <template v-else>
            Khóa hoạt động tài khoản <strong>{{ targetAccount?.fullName }}</strong>? Người này sẽ không thể truy cập hệ thống.
          </template>
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn variant="tonal" color="secondary" @click="lockDialog = false" rounded="xl">Hủy</v-btn>
          <v-btn :color="targetAccount?.isLocked ? 'success' : 'error'" variant="flat" :loading="acting" @click="submitLockToggle" rounded="xl" class="px-5 font-weight-bold">
            Xác nhận
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { userApi } from '../../api/userApi'
import { readerApi } from '../../api/readerApi'
import ImportExcelDialog from '../../components/ImportExcelDialog.vue'

const accounts = ref([])
const loading = ref(false)

const selectedAccountIds = ref([])
const confirmBulkLock = ref(false)
const bulkActing = ref(false)

const importDialog = ref(false)

const accountImportColumns = [
  { key: 'fullName', label: 'Họ và tên', required: true },
  { key: 'email', label: 'Email', required: true },
  { key: 'password', label: 'Mật khẩu tạm thời', required: true },
  { key: 'role', label: 'Vai trò (Librarian/Reader)', required: true }
]

function importAccountRow(row) {
  return userApi.create({
    fullName: row.fullName,
    email: row.email,
    password: row.password,
    role: row.role === 'Librarian' ? 'Librarian' : 'Reader'
  })
}

const message = ref('')
const success = ref(true)

const keyword = ref('')
const roleFilter = ref(null)

const createDialog = ref(false)
const resetDialog = ref(false)
const lockDialog = ref(false)
const creating = ref(false)
const acting = ref(false)
const targetAccount = ref(null)

const newAccount = ref({ fullName: '', email: '', password: '', role: 'Librarian' })

const allAccountsSelected = computed(() =>
  filteredAccounts.value.length > 0 &&
  filteredAccounts.value.every(a => selectedAccountIds.value.includes(a.userId || a.id))
)

const isAccountsIndeterminate = computed(() =>
  !allAccountsSelected.value && filteredAccounts.value.some(a => selectedAccountIds.value.includes(a.userId || a.id))
)

function toggleSelectAllAccounts(value) {
  const ids = filteredAccounts.value.map(a => a.userId || a.id)

  if (value) {
    selectedAccountIds.value = [...new Set([...selectedAccountIds.value, ...ids])]
  } else {
    selectedAccountIds.value = selectedAccountIds.value.filter(id => !ids.includes(id))
  }
}

async function bulkLockAccounts() {
  bulkActing.value = true

  try {
    for (const id of selectedAccountIds.value) {
      await userApi.lockUser(id)
    }

    success.value = true
    message.value = `Đã khóa ${selectedAccountIds.value.length} tài khoản thành công`
    selectedAccountIds.value = []
    confirmBulkLock.value = false

    await loadAccounts()
  } catch (err) {
    success.value = false
    message.value = err.response?.data?.message || 'Khóa tài khoản hàng loạt thất bại'
    console.error(err.response || err)
  } finally {
    bulkActing.value = false
  }
}

const filteredAccounts = computed(() => {
  return accounts.value.filter(acc => {
    if (roleFilter.value && acc.role !== roleFilter.value) return false

    if (keyword.value) {
      const k = keyword.value.toLowerCase().trim()
      const matches = String(acc.fullName || '').toLowerCase().includes(k) ||
        String(acc.email || '').toLowerCase().includes(k)
      if (!matches) return false
    }

    return true
  })
})

const lockedCount = computed(() => accounts.value.filter(a => a.isLocked).length)

function countByRole(role) {
  return accounts.value.filter(a => a.role === role).length
}

function roleLabel(role) {
  if (role === 'Librarian') return 'Thủ thư'
  if (role === 'Reader') return 'Độc giả'
  if (role === 'Admin') return 'Quản trị'
  return role
}

function formatDate(value) {
  return new Date(value).toLocaleString('vi-VN')
}

async function loadAccounts() {
  loading.value = true
  message.value = ''

  try {
    try {
      const res = await userApi.getAll()
      accounts.value = res.data || []
    } catch {
      // Fallback
      const readerRes = await readerApi.getAll()
      accounts.value = (readerRes.data || []).map(r => ({
        userId: r.userId || r.id,
        id: r.userId || r.id,
        fullName: r.fullName,
        email: r.email,
        role: 'Reader',
        isLocked: r.isLocked || r.cardStatus === 'Locked',
        lastLoginAt: r.lastLoginAt
      }))

      message.value = 'Chưa kết nối được API quản trị tổng hợp — đang tải tạm danh sách Độc giả.'
      success.value = false
    }
  } catch (err) {
    success.value = false
    message.value = err.response?.data?.message || 'Không tải được danh sách tài khoản'
    console.error(err.response || err)
  } finally {
    loading.value = false
  }
}

function openCreateDialog() {
  newAccount.value = { fullName: '', email: '', password: '', role: 'Librarian' }
  createDialog.value = true
}

async function submitCreate() {
  creating.value = true

  try {
    await userApi.create(newAccount.value)
    success.value = true
    message.value = `Đã tạo tài khoản cho ${newAccount.value.fullName}`
    createDialog.value = false
    await loadAccounts()
  } catch (err) {
    success.value = false
    message.value = err.response?.data?.message || 'Tạo tài khoản thất bại'
    console.error(err.response || err)
  } finally {
    creating.value = false
  }
}

function openResetDialog(acc) {
  targetAccount.value = acc
  resetDialog.value = true
}

async function submitReset() {
  acting.value = true

  try {
    await userApi.resetPassword(targetAccount.value.userId || targetAccount.value.id)
    success.value = true
    message.value = `Đã gửi mã đặt lại mật khẩu tới ${targetAccount.value.email}`
    resetDialog.value = false
  } catch (err) {
    success.value = false
    message.value = err.response?.data?.message || 'Đặt lại mật khẩu thất bại'
    console.error(err.response || err)
  } finally {
    acting.value = false
  }
}

function openLockDialog(acc) {
  targetAccount.value = acc
  lockDialog.value = true
}

async function submitLockToggle() {
  acting.value = true
  const id = targetAccount.value.userId || targetAccount.value.id

  try {
    if (targetAccount.value.isLocked) {
      await userApi.unlockUser(id)
      message.value = `Đã mở khóa tài khoản ${targetAccount.value.fullName}`
    } else {
      await userApi.lockUser(id)
      message.value = `Đã khóa tài khoản ${targetAccount.value.fullName}`
    }

    success.value = true
    lockDialog.value = false
    await loadAccounts()
  } catch (err) {
    success.value = false
    message.value = err.response?.data?.message || 'Thao tác thất bại'
    console.error(err.response || err)
  } finally {
    acting.value = false
  }
}

onMounted(loadAccounts)
</script>

<style scoped>
.bulk-bar {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  display: flex;
  align-items: center;
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 40px;
}
</style>
