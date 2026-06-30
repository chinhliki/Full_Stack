<template>
  <v-dialog :model-value="modelValue" max-width="720" @update:model-value="$emit('update:modelValue', $event)">
    <v-card rounded="xl" class="pa-4">
      <div class="import-header d-flex justify-between align-center mb-4">
        <div>
          <h3 class="text-h6 font-weight-black text-secondary">Nhập {{ entityLabel }} từ Excel</h3>
          <p class="text-caption text-grey">Tải lên file CSV hoặc Excel đúng mẫu để nhập hàng loạt</p>
        </div>
        <v-btn icon="mdi-close" variant="text" @click="close" />
      </div>

      <v-divider />

      <!-- Bước 1: Upload -->
      <div v-if="step === 1" class="py-4">
        <div class="template-row d-flex justify-between align-center pa-4 bg-grey-lighten-4 rounded-lg mb-4">
          <div>
            <div class="text-subtitle-2 font-weight-bold">Chưa có file mẫu?</div>
            <div class="text-caption text-grey">
              {{ uploadFn ? 'Mẫu CSV (mở bằng Excel, lưu lại dạng .xlsx rồi tải lên)' : 'Tải mẫu CSV đúng cấu trúc để điền dữ liệu' }}
            </div>
          </div>
          <v-btn variant="outlined" color="primary" rounded="xl" prepend-icon="mdi-download-outline" @click="downloadTemplate">
            Tải mẫu
          </v-btn>
        </div>

        <label class="dropzone d-flex flex-column align-center justify-center pa-8 border-dashed rounded-lg border-2 cursor-pointer" :class="{ 'dropzone-active': dragOver }" @dragover.prevent="dragOver = true" @dragleave.prevent="dragOver = false" @drop.prevent="handleDrop" style="border: 2px dashed #ccc; cursor: pointer;">
          <input type="file" accept=".xlsx,.xls,.csv" class="d-none" @change="handleFileSelect" />
          <v-icon icon="mdi-cloud-upload-outline" size="36" color="primary" class="mb-2" />
          <div class="text-subtitle-2 font-weight-bold">
            Kéo thả tệp tin Excel (.xlsx) hoặc CSV vào đây, hoặc bấm để chọn tệp
          </div>
          <div class="text-caption text-grey">Hỗ trợ định dạng .xlsx, .xls, .csv (mở và lưu được bằng Excel)</div>
        </label>

        <v-alert v-if="parseError" type="error" variant="tonal" rounded="lg" class="mt-3">
          {{ parseError }}
        </v-alert>
      </div>

      <!-- Bước trung gian: đang upload -->
      <div v-else-if="step === 'uploading'" class="text-center py-8">
        <v-progress-circular indeterminate color="primary" size="36" />
        <p class="mt-3 text-medium-emphasis">Đang gửi file lên hệ thống...</p>
      </div>

      <!-- Bước 2: Xem trước -->
      <div v-else-if="step === 2" class="py-4">
        <div class="validation-summary d-flex ga-2 mb-4">
          <v-chip color="success" size="small" variant="flat">
            <v-icon icon="mdi-check-circle" start size="14" /> {{ validRows.length }} dòng hợp lệ
          </v-chip>
          <v-chip v-if="invalidRows.length" color="error" size="small" variant="flat">
            <v-icon icon="mdi-alert-circle" start size="14" /> {{ invalidRows.length }} dòng lỗi
          </v-chip>
        </div>

        <div class="preview-scroll overflow-auto border rounded-lg" style="max-height: 320px;">
          <table class="w-full text-left border-collapse" style="font-size: 13px;">
            <thead>
              <tr class="bg-grey-lighten-4">
                <th class="pa-2" style="width: 36px;"></th>
                <th v-for="col in templateColumns" :key="col.key" class="pa-2">{{ col.label }}</th>
                <th class="pa-2">Lỗi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, idx) in parsedRows" :key="idx" :class="{ 'bg-red-lighten-5': row.__errors.length }" class="border-t">
                <td class="pa-2 text-center">
                  <v-icon v-if="row.__errors.length" icon="mdi-alert-circle" size="16" color="error" />
                  <v-icon v-else icon="mdi-check" size="16" color="success" />
                </td>
                <td v-for="col in templateColumns" :key="col.key" class="pa-2">{{ row[col.key] }}</td>
                <td class="pa-2 text-error text-caption">{{ row.__errors.join('; ') }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Bước 3: Hoàn tất -->
      <div v-else class="py-6 px-4">
        <div class="text-center mb-4">
          <div class="success-icon d-inline-flex align-center justify-center bg-green-lighten-5 rounded-circle mb-3" style="width: 56px; height: 56px; color: green;">
            <v-icon icon="mdi-check" size="30" />
          </div>
          <h4 class="text-h6 font-weight-bold">Hoàn tất quá trình nhập dữ liệu</h4>
          <div class="text-body-2 text-grey mt-1">
            Tổng số dòng xử lý: {{ validRows.length }} | Thành công: <span class="text-success font-weight-bold">{{ importedCount }}</span> | Thất bại: <span class="text-error font-weight-bold">{{ failedCount }}</span>
          </div>
        </div>

        <!-- Bảng lỗi API -->
        <div v-if="failedCount > 0 && importApiErrors.length" class="mt-4">
          <div class="text-caption font-weight-bold text-error mb-2 uppercase">DANH SÁCH DÒNG LỖI HỆ THỐNG</div>
          <v-card variant="outlined" rounded="lg" class="overflow-hidden">
            <v-table class="dense-table" style="max-height: 200px; overflow-y: auto;">
              <thead>
                <tr class="bg-grey-lighten-4">
                  <th class="font-weight-bold text-left py-2" style="width: 80px;">Dòng</th>
                  <th class="font-weight-bold text-left py-2">Chi tiết lỗi</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="err in importApiErrors" :key="err.row">
                  <td class="font-weight-bold text-secondary">Dòng {{ err.row }}</td>
                  <td class="text-error text-caption">{{ err.message }}</td>
                </tr>
              </tbody>
            </v-table>
          </v-card>
        </div>
      </div>

      <v-divider />

      <v-card-actions class="pt-4">
        <v-btn v-if="step === 2" variant="text" rounded="xl" @click="step = 1">Quay lại</v-btn>
        <v-spacer />
        <v-btn v-if="step !== 3" variant="text" rounded="xl" @click="close">Hủy</v-btn>
        <v-btn v-if="step === 2" color="primary" variant="flat" rounded="xl" :loading="importing" :disabled="!validRows.length" @click="confirmImport">
          Xác nhận nhập {{ validRows.length }} {{ entityLabel }}
        </v-btn>
        <v-btn v-if="step === 3" color="primary" variant="flat" rounded="xl" @click="close">Đóng</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import * as XLSX from 'xlsx'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  entityLabel: { type: String, default: 'dữ liệu' },
  templateColumns: { type: Array, required: true },
  createFn: { type: Function, default: null },
  uploadFn: { type: Function, default: null }
})

const emit = defineEmits(['update:modelValue', 'imported'])

const step = ref(1)
const dragOver = ref(false)
const parseError = ref('')
const parsedRows = ref([])
const importing = ref(false)
const importedCount = ref(0)
const failedCount = ref(0)
const importApiErrors = ref([])

const validRows = computed(() => parsedRows.value.filter(r => !r.__errors.length))
const invalidRows = computed(() => parsedRows.value.filter(r => r.__errors.length))

watch(() => props.modelValue, (val) => {
  if (val) {
    step.value = 1
    parseError.value = ''
    parsedRows.value = []
    importedCount.value = 0
    failedCount.value = 0
    importApiErrors.value = []
  }
})

function close() {
  emit('update:modelValue', false)
}

function downloadTemplate() {
  const header = props.templateColumns.map(c => c.label).join(',')
  const blob = new Blob(['\uFEFF' + header + '\n'], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = `mau-nhap-${props.entityLabel}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

function handleDrop(e) {
  dragOver.value = false
  const file = e.dataTransfer.files[0]
  if (file) handleFile(file)
}

function handleFileSelect(e) {
  const file = e.target.files[0]
  if (file) handleFile(file)
}

function handleFile(file) {
  if (props.uploadFn) {
    uploadDirectly(file)
  } else {
    readFile(file)
  }
}

async function uploadDirectly(file) {
  parseError.value = ''

  const validExt = /\.(xlsx|xls)$/i.test(file.name)
  if (!validExt) {
    parseError.value = 'Chỉ hỗ trợ file .xlsx hoặc .xls.'
    return
  }

  step.value = 'uploading'
  importing.value = true

  try {
    const res = await props.uploadFn(file)
    importedCount.value = res.data?.importedCount ?? res.data?.successCount ?? 0
    failedCount.value = res.data?.failedCount ?? res.data?.errorCount ?? 0
    step.value = 3

    emit('imported', { success: importedCount.value, failed: failedCount.value, response: res.data })
  } catch (err) {
    parseError.value = err.response?.data?.message || 'Nhập file thất bại. Vui lòng kiểm tra đúng mẫu cột.'
    step.value = 1
    console.error(err.response || err)
  } finally {
    importing.value = false
  }
}

function readFile(file) {
  parseError.value = ''
  const ext = file.name.split('.').pop().toLowerCase()

  if (ext === 'csv') {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        parseCsv(e.target.result)
        step.value = 2
      } catch (err) {
        parseError.value = 'Không đọc được file CSV. Vui lòng kiểm tra đúng định dạng.'
        console.error(err)
      }
    }
    reader.readAsText(file, 'UTF-8')
  } else if (['xlsx', 'xls'].includes(ext)) {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result)
        const workbook = XLSX.read(data, { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
        
        parseExcelJson(json)
        step.value = 2
      } catch (err) {
        parseError.value = 'Không đọc được file Excel. Vui lòng kiểm tra định dạng.'
        console.error(err)
      }
    }
    reader.readAsArrayBuffer(file)
  } else {
    parseError.value = 'Chỉ hỗ trợ tệp tin Excel (.xlsx, .xls) hoặc CSV (.csv).'
  }
}

function parseExcelJson(rows) {
  if (!rows || rows.length < 2) {
    throw new Error('File không chứa dữ liệu hoặc thiếu tiêu đề.')
  }

  const headers = rows[0].map(h => String(h || '').trim())
  const dataRows = rows.slice(1)

  parsedRows.value = dataRows.map((cells, idx) => {
    const row = { __errors: [] }

    props.templateColumns.forEach(col => {
      const headerIdx = headers.findIndex(h => h.toLowerCase() === col.label.toLowerCase())
      row[col.key] = headerIdx !== -1 ? String(cells[headerIdx] ?? '').trim() : ''
    })

    props.templateColumns.forEach(col => {
      if (col.required && !row[col.key]) {
        row.__errors.push(`Thiếu ${col.label}`)
      }
    })

    return row
  }).filter(r => {
    return props.templateColumns.some(col => r[col.key])
  })
}

function parseCsv(text) {
  const lines = text.split(/\r?\n/).filter(l => l.trim().length)
  if (!lines.length) throw new Error('File trống')

  const headers = lines[0].split(',').map(h => h.replace(/^"|"$/g, '').trim())
  const dataLines = lines.slice(1)

  parsedRows.value = dataLines.map(line => {
    const cells = line.split(',').map(c => c.replace(/^"|"$/g, '').trim())
    const row = { __errors: [] }

    props.templateColumns.forEach(col => {
      const headerIdx = headers.findIndex(h => h.toLowerCase() === col.label.toLowerCase())
      row[col.key] = headerIdx !== -1 ? (cells[headerIdx] || '') : ''
    })

    props.templateColumns.forEach(col => {
      if (col.required && !row[col.key]) {
        row.__errors.push(`Thiếu ${col.label}`)
      }
    })

    return row
  }).filter(r => {
    return props.templateColumns.some(col => r[col.key])
  })
}

async function confirmImport() {
  importing.value = true
  let success = 0
  let failed = 0
  const apiErrors = []

  for (let idx = 0; idx < validRows.value.length; idx++) {
    const row = validRows.value[idx]
    try {
      await props.createFn(row)
      success++
    } catch (err) {
      failed++
      const msg = err.response?.data?.message || 'Không kết nối được API hoặc lỗi đăng ký'
      apiErrors.push({
        row: idx + 2, // Excel row starts from 2 because row 1 is header
        message: `${row.fullName || 'Độc giả'}: ${msg}`
      })
      console.error(err.response || err)
    }
  }

  importedCount.value = success
  failedCount.value = failed
  importApiErrors.value = apiErrors
  importing.value = false
  step.value = 3

  emit('imported', { success, failed })
}
</script>
