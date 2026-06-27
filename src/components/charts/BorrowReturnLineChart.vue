<template>
  <apexchart
    type="area"
    height="300"
    :options="chartOptions"
    :series="series"
  />
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  labels: { type: Array, default: () => [] },
  borrowData: { type: Array, default: () => [] },
  returnData: { type: Array, default: () => [] },
  isDark: { type: Boolean, default: false }
})

const textColor = computed(() => props.isDark ? '#94a3b8' : '#64748b')
const gridColor = computed(() => props.isDark ? 'rgba(148,163,184,0.1)' : 'rgba(226,232,240,0.6)')

const series = computed(() => [
  { name: 'Lượt mượn', data: props.borrowData },
  { name: 'Lượt trả', data: props.returnData }
])

const chartOptions = computed(() => ({
  chart: {
    id: 'borrow-return-line',
    background: 'transparent',
    toolbar: { show: false },
    zoom: { enabled: false },
    animations: { enabled: true, speed: 600 }
  },
  colors: ['#6366f1', '#14b8a6'],
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.35,
      opacityTo: 0.02,
      stops: [0, 95, 100]
    }
  },
  stroke: { curve: 'smooth', width: 2.5 },
  dataLabels: { enabled: false },
  xaxis: {
    categories: props.labels,
    labels: { style: { colors: textColor.value, fontSize: '12px' } },
    axisBorder: { show: false },
    axisTicks: { show: false }
  },
  yaxis: {
    labels: {
      style: { colors: textColor.value, fontSize: '12px' },
      formatter: (v) => Math.round(v)
    }
  },
  grid: {
    borderColor: gridColor.value,
    strokeDashArray: 4
  },
  legend: {
    labels: { colors: textColor.value },
    position: 'top',
    horizontalAlign: 'right'
  },
  tooltip: {
    theme: props.isDark ? 'dark' : 'light',
    y: { formatter: (v) => `${v} lượt` }
  },
  markers: { size: 3, hover: { size: 5 } }
}))
</script>
