<template>
  <div style="max-width: 800px;">
    <!-- Page header -->
    <div class="mb-6">
      <h2 class="page-title font-weight-black text-secondary">Cài đặt cá nhân</h2>
      <p class="page-subtitle">Quản lý thông tin tài khoản, bảo mật đăng nhập và tùy chọn giao diện hiển thị</p>
    </div>

    <!-- Alert Message -->
    <v-alert
      v-if="message"
      :type="success ? 'success' : 'error'"
      variant="tonal"
      class="mb-6"
      rounded="lg"
      closable
      @click:close="message = ''"
    >
      {{ message }}
    </v-alert>

    <!-- 1. Thông tin cá nhân -->
    <v-card class="table-card pa-6 mb-6" rounded="xl">
      <div class="d-flex align-center justify-between mb-6">
        <div class="d-flex align-center">
          <div class="stat-icon-wrapper-glow info-glowing-icon mr-3">
            <v-icon icon="mdi-account-outline" size="22" />
          </div>
          <div>
            <h3 class="text-subtitle-1 font-weight-black text-secondary">Thông tin cá nhân</h3>
            <p class="text-caption text-grey">Họ tên, email và thông tin liên hệ hiển thị trên hệ thống</p>
          </div>
        </div>
        <v-btn
          v-if="!editingInfo"
          variant="tonal"
          color="primary"
          rounded="xl"
          class="font-weight-bold"
          prepend-icon="mdi-pencil-outline"
          @click="startEditInfo"
        >
          Chỉnh sửa
        </v-btn>
      </div>

      <v-row dense class="mt-2">
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="infoForm.fullName"
            label="Họ và tên"
            variant="outlined"
            rounded="lg"
            :disabled="!editingInfo"
          />
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="infoForm.email"
            label="Email"
            variant="outlined"
            rounded="lg"
            :disabled="!editingInfo"
          />
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="infoForm.phone"
            label="Số điện thoại"
            variant="outlined"
            rounded="lg"
            :disabled="!editingInfo"
          />
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="infoForm.address"
            label="Địa chỉ"
            variant="outlined"
            rounded="lg"
            :disabled="!editingInfo"
          />
        </v-col>
      </v-row>

      <div v-if="editingInfo" class="d-flex justify-end ga-2 mt-2">
        <v-btn variant="tonal" color="secondary" rounded="xl" @click="cancelEditInfo">Hủy</v-btn>
        <v-btn color="primary" variant="flat" rounded="xl" :loading="savingInfo" class="font-weight-bold" @click="saveInfo">
          Lưu thay đổi
        </v-btn>
      </div>
    </v-card>

    <!-- 2. Đổi mật khẩu -->
    <v-card class="table-card pa-6 mb-6" rounded="xl">
      <div class="d-flex align-center mb-6">
        <div class="stat-icon-wrapper-glow warning-glowing-icon mr-3">
          <v-icon icon="mdi-lock-outline" size="22" />
        </div>
        <div>
          <h3 class="text-subtitle-1 font-weight-black text-secondary">Đổi mật khẩu</h3>
          <p class="text-caption text-grey">Nên sử dụng mật khẩu mạnh để bảo mật tài khoản</p>
        </div>
      </div>

      <v-row dense>
        <v-col cols="12" sm="4">
          <v-text-field
            v-model="passwordForm.currentPassword"
            label="Mật khẩu hiện tại"
            type="password"
            variant="outlined"
            rounded="lg"
          />
        </v-col>
        <v-col cols="12" sm="4">
          <v-text-field
            v-model="passwordForm.newPassword"
            label="Mật khẩu mới"
            type="password"
            variant="outlined"
            rounded="lg"
          />
        </v-col>
        <v-col cols="12" sm="4">
          <v-text-field
            v-model="passwordForm.confirmPassword"
            label="Xác nhận mật khẩu mới"
            type="password"
            variant="outlined"
            rounded="lg"
            :error-messages="confirmError"
          />
        </v-col>
      </v-row>

      <div class="d-flex justify-end mt-2">
        <v-btn color="primary" variant="flat" rounded="xl" :loading="changing" class="font-weight-bold" @click="submitChangePassword">
          Cập nhật mật khẩu
        </v-btn>
      </div>
    </v-card>

    <!-- 3. Tùy chọn giao diện -->
    <v-card class="table-card pa-6 mb-6" rounded="xl">
      <div class="d-flex align-center mb-6">
        <div class="stat-icon-wrapper-glow success-glowing-icon mr-3">
          <v-icon icon="mdi-theme-light-dark" size="22" />
        </div>
        <div>
          <h3 class="text-subtitle-1 font-weight-black text-secondary">Giao diện &amp; Ngôn ngữ</h3>
          <p class="text-caption text-grey">Tùy chỉnh phong cách hiển thị theo sở thích cá nhân</p>
        </div>
      </div>

      <div class="d-flex align-center justify-between py-3 border-b">
        <div>
          <div class="font-weight-bold text-secondary text-body-2">Chế độ tối (Dark mode)</div>
          <div class="text-caption text-grey">Chuyển đổi giao diện nền tối dịu mắt hơn vào ban đêm</div>
        </div>
        <v-switch :model-value="isDark" color="primary" hide-details @update:model-value="onToggleDark" />
      </div>

      <div class="d-flex align-center justify-between py-3">
        <div>
          <div class="font-weight-bold text-secondary text-body-2">Ngôn ngữ hiển thị</div>
          <div class="text-caption text-grey">Hỗ trợ đầy đủ định dạng bản dịch Tiếng Việt và Tiếng Anh</div>
        </div>
        <v-select
          v-model="language"
          :items="['Tiếng Việt', 'English']"
          density="compact"
          variant="outlined"
          rounded="lg"
          hide-details
          style="max-width: 160px;"
          @update:model-value="saveLanguage"
        />
      </div>
    </v-card>

    <!-- 4. Nhận thông báo -->
    <v-card class="table-card pa-6 mb-6" rounded="xl">
      <div class="d-flex align-center mb-6">
        <div class="stat-icon-wrapper-glow cyan-glowing-icon mr-3">
          <v-icon icon="mdi-bell-ring-outline" size="22" />
        </div>
        <div>
          <h3 class="text-subtitle-1 font-weight-black text-secondary">Cài đặt thông báo</h3>
          <p class="text-caption text-grey">Chọn các kênh bạn muốn nhận tin báo nhắc hạn trả và phạt</p>
        </div>
      </div>

      <div class="d-flex align-center justify-between py-3 border-b">
        <div>
          <div class="font-weight-bold text-secondary text-body-2">Thông báo qua Email</div>
          <div class="text-caption text-grey">Nhận thư thông báo nhắc trả sách quá hạn và hóa đơn thanh toán</div>
        </div>
        <v-switch v-model="notifications.email" color="primary" hide-details @update:model-value="saveNotifications" />
      </div>

      <div class="d-flex align-center justify-between py-3">
        <div>
          <div class="font-weight-bold text-secondary text-body-2">Tin nhắn SMS</div>
          <div class="text-caption text-grey">Gửi tin nhắn trực tiếp qua điện thoại khi sắp quá hạn</div>
        </div>
        <v-switch v-model="notifications.sms" color="primary" hide-details @update:model-value="saveNotifications" />
      </div>
    </v-card>

    <!-- 5. Bảo mật 2 lớp -->
    <v-card class="table-card pa-6 mb-6" rounded="xl">
      <div class="d-flex align-center mb-6">
        <div class="stat-icon-wrapper-glow purple-glowing-icon mr-3">
          <v-icon icon="mdi-shield-key-outline" size="22" />
        </div>
        <div>
          <h3 class="text-subtitle-1 font-weight-black text-secondary">Bảo mật hai lớp (2FA)</h3>
          <p class="text-caption text-grey">Xác minh danh tính của bạn qua mã OTP khi đăng nhập từ thiết bị lạ</p>
        </div>
      </div>

      <div class="d-flex align-center justify-between py-3">
        <div>
          <div class="font-weight-bold text-secondary text-body-2">Xác thực OTP qua Email</div>
          <div class="text-caption text-grey">Kích hoạt yêu cầu nhập mã 6 số gửi về email đăng nhập</div>
        </div>
        <v-switch v-model="twoFactorEnabled" color="primary" hide-details @update:model-value="saveTwoFactor" />
      </div>
    </v-card>

    <!-- 6. Vùng nguy hiểm -->
    <v-card class="table-card pa-6 border-red mb-6" rounded="xl" style="border: 1px solid rgba(220, 38, 38, 0.2) !important;">
      <div class="d-flex align-center mb-6">
        <div class="stat-icon-wrapper-glow error-glowing-icon mr-3">
          <v-icon icon="mdi-alert-octagon-outline" size="22" />
        </div>
        <div>
          <h3 class="text-subtitle-1 font-weight-black text-error">Vùng nguy hiểm</h3>
          <p class="text-caption text-grey">Các hành động thay đổi quyền sở hữu hoặc hủy bỏ quyền truy cập</p>
        </div>
      </div>

      <div class="d-flex align-center justify-between py-3 border-b">
        <div>
          <div class="font-weight-bold text-secondary text-body-2">Đăng xuất tài khoản</div>
          <div class="text-caption text-grey">Đăng xuất khỏi phiên làm việc hiện tại trên trình duyệt này</div>
        </div>
        <v-btn variant="tonal" color="secondary" rounded="xl" prepend-icon="mdi-logout" @click="logout">Đăng xuất</v-btn>
      </div>

      <div class="d-flex align-center justify-between py-3">
        <div>
          <div class="font-weight-bold text-secondary text-body-2">Xóa tài khoản vĩnh viễn</div>
          <div class="text-caption text-grey">Hủy toàn bộ thông tin đăng nhập và hồ sơ thẻ của bạn</div>
        </div>
        <v-btn variant="tonal" color="error" rounded="xl" prepend-icon="mdi-delete-outline" @click="confirmDeleteDialog = true">
          Xóa tài khoản
        </v-btn>
      </div>
    </v-card>

    <!-- Confirm delete account -->
    <v-dialog v-model="confirmDeleteDialog" max-width="440">
      <v-card rounded="xl" class="pa-4 scale-in-dialog">
        <v-card-title class="d-flex align-center font-weight-black text-error">
          <v-icon icon="mdi-alert-circle" class="mr-2" />
          Xác nhận xóa tài khoản
        </v-card-title>
        <v-card-text class="pt-2 text-body-2 text-grey-darken-2">
          Hành động này sẽ xóa <strong>vĩnh viễn</strong> tài khoản và toàn bộ lịch sử giao dịch. Bạn không thể khôi phục sau khi đồng ý. Vui lòng nhập chữ <strong>"XÓA"</strong> bên dưới để tiếp tục.
        </v-card-text>
        <v-card-text class="pt-0">
          <v-text-field v-model="deleteConfirmText" placeholder="Nhập XÓA để xác nhận" variant="outlined" density="comfortable" rounded="lg" hide-details />
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn variant="tonal" color="secondary" @click="confirmDeleteDialog = false" rounded="xl">Hủy</v-btn>
          <v-btn color="error" variant="flat" :disabled="deleteConfirmText !== 'XÓA'" @click="deleteAccount" rounded="xl" class="px-5 font-weight-bold">
            Xóa vĩnh viễn
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'
import { authApi } from '../../api/authApi'
import { useThemeMode } from '../../composables/useThemeMode'

const router = useRouter()
const auth = useAuthStore()
const { isDark, setDark } = useThemeMode()

const message = ref('')
const success = ref(true)

// Personal info
const editingInfo = ref(false)
const savingInfo = ref(false)
const infoForm = ref({
  fullName: auth.fullName || '',
  email: auth.email || '',
  phone: auth.user?.phone || '',
  address: auth.user?.address || ''
})
let infoBackup = null

function startEditInfo() {
  infoBackup = { ...infoForm.value }
  editingInfo.value = true
}

function cancelEditInfo() {
  infoForm.value = { ...infoBackup }
  editingInfo.value = false
}

async function saveInfo() {
  savingInfo.value = true
  try {
    const res = await authApi.updateProfile(infoForm.value)
    success.value = true
    message.value = 'Đã lưu thông tin cá nhân thành công!'
    editingInfo.value = false
    // Cập nhật lại trong authStore
    auth.user = { ...auth.user, ...infoForm.value }
    localStorage.setItem('user', JSON.stringify(auth.user))
  } catch (err) {
    success.value = false
    message.value = err.response?.data?.message || 'Cập nhật thông tin thất bại.'
    console.error(err.response || err)
  } finally {
    savingInfo.value = false
  }
}

// Change password
const changing = ref(false)
const passwordForm = ref({ currentPassword: '', newPassword: '', confirmPassword: '' })

const confirmError = computed(() => {
  if (!passwordForm.value.confirmPassword) return ''
  return passwordForm.value.confirmPassword !== passwordForm.value.newPassword
    ? 'Mật khẩu xác nhận không khớp'
    : ''
})

async function submitChangePassword() {
  if (!passwordForm.value.currentPassword || !passwordForm.value.newPassword) {
    success.value = false
    message.value = 'Vui lòng nhập đầy đủ thông tin'
    return
  }

  if (confirmError.value) {
    success.value = false
    message.value = confirmError.value
    return
  }

  changing.value = true
  try {
    await authApi.changePassword({
      currentPassword: passwordForm.value.currentPassword,
      newPassword: passwordForm.value.newPassword
    })
    success.value = true
    message.value = 'Đổi mật khẩu thành công!'
    passwordForm.value = { currentPassword: '', newPassword: '', confirmPassword: '' }
  } catch (err) {
    success.value = false
    message.value = err.response?.data?.message || 'Đổi mật khẩu thất bại.'
    console.error(err.response || err)
  } finally {
    changing.value = false
  }
}

// Appearance / Language
const language = ref(localStorage.getItem('language') || 'Tiếng Việt')

function onToggleDark(value) {
  setDark(value)
  success.value = true
  message.value = value ? 'Đã kích hoạt giao diện tối' : 'Đã kích hoạt giao diện sáng'
}

function saveLanguage(value) {
  localStorage.setItem('language', value)
  message.value = value === 'Tiếng Việt'
    ? 'Đã cập nhật tuỳ chọn ngôn ngữ'
    : 'English UI is under development — English text will be available soon.'
  success.value = true
}

// Notifications
const notifications = ref({
  email: localStorage.getItem('notif:email') !== 'false',
  sms: localStorage.getItem('notif:sms') === 'true'
})

function saveNotifications() {
  localStorage.setItem('notif:email', notifications.value.email)
  localStorage.setItem('notif:sms', notifications.value.sms)
  success.value = true
  message.value = 'Đã lưu cấu hình thông báo thành công'
}

// 2FA
const twoFactorEnabled = ref(localStorage.getItem('2fa') === 'true')

function saveTwoFactor(value) {
  localStorage.setItem('2fa', value)
  success.value = true
  message.value = value ? 'Đã bật xác thực 2 lớp (chế độ demo)' : 'Đã tắt xác thực 2 lớp'
}

// Actions
const confirmDeleteDialog = ref(false)
const deleteConfirmText = ref('')

function logout() {
  auth.logout()
  router.push('/')
}

function deleteAccount() {
  confirmDeleteDialog.value = false
  auth.logout()
  router.push('/')
}
</script>
