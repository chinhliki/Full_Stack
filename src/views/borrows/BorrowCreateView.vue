<template>
  <div>
    <h2 class="mb-4">Tạo phiếu mượn</h2>

    <v-alert
      v-if="message"
      :type="success ? 'success' : 'error'"
      variant="tonal"
      class="mb-4"
    >
      {{ message }}
    </v-alert>

    <v-card class="pa-4">
      <v-row>
        <v-col cols="12" md="6">
          <v-select
            v-model="form.readerId"
            :items="readers"
            item-title="fullName"
            item-value="userId"
            label="Chọn độc giả"
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-select
            v-model="form.bookId"
            :items="availableBooks"
            item-title="title"
            item-value="id"
            label="Chọn sách"
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            v-model="form.borrowDate"
            label="Ngày mượn"
            type="datetime-local"
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            v-model="form.dueDate"
            label="Ngày hẹn trả"
            type="datetime-local"
          />
        </v-col>

        <v-col cols="12">
          <v-btn color="primary" :loading="loading" @click="createBorrow">
            Tạo phiếu mượn
          </v-btn>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { readerApi } from '../../api/readerApi'
import { bookApi } from '../../api/bookApi'
import { borrowApi } from '../../api/borrowApi'

const readers = ref([])
const books = ref([])
const loading = ref(false)
const message = ref('')
const success = ref(false)

const form = ref({
  readerId: '',
  bookId: '',
  borrowDate: '2026-06-16T08:00',
  dueDate: '2026-06-23T08:00'
})

const availableBooks = computed(() =>
  books.value.filter(x => x.isAvailable)
)

async function loadData() {
  const [readerRes, bookRes] = await Promise.all([
    readerApi.getAll(),
    bookApi.getAll()
  ])

  readers.value = readerRes.data
  books.value = bookRes.data
}

async function createBorrow() {
  message.value = ''
  loading.value = true

  try {
    const res = await borrowApi.create({
      readerId: form.value.readerId,
      bookId: form.value.bookId,
      borrowDate: form.value.borrowDate,
      dueDate: form.value.dueDate
    })

    success.value = true
    message.value = res.data.message || 'Tạo phiếu mượn thành công'

    await loadData()
  } catch (err) {
    success.value = false
    message.value = err.response?.data?.message || 'Tạo phiếu mượn thất bại'
  } finally {
    loading.value = false
  }
}

onMounted(loadData)
</script>