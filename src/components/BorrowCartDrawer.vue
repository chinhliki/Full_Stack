<template>
  <!-- FAB Button — always visible when cart has items -->
  <div class="cart-fab-wrapper">
    <v-badge
      :content="cart.count"
      :model-value="cart.count > 0"
      color="error"
      offset-x="4"
      offset-y="4"
    >
      <v-btn
        icon
        size="56"
        color="primary"
        class="cart-fab-btn"
        elevation="8"
        @click="drawerOpen = !drawerOpen"
      >
        <v-icon :icon="drawerOpen ? 'mdi-close' : 'mdi-cart'" size="26" />
      </v-btn>
    </v-badge>
  </div>

  <!-- Cart Drawer -->
  <v-navigation-drawer
    v-model="drawerOpen"
    location="right"
    width="400"
    temporary
    class="cart-drawer"
  >
    <!-- Header -->
    <div class="cart-header d-flex align-center pa-4">
      <v-icon icon="mdi-cart" color="primary" class="mr-2" />
      <span class="font-weight-black text-h6">Giỏ mượn sách</span>
      <v-spacer />
      <v-chip size="small" color="primary" variant="tonal" class="mr-2">
        {{ cart.count }}/5 quyển
      </v-chip>
      <v-btn icon="mdi-close" variant="text" size="small" @click="drawerOpen = false" />
    </div>

    <v-divider />

    <!-- Slot usage warning -->
    <v-alert
      v-if="props.myActiveBorrowCount > 0"
      type="info"
      variant="tonal"
      density="compact"
      rounded="0"
      class="text-caption"
    >
      Bạn đang mượn <b>{{ props.myActiveBorrowCount }}</b> quyển. Giỏ này sẽ mượn thêm
      <b>{{ cart.count }}</b> quyển. Tổng: <b>{{ props.myActiveBorrowCount + cart.count }}/5</b>.
    </v-alert>

    <!-- Feedback alert -->
    <v-alert
      v-if="feedback.message"
      :type="feedback.ok ? 'success' : 'error'"
      variant="tonal"
      density="compact"
      rounded="0"
      closable
      @click:close="feedback.message = ''"
    >
      {{ feedback.message }}
    </v-alert>

    <!-- Empty state -->
    <div v-if="cart.count === 0" class="empty-cart d-flex flex-column align-center justify-center pa-8">
      <v-icon icon="mdi-cart-outline" size="64" color="grey-lighten-1" />
      <div class="text-subtitle-1 font-weight-bold mt-3 text-grey">Giỏ mượn trống</div>
      <div class="text-body-2 text-grey mt-1 text-center">
        Nhấn "Thêm vào giỏ" trên danh sách sách để bắt đầu
      </div>
    </div>

    <!-- Cart items -->
    <v-list v-else class="pa-2" lines="two">
      <v-list-item
        v-for="book in cart.items"
        :key="book.id"
        class="cart-item mb-2"
        rounded="xl"
      >
        <template #prepend>
          <v-avatar size="52" rounded="lg" class="mr-3">
            <v-img v-if="book.coverImageUrl" :src="book.coverImageUrl" cover />
            <v-icon v-else icon="mdi-book-open-page-variant" />
          </v-avatar>
        </template>

        <v-list-item-title class="font-weight-bold text-body-2">
          {{ book.title }}
        </v-list-item-title>
        <v-list-item-subtitle class="text-caption">
          {{ book.author }}
        </v-list-item-subtitle>

        <template #append>
          <v-btn
            icon="mdi-close"
            size="x-small"
            variant="tonal"
            color="error"
            @click="cart.removeBook(book.id)"
          />
        </template>
      </v-list-item>
    </v-list>

    <!-- Footer: Due date + Actions -->
    <template #append>
      <v-divider />
      <div class="pa-4">
        <v-text-field
          v-model="dueDate"
          label="Hạn trả sách (tất cả)"
          type="datetime-local"
          prepend-inner-icon="mdi-calendar-clock"
          density="comfortable"
          variant="outlined"
          rounded="lg"
          hint="Áp dụng cho toàn bộ sách trong giỏ"
          persistent-hint
          class="mb-3"
        />

        <v-btn
          color="primary"
          block
          size="large"
          rounded="lg"
          :loading="submitting"
          :disabled="cart.count === 0 || overLimit"
          prepend-icon="mdi-book-check"
          @click="submitCart"
        >
          Gửi yêu cầu mượn ({{ cart.count }} quyển)
        </v-btn>

        <v-alert
          v-if="overLimit"
          type="error"
          variant="tonal"
          density="compact"
          rounded="lg"
          class="mt-3 text-caption"
        >
          Tổng sách mượn sẽ vượt giới hạn 5 quyển. Vui lòng bỏ bớt sách.
        </v-alert>

        <v-btn
          v-if="cart.count > 0"
          variant="text"
          color="grey"
          block
          size="small"
          class="mt-2"
          prepend-icon="mdi-delete-sweep"
          @click="confirmClear"
        >
          Xóa toàn bộ giỏ
        </v-btn>
      </div>
    </template>
  </v-navigation-drawer>

  <!-- Confirm clear dialog -->
  <v-dialog v-model="clearDialog" max-width="380">
    <v-card rounded="xl">
      <v-card-title class="d-flex align-center pt-5 px-5">
        <v-icon icon="mdi-delete-sweep" color="error" class="mr-2" />
        Xóa giỏ mượn
      </v-card-title>
      <v-card-text class="px-5">Xóa hết {{ cart.count }} cuốn trong giỏ?</v-card-text>
      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn variant="text" @click="clearDialog = false">Hủy</v-btn>
        <v-btn color="error" variant="tonal" @click="doClear">Xóa hết</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useCartStore } from '../stores/cartStore'
import { useAuthStore } from '../stores/authStore'
import { borrowApi } from '../api/borrowApi'

const props = defineProps({
  myActiveBorrowCount: { type: Number, default: 0 }
})

const emit = defineEmits(['checkout-success'])

const cart = useCartStore()
const auth = useAuthStore()

const drawerOpen = ref(false)
const submitting = ref(false)
const clearDialog = ref(false)
const feedback = ref({ message: '', ok: true })

const overLimit = computed(() =>
  props.myActiveBorrowCount + cart.count > 5
)

function toDateTimeLocal(date) {
  const pad = (n) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

const dueDate = ref(toDateTimeLocal(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)))

const readerId = computed(() =>
  auth.user?.id || auth.user?.userId || auth.user?.readerId || auth.user?.sub
)

async function submitCart() {
  if (!readerId.value) {
    feedback.value = { message: 'Không xác định được tài khoản. Vui lòng đăng nhập lại.', ok: false }
    return
  }
  submitting.value = true
  feedback.value = { message: '', ok: true }

  const borrowDate = new Date().toISOString()
  const dueDateISO = new Date(dueDate.value).toISOString()

  try {
    await borrowApi.createFromCart({
      readerId: readerId.value,
      borrowDate,
      books: cart.items.map(b => ({ bookId: b.id, dueDate: dueDateISO }))
    })
    onSuccess()
  } catch (batchErr) {
    // Fallback: if batch endpoint not yet deployed, try sequential creates
    if ([404, 405, 501].includes(batchErr.response?.status)) {
      await fallbackSequential(borrowDate, dueDateISO)
    } else {
      const msg = batchErr.response?.data?.message || batchErr.response?.data?.detail || 'Gửi yêu cầu thất bại.'
      feedback.value = { message: msg, ok: false }
    }
  } finally {
    submitting.value = false
  }
}

async function fallbackSequential(borrowDate, dueDateISO) {
  const errors = []
  const succeeded = []

  for (const book of [...cart.items]) {
    try {
      await borrowApi.create({
        readerId: readerId.value,
        bookId: book.id,
        borrowDate,
        dueDate: dueDateISO
      })
      succeeded.push(book)
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.detail || 'Lỗi'
      errors.push(`"${book.title}": ${msg}`)
    }
  }

  succeeded.forEach(b => cart.removeBook(b.id))

  if (succeeded.length > 0) {
    const partialMsg = errors.length > 0
      ? ` (${errors.length} quyển thất bại: ${errors.join('; ')})`
      : ''
    onSuccess(`Đã đăng ký mượn ${succeeded.length} quyển thành công!${partialMsg}`)
  } else {
    feedback.value = { message: `Tất cả yêu cầu thất bại: ${errors.join('; ')}`, ok: false }
  }
}

function onSuccess(msg = null) {
  feedback.value = {
    message: msg || `Đăng ký mượn ${cart.items.length} quyển thành công! Đến quầy thủ thư để nhận sách.`,
    ok: true
  }
  cart.clearCart()
  emit('checkout-success')
}

function confirmClear() {
  clearDialog.value = true
}

function doClear() {
  cart.clearCart()
  clearDialog.value = false
}

defineExpose({ open: () => { drawerOpen.value = true } })
</script>

<style scoped>
.cart-fab-wrapper {
  position: fixed;
  bottom: 32px;
  right: 32px;
  z-index: 2000;
}

.cart-fab-btn {
  box-shadow: 0 8px 24px rgba(37, 99, 235, 0.4) !important;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.cart-fab-btn:hover {
  transform: scale(1.08);
  box-shadow: 0 12px 32px rgba(37, 99, 235, 0.5) !important;
}

.cart-header {
  background: linear-gradient(135deg, #EEF2FF, #F5F3FF);
}

.cart-drawer :deep(.v-navigation-drawer__content) {
  display: flex;
  flex-direction: column;
}

.cart-item {
  background: rgba(248, 250, 252, 0.8);
  border: 1px solid rgba(226, 232, 240, 0.6);
  transition: background 0.2s ease;
}

.cart-item:hover {
  background: rgba(238, 242, 255, 0.9);
}

.empty-cart {
  flex: 1;
  min-height: 300px;
}
</style>
