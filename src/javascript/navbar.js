import { computed, ref } from 'vue'
import darkThemeIcon from '@fluentui/svg-icons/icons/dark_theme_20_regular.svg'
import checkmarkIcon from '@fluentui/svg-icons/icons/checkmark_16_regular.svg'
import chevronDownIcon from '@fluentui/svg-icons/icons/chevron_down_16_regular.svg'
import languageIcon from '@fluentui/svg-icons/icons/local_language_20_regular.svg'
import lightThemeIcon from '@fluentui/svg-icons/icons/weather_sunny_20_regular.svg'
import {
  DEFAULT_LOCALE,
  languageOptions,
  navbarMessages,
} from '@/i18n/navbar.js'

const LOCALE_STORAGE_KEY = 'clash-win-ui-locale'
const supportedLocales = new Set(languageOptions.map((language) => language.locale))

const BASE_URL = import.meta.env.BASE_URL

export const currentLocale = ref(DEFAULT_LOCALE)
export const isLanguageMenuOpen = ref(false)

export const navbarIcons = {
  lightTheme: lightThemeIcon,
  darkTheme: darkThemeIcon,
  language: languageIcon,
  chevronDown: chevronDownIcon,
  checkmark: checkmarkIcon,
}

export { languageOptions }

export const navbarText = computed(() => (
  navbarMessages[currentLocale.value] ?? navbarMessages[DEFAULT_LOCALE]
))

export const navItems = computed(() => [
  {
    label: navbarText.value.blog,
    href: `${BASE_URL}blog`
  },
  {
    label: navbarText.value.docs,
    href: `${BASE_URL}docs`
  },
])

const getSavedLocale = () => {
  if (typeof window === 'undefined') {
    return DEFAULT_LOCALE
  }

  const savedLocale = window.localStorage.getItem(LOCALE_STORAGE_KEY)

  return supportedLocales.has(savedLocale) ? savedLocale : DEFAULT_LOCALE
}

const applyLocale = (locale) => {
  currentLocale.value = locale

  if (typeof document !== 'undefined') {
    document.documentElement.lang = locale
  }
}

export const initLocale = () => {
  applyLocale(getSavedLocale())
}

export const toggleLanguageMenu = () => {
  isLanguageMenuOpen.value = !isLanguageMenuOpen.value
}

export const closeLanguageMenu = () => {
  isLanguageMenuOpen.value = false
}

export const selectLocale = (locale) => {
  if (!supportedLocales.has(locale)) {
    return
  }

  if (typeof window !== 'undefined') {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale)
  }

  applyLocale(locale)
  isLanguageMenuOpen.value = false
}

export const getIconMaskStyle = (iconUrl) => ({
  '--navbar-icon-url': `url("${iconUrl}")`,
})
