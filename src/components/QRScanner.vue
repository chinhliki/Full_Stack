<template>
  <div class="qr-scanner-wrap">
    <div v-if="!started" class="text-center py-6">
      <v-icon icon="mdi-camera" size="52" color="primary" class="mb-3" />
      <div class="text-body-2 text-grey mb-4">Nhấn nút bên dưới để bật camera quét mã QR</div>
      <v-btn color="primary" prepend-icon="mdi-qrcode-scan" @click="start" :loading="loading">
        Bật camera quét
      </v-btn>
    </div>

    <div v-show="started">
      <div id="qr-reader-box" class="qr-reader-box" />
    </div>

    <v-alert
      v-if="errorMsg"
      type="error"
      variant="tonal"
      rounded="lg"
      class="mt-3"
      density="compact"
    >
      {{ errorMsg }}
    </v-alert>

    <v-alert
      v-if="successMsg"
      type="success"
      variant="tonal"
      rounded="lg"
      class="mt-3"
      density="compact"
    >
      {{ successMsg }}
    </v-alert>

    <div v-if="started" class="d-flex justify-center mt-3">
      <v-btn variant="tonal" color="secondary" prepend-icon="mdi-camera-off" size="small" @click="stop">
        Tắt camera
      </v-btn>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeUnmount } from 'vue'
import { Html5QrcodeScanner, Html5QrcodeScanType } from 'html5-qrcode'

const emit = defineEmits(['scanned'])

const started = ref(false)
const loading = ref(false)
const errorMsg = ref('')
const successMsg = ref('')

let scanner = null

async function start() {
  loading.value = true
  errorMsg.value = ''

  await new Promise(resolve => setTimeout(resolve, 100))

  try {
    scanner = new Html5QrcodeScanner(
      'qr-reader-box',
      {
        fps: 10,
        qrbox: { width: 240, height: 240 },
        supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
        rememberLastUsedCamera: true
      },
      false
    )

    scanner.render(
      (decodedText) => {
        successMsg.value = `Đã quét: ${decodedText}`
        emit('scanned', decodedText)
        stop()
      },
      () => { /* ignore per-frame scan errors */ }
    )

    started.value = true
  } catch (err) {
    errorMsg.value = 'Không thể khởi động camera. Vui lòng kiểm tra quyền truy cập.'
  } finally {
    loading.value = false
  }
}

function stop() {
  if (scanner) {
    scanner.clear().catch(() => {})
    scanner = null
  }
  started.value = false
}

onBeforeUnmount(() => {
  stop()
})
</script>

<style scoped>
.qr-scanner-wrap {
  min-height: 120px;
}

.qr-reader-box {
  border-radius: 12px;
  overflow: hidden;
}

/* Style the html5-qrcode UI buttons */
:deep(#qr-reader-box__scan_region) {
  border-radius: 12px;
  overflow: hidden;
}

:deep(#qr-reader-box__dashboard_section_csr) {
  padding: 10px 0;
}

:deep(#qr-reader-box__dashboard) button {
  background: rgba(99, 102, 241, 0.12);
  border: 1px solid rgba(99, 102, 241, 0.3);
  border-radius: 8px;
  color: #6366f1;
  padding: 6px 14px;
  cursor: pointer;
  font-size: 13px;
}

:deep(#qr-reader-box__dashboard) select {
  border-radius: 8px;
  border: 1px solid rgba(148, 163, 184, 0.4);
  padding: 4px 8px;
}
</style>
