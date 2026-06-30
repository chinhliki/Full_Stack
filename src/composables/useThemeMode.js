import { ref } from 'vue'
import { useTheme } from 'vuetify'

const isDark = ref(localStorage.getItem('theme') === 'dark')

export function useThemeMode() {
  const theme = useTheme()

  function applyTheme(dark) {
    isDark.value = dark
    theme.global.name.value = dark ? 'libraryDarkTheme' : 'libraryTheme'

    if (dark) {
      document.body.classList.add('dark-theme')
    } else {
      document.body.classList.remove('dark-theme')
    }

    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }

  function toggleDark() {
    applyTheme(!isDark.value)
  }

  function setDark(value) {
    applyTheme(value)
  }

  function initTheme() {
    applyTheme(isDark.value)
  }

  return { isDark, toggleDark, setDark, initTheme }
}
