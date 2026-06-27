<template>
  <apexchart
    type="donut"
    height="300"
    :options="chartOptions"
    :series="props.data"
  />
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  labels: { type: Array, default: () => [] },
  data: { type: Array, default: () => [] },
  isDark: { type: Boolean, default: false }
})

const COLORS = ['#6366f1', '#14b8a6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#10b981', '#f97316']

const chartOptions = computed(() => ({
  chart: {
    id: 'book-category-donut',
    background: 'transparent',
    toolbar: { show: false },
    animations: { enabled: true, speed: 600 }
  },
  colors: COLORS,
  labels: props.labels,
  legend: {
    position: 'bottom',
    labels: { colors: props.isDark ? '#94a3b8' : '#64748b' },
    fontSize: '12px'
  },
  dataLabels: {
    enabled: true,
    formatter: (val) => `${Math.round(val)}%`,
    style: { fontSize: '11px', fontWeight: 600 },
    dropShadow: { enabled: false }
  },
  plotOptions: {
    pie: {
      donut: {
        size: '62%',
        labels: {
          show: true,
          total: {
            show: true,
            label: 'Tổng',
            color: props.isDark ? '#94a3b8' : '#64748b',
            fontSize: '13px',
            fontWeight: 600,
            formatter: (w) => w.globals.seriesTotals.reduce((a, b) => a + b, 0) + ' lượt'
          }
        }
      }
    }
  },
  stroke: { width: 2, colors: [props.isDark ? '#1e293b' : '#ffffff'] },
  tooltip: {
    theme: props.isDark ? 'dark' : 'light',
    y: { formatter: (v) => `${v} lượt mượn` }
  }
}))
</script>
