<template>
  <div>
    <!-- Header -->
    <div class="action-bar mb-6">
      <v-btn
        variant="tonal"
        color="secondary"
        prepend-icon="mdi-arrow-left"
        @click="router.push('/app/books')"
      >
        Quản lý sách
      </v-btn>

      <div>
        <div class="page-title">Nhập kho sách từ Excel</div>
        <div class="page-subtitle">Thêm hàng loạt đầu sách bằng cách nhập dữ liệu từ file Excel hoặc CSV</div>
      </div>
    </div>

    <v-row>
      <!-- File Selector Panel -->
      <v-col cols="12" md="6">
        <v-card class="table-card pa-6" rounded="xl">
          <h3 class="text-subtitle-1 font-weight-black text-secondary mb-4">
            Chọn tệp dữ liệu nhập
          </h3>

          <!-- Drag and drop zone -->
          <div
            class="drag-drop-zone py-8 px-4 text-center border-dashed rounded-lg cursor-pointer"
            :class="{ 'drag-over': isDragging, 'has-file': file }"
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @drop.prevent="handleFileDrop"
            @click="$refs.fileInput.click()"
          >
            <input
              ref="fileInput"
              type="file"
              accept=".xlsx, .xls, .csv"
              class="d-none"
              @change="handleFileSelect"
            />

            <v-icon
              :icon="file ? 'mdi-file-excel' : 'mdi-cloud-upload-outline'"
              size="48"
              :color="file ? 'success' : 'primary'"
              class="mb-3"
            />

            <div v-if="file">
              <div class="text-body-2 font-weight-bold text-secondary text-truncate px-4">
                {{ file.name }}
              </div>
              <div class="text-caption text-grey mt-1">
                Kích thước: {{ formatSize(file.size) }}
              </div>
            </div>
            <div v-else>
              <div class="text-body-2 font-weight-bold text-secondary">
                Kéo thả file vào đây hoặc bấm để duyệt tệp
              </div>
              <div class="text-caption text-grey mt-1">
                Hỗ trợ định dạng .xlsx, .xls, .csv
              </div>
            </div>
          </div>

          <!-- Template notice -->
          <v-alert
            type="info"
            variant="tonal"
            density="comfortable"
            class="mt-6 text-caption text-grey-darken-3"
            rounded="lg"
          >
            <div class="font-weight-bold mb-1">Cấu trúc cột dữ liệu yêu cầu (Tiếng Việt):</div>
            Dữ liệu tệp cần bao gồm các cột tiêu đề chuẩn xác:
            <strong>ISBN, Tên Sách, Tác Giả, Nhà Xuất Bản, Năm Xuất Bản, Thể Loại, Mô Tả, Ảnh Bìa, Tổng Số Bản, Vị Trí Kệ</strong>.
          </v-alert>

          <!-- Upload action button -->
          <v-btn
            color="primary"
            variant="flat"
            block
            rounded="xl"
            size="large"
            class="mt-6 font-weight-bold"
            prepend-icon="mdi-database-import"
            :disabled="!file"
            :loading="uploading"
            @click="submitImport"
          >
            Bắt đầu nhập sách
          </v-btn>
        </v-card>
      </v-col>

      <!-- Import result details -->
      <v-col cols="12" md="6">
        <v-card class="table-card pa-6 h-full d-flex flex-column" rounded="xl">
          <h3 class="text-subtitle-1 font-weight-black text-secondary mb-4">
            Kết quả nhập kho
          </h3>

          <div v-if="!result && !error" class="d-flex flex-column align-center justify-center py-12 flex-grow-1 text-grey">
            <v-icon icon="mdi-file-document-edit-outline" size="56" color="grey-lighten-1" class="mb-3" />
            <div class="text-body-2">Chưa có kết quả nhập dữ liệu.</div>
            <div class="text-caption">Hãy chọn tệp và bấm Bắt đầu nhập sách.</div>
          </div>

          <v-alert
            v-if="error"
            type="error"
            variant="tonal"
            rounded="lg"
            class="mb-4"
          >
            {{ error }}
          </v-alert>

          <!-- Success Summary -->
          <div v-if="result" class="flex-grow-1">
            <v-row class="mb-4">
              <v-col cols="6">
                <v-card class="pa-4 bg-success-lighten-5 text-center border-success" rounded="xl" variant="outlined">
                  <v-icon icon="mdi-check-circle" color="success" size="24" class="mb-1" />
                  <div class="text-h5 font-weight-black text-success">{{ result.successCount || 0 }}</div>
                  <div class="text-caption font-weight-bold text-grey">SÁCH THÀNH CÔNG</div>
                </v-card>
              </v-col>

              <v-col cols="6">
                <v-card class="pa-4 bg-error-lighten-5 text-center border-error" rounded="xl" variant="outlined">
                  <v-icon icon="mdi-alert-circle" color="error" size="24" class="mb-1" />
                  <div class="text-h5 font-weight-black text-error">{{ result.failedCount || 0 }}</div>
                  <div class="text-caption font-weight-bold text-grey">SÁCH BỊ LỖI</div>
                </v-card>
              </v-col>
            </v-row>

            <v-divider class="my-4" />

            <!-- Error list table -->
            <div v-if="result.errors && result.errors.length">
              <div class="text-caption font-weight-bold text-secondary mb-2 uppercase">DANH SÁCH DÒNG LỖI</div>
              <v-card variant="outlined" rounded="lg" class="overflow-hidden">
                <v-table class="dense-table" style="max-height: 280px; overflow-y: auto;">
                  <thead>
                    <tr class="bg-grey-lighten-4">
                      <th class="font-weight-bold text-left py-2" style="width: 80px;">Dòng</th>
                      <th class="font-weight-bold text-left py-2">Chi tiết lỗi</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="err in result.errors" :key="err.row">
                      <td class="font-weight-bold text-secondary">Dòng {{ err.row }}</td>
                      <td class="text-error text-caption">{{ err.message }}</td>
                    </tr>
                  </tbody>
                </v-table>
              </v-card>
            </div>
            
            <v-alert
              v-else
              type="success"
              variant="tonal"
              rounded="lg"
              class="mt-4 text-caption text-grey-darken-3"
            >
              Chúc mừng! Toàn bộ các dòng dữ liệu trong tệp đã được nhập kho thành công mà không phát sinh bất kỳ lỗi nào.
            </v-alert>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { bookApi } from '../../api/bookApi'

const router = useRouter()

const file = ref(null)
const isDragging = ref(false)
const uploading = ref(false)
const error = ref('')
const result = ref(null)

const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024 // 50MB
const ALLOWED_EXTENSIONS = ['xlsx', 'xls', 'csv']

function validateFile(selectedFile) {
  if (!selectedFile) {
    return 'Vui lòng chọn một tệp tin dữ liệu.'
  }

  const fileName = selectedFile.name || ''
  const ext = fileName.split('.').pop().toLowerCase()
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return `Định dạng tệp không được hỗ trợ (.${ext}). Vui lòng chọn tệp Excel (.xlsx, .xls) hoặc CSV (.csv).`
  }

  if (selectedFile.size > MAX_FILE_SIZE_BYTES) {
    return `Dung lượng tệp tin quá lớn (${formatSize(selectedFile.size)}). Vui lòng chọn tệp có kích thước nhỏ hơn 50MB.`
  }

  return ''
}

function handleFileSelect(e) {
  const selected = e.target.files[0]
  if (selected) {
    const validationError = validateFile(selected)
    if (validationError) {
      error.value = validationError
      file.value = null
      result.value = null
    } else {
      file.value = selected
      error.value = ''
      result.value = null
    }
  }
}

function handleFileDrop(e) {
  isDragging.value = false
  const selected = e.dataTransfer.files[0]
  if (selected) {
    const validationError = validateFile(selected)
    if (validationError) {
      error.value = validationError
      file.value = null
      result.value = null
    } else {
      file.value = selected
      error.value = ''
      result.value = null
    }
  }
}

function formatSize(bytes) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

async function submitImport() {
  const validationError = validateFile(file.value)
  if (validationError) {
    error.value = validationError
    return
  }

  uploading.value = true
  error.value = ''
  result.value = null

  const formData = new FormData()
  formData.append('file', file.value)

  try {
    const res = await bookApi.importExcel(formData)
    result.value = res.data
  } catch (err) {
    error.value = err.response?.data?.message || 'Có lỗi xảy ra trong quá trình kết nối và import sách.'
    console.error(err.response || err)
  } finally {
    uploading.value = false
  }
}
</script>

<style scoped>
.drag-drop-zone {
  border: 2px dashed var(--v-theme-primary);
  background: rgba(var(--v-theme-primary), 0.02);
  transition: all 0.2s ease;
}

.drag-drop-zone:hover,
.drag-over {
  background: rgba(var(--v-theme-primary), 0.06);
  border-color: var(--v-theme-secondary);
}

.has-file {
  border-color: var(--v-theme-success);
  background: rgba(var(--v-theme-success), 0.02);
}

.bg-success-lighten-5 {
  background-color: #f0fdf4 !important;
}

.bg-error-lighten-5 {
  background-color: #fef2f2 !important;
}

.border-success {
  border-color: #bbf7d0 !important;
}

.border-error {
  border-color: #fecaca !important;
}

.dense-table th,
.dense-table td {
  padding: 8px 12px !important;
  font-size: 13px !important;
}
</style>
