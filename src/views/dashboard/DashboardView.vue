<template>
  <div>
    <h2 class="mb-4">Dashboard thống kê</h2>

    <v-row>
      <v-col cols="12" md="3">
        <v-card class="pa-4">
          <div class="text-subtitle-2">Tổng độc giả</div>
          <div class="text-h4">{{ dashboard.totalReaders }}</div>
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card class="pa-4">
          <div class="text-subtitle-2">Tổng lượt mượn</div>
          <div class="text-h4">{{ dashboard.totalBorrowed }}</div>
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card class="pa-4">
          <div class="text-subtitle-2">Tổng lượt trả</div>
          <div class="text-h4">{{ dashboard.totalReturned }}</div>
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card class="pa-4">
          <div class="text-subtitle-2">Tổng tiền phạt</div>
          <div class="text-h4">{{ dashboard.totalFineAmount }}</div>
        </v-card>
      </v-col>
    </v-row>

    <v-card class="mt-6">
      <v-card-title>Top sách phổ biến</v-card-title>
      <v-table>
        <thead>
          <tr>
            <th>Tên sách</th>
            <th>Số lượt mượn</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="book in dashboard.topBooks" :key="book.bookId">
            <td>{{ book.bookTitle }}</td>
            <td>{{ book.borrowCount }}</td>
          </tr>
        </tbody>
      </v-table>
    </v-card>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { reportApi } from '../../api/reportApi'

const dashboard = ref({
  totalReaders: 0,
  totalBorrowed: 0,
  totalReturned: 0,
  currentlyBorrowing: 0,
  totalFineAmount: 0,
  topBooks: []
})

async function loadDashboard() {
  const res = await reportApi.dashboard()
  dashboard.value = res.data
}

onMounted(loadDashboard)
</script>