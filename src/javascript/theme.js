import { computed, ref } from 'vue'

const THEME_STORAGE_KEY = 'clash-win-ui-theme'
const theme = ref('light')

const getPreferredTheme = () => {
  if (typeof window === 'undefined') {
    return 'light'
  }

  const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)

  if (savedTheme === 'light' || savedTheme === 'dark') {
    return savedTheme
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const applyTheme = (nextTheme) => {
  theme.value = nextTheme

  if (typeof document !== 'undefined') {
    document.documentElement.dataset.theme = nextTheme
  }
}

export const isDarkTheme = computed(() => theme.value === 'dark')

export const initTheme = () => {
  applyTheme(getPreferredTheme())
}

export const toggleTheme = () => {
  const nextTheme = theme.value === 'dark' ? 'light' : 'dark'

  window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme)
  applyTheme(nextTheme)
}
