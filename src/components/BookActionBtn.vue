<template>
  <div class="d-flex align-center ga-1">
    <!-- CASE 1: Book available — Add to cart or remove from cart -->
    <template v-if="isAvailable">
      <v-tooltip :text="cartBtnTooltip">
        <template #activator="{ props: tip }">
          <v-btn
            v-bind="tip"
            size="small"
            :color="inCart ? 'secondary' : 'primary'"
            :variant="inCart ? 'tonal' : 'tonal'"
            :prepend-icon="inCart ? 'mdi-cart-check' : 'mdi-cart-plus'"
            :disabled="!inCart && !canAdd"
            @click="toggleCart"
          >
            {{ inCart ? 'Trong giỏ' : 'Thêm vào giỏ' }}
          </v-btn>
        </template>
      </v-tooltip>
    </template>

    <!-- CASE 2: Book unavailable — Reserve or already reserved -->
    <template v-else>
      <v-tooltip :text="reserveBtnTooltip">
        <template #activator="{ props: tip }">
          <v-btn
            v-bind="tip"
            size="small"
            :color="reservation ? 'success' : 'warning'"
            variant="tonal"
            :prepend-icon="reservation ? 'mdi-bookmark-check' : 'mdi-bookmark-plus'"
            :disabled="!!reservation"
            :loading="reserving"
            @click="openReserveDialog"
          >
            {{ reservation ? 'Đã đặt chỗ' : 'Đặt chỗ' }}
          </v-btn>
        </template>
      </v-tooltip>

      <!-- Queue position badge if already reserved -->
      <v-chip
        v-if="reservation"
        size="x-small"
        color="success"
        variant="tonal"
      >
        #{{ reservation.position }}
      </v-chip>
    </template>
  </div>

  <!-- Reservation confirm dialog -->
  <v-dialog v-model="reserveDialog" max-width="440">
    <v-card rounded="xl">
      <v-card-title class="d-flex align-center pt-5 px-5">
        <v-icon icon="mdi-bookmark-plus" color="warning" class="mr-2" />
        Đặt giữ chỗ sách
      </v-card-title>

      <v-divider />

      <v-card-text class="pa-5">
        <div class="d-flex align-center ga-3 mb-4">
          <v-avatar size="56" rounded="lg">
            <v-img v-if="props.book.coverImageUrl" :src="props.book.coverImageUrl" cover />
            <v-icon v-else icon="mdi-book-open-page-variant" />
          </v-avatar>
          <div>
            <div class="font-weight-black text-body-1">{{ props.book.title }}</div>
            <div class="text-body-2 text-grey-darken-1">{{ props.book.author }}</div>
            <v-chip size="x-small" color="error" variant="tonal" class="mt-1">
              Đang hết sách
            </v-chip>
          </div>
        </div>

        <v-alert type="info" variant="tonal" rounded="lg" density="compact" class="text-body-2">
          Hệ thống sẽ giữ sách cho bạn khi có người trả. Bạn có <b>48 giờ</b> để đến nhận sau khi được thông báo.
          Hàng chờ theo thứ tự đặt trước (FIFO).
        </v-alert>

        <v-alert
          v-if="reserveError"
          type="error"
          variant="tonal"
          rounded="lg"
          density="compact"
          class="mt-3 text-body-2"
        >
          {{ reserveError }}
        </v-alert>
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn variant="text" @click="reserveDialog = false">Hủy</v-btn>
        <v-btn
          color="warning"
          prepend-icon="mdi-bookmark-check"
          :loading="reserving"
          @click="confirmReserve"
        >
          Xác nhận đặt chỗ
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Success snackbar after reservation -->
  <v-snackbar
    v-model="snackbar.show"
    :color="snackbar.color"
    timeout="4000"
    location="bottom right"
    rounded="lg"
  >
    <v-icon :icon="snackbar.color === 'success' ? 'mdi-check-circle' : 'mdi-alert-circle'" class="mr-2" />
    {{ snackbar.message }}
  </v-snackbar>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useCartStore } from '../stores/cartStore'
import { useAuthStore } from '../stores/authStore'
import { borrowApi } from '../api/borrowApi'

const props = defineProps({
  book: { type: Object, required: true },
  myActiveBorrowCount: { type: Number, default: 0 }
})

const emit = defineEmits(['reserved'])

const cart = useCartStore()
const auth = useAuthStore()

const isAvailable = computed(() => Number(props.book.availableCopies ?? 0) > 0)
const inCart = computed(() => cart.isInCart(props.book.id))
const reservation = computed(() => cart.getReservation(props.book.id))
const canAdd = computed(() => cart.canAdd(props.myActiveBorrowCount))

const cartBtnTooltip = computed(() => {
  if (inCart.value) return 'Đang trong giỏ — nhấn để xóa khỏi giỏ'
  if (!canAdd.value) {
    const total = props.myActiveBorrowCount + cart.count
    return `Đã đủ ${total}/5 quyển (đang mượn + trong giỏ)`
  }
  return 'Thêm sách này vào giỏ mượn'
})

const reserveBtnTooltip = computed(() => {
  if (reservation.value) return `Đã đặt chỗ — vị trí #${reservation.value.position} trong hàng chờ`
  return 'Đặt giữ chỗ — hệ thống sẽ giữ sách khi có người trả'
})

function toggleCart() {
  if (inCart.value) {
    cart.removeBook(props.book.id)
  } else {
    cart.addBook(props.book, props.myActiveBorrowCount)
  }
}

// ---- Reservation ----
const reserveDialog = ref(false)
const reserving = ref(false)
const reserveError = ref('')
const snackbar = ref({ show: false, message: '', color: 'success' })

function openReserveDialog() {
  reserveError.value = ''
  reserveDialog.value = true
}

async function confirmReserve() {
  const readerId = auth.user?.id || auth.user?.userId || auth.user?.readerId || auth.user?.sub
  if (!readerId) {
    reserveError.value = 'Không xác định được tài khoản. Vui lòng đăng nhập lại.'
    return
  }

  reserving.value = true
  reserveError.value = ''
  try {
    const res = await borrowApi.reserve({ readerId, bookId: props.book.id })
    const { reservationId, position, estimatedWaitDays } = res.data

    cart.addReservation({
      bookId: props.book.id,
      reservationId,
      bookTitle: props.book.title,
      position
    })

    reserveDialog.value = false
    snackbar.value = {
      show: true,
      color: 'success',
      message: `Đặt chỗ thành công! Vị trí #${position} trong hàng chờ${estimatedWaitDays ? ` (~${estimatedWaitDays} ngày)` : ''}.`
    }
    emit('reserved', { bookId: props.book.id, position })
  } catch (err) {
    reserveError.value = err.response?.data?.message
      || err.response?.data?.detail
      || 'Đặt chỗ thất bại. Vui lòng thử lại.'
  } finally {
    reserving.value = false
  }
}
</script>
