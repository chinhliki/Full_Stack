<template>
  <apexchart
    type="bar"
    height="300"
    :options="chartOptions"
    :series="series"
  />
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  labels: { type: Array, default: () => [] },
  data: { type: Array, default: () => [] },
  isDark: { type: Boolean, default: false }
})

const textColor = computed(() => props.isDark ? '#94a3b8' : '#64748b')
const gridColor = computed(() => props.isDark ? 'rgba(148,163,184,0.1)' : 'rgba(226,232,240,0.6)')

const series = computed(() => [
  { name: 'Tiền phạt', data: props.data }
])

const chartOptions = computed(() => ({
  chart: {
    id: 'fine-revenue-bar',
    background: 'transparent',
    toolbar: { show: false },
    animations: { enabled: true, speed: 600 }
  },
  colors: ['#f59e0b'],
  fill: {
    type: 'gradient',
    gradient: {
      shade: 'light',
      type: 'vertical',
      shadeIntensity: 0.3,
      gradientToColors: ['#ef4444'],
      stops: [0, 100]
    }
  },
  plotOptions: {
    bar: {
      borderRadius: 6,
      columnWidth: '55%',
      distributed: false
    }
  },
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
      formatter: (v) => {
        if (v >= 1000000) return (v / 1000000).toFixed(1) + 'M'
        if (v >= 1000) return (v / 1000).toFixed(0) + 'K'
        return v
      }
    }
  },
  grid: {
    borderColor: gridColor.value,
    strokeDashArray: 4
  },
  legend: { show: false },
  tooltip: {
    theme: props.isDark ? 'dark' : 'light',
    y: {
      formatter: (v) => new Intl.NumberFormat('vi-VN').format(v) + ' đ'
    }
  }
}))
</script>
