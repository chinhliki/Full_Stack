<template>
  <router-view v-slot="{ Component }">
    <transition name="slide-page" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<script setup>
import { onBeforeMount } from 'vue'
import { useTheme } from 'vuetify'

const theme = useTheme()

onBeforeMount(() => {
  const saved = localStorage.getItem('theme')
  const isDark = saved === 'dark'
  document.body.classList.toggle('dark-theme', isDark)
  theme.global.name.value = isDark ? 'libraryDarkTheme' : 'libraryTheme'
})
</script>