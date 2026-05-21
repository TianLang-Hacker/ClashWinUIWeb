<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import '@/css/navbar.css'
import { isDarkTheme, initTheme, toggleTheme } from '@/javascript/theme.js'
import {
  closeLanguageMenu,
  getIconMaskStyle,
  initLocale,
  isLanguageMenuOpen,
  languageOptions,
  navbarIcons,
  navbarText,
  navItems,
  selectLocale,
  toggleLanguageMenu,
  currentLocale,
} from '@/javascript/navbar.js'

initTheme()
initLocale()

const themeIcon = computed(() =>
  isDarkTheme.value ? navbarIcons.darkTheme : navbarIcons.lightTheme,
)
const languageMenu = ref(null)

const handleOutsidePointerDown = (event) => {
  if (!isLanguageMenuOpen.value) {
    return
  }

  if (languageMenu.value?.contains(event.target)) {
    return
  }

  closeLanguageMenu()
}

onMounted(() => {
  window.addEventListener('pointerdown', handleOutsidePointerDown)
})

onBeforeUnmount(() => {
  window.removeEventListener('pointerdown', handleOutsidePointerDown)
})
</script>

<template>
  <header class="app-navbar">
    <nav class="app-navbar__inner" aria-label="Primary">
      <a class="app-navbar__brand" href="/ClashWinUIWeb/">ClashWinUI</a>

      <div class="app-navbar__actions">
        <fluent-anchor
          v-for="item in navItems"
          :key="item.label"
          class="app-navbar__link"
          :href="item.href"
        >
          {{ item.label }}
        </fluent-anchor>

        <!-- <div ref="languageMenu" class="app-navbar__language">
          <button
            class="app-navbar__language-trigger"
            type="button"
            :aria-expanded="isLanguageMenuOpen"
            aria-haspopup="menu"
            @click="toggleLanguageMenu"
          >
            <span
              class="app-navbar__icon"
              aria-hidden="true"
              :style="getIconMaskStyle(navbarIcons.language)"
            />
            <span>{{ navbarText.languages }}</span>
            <span
              class="app-navbar__icon app-navbar__icon--small"
              aria-hidden="true"
              :style="getIconMaskStyle(navbarIcons.chevronDown)"
            />
          </button>

          <div v-if="isLanguageMenuOpen" class="app-navbar__language-menu" role="menu">
            <button
              v-for="language in languageOptions"
              :key="language.locale"
              class="app-navbar__language-option"
              :class="{ 'app-navbar__language-option--active': currentLocale === language.locale }"
              type="button"
              role="menuitemradio"
              :aria-checked="currentLocale === language.locale"
              @click="selectLocale(language.locale)"
            >
              <span
                class="app-navbar__language-check"
                aria-hidden="true"
                :style="getIconMaskStyle(navbarIcons.checkmark)"
              />
              <span>{{ language.label }}</span>
            </button>
          </div>
        </div> -->

        <button
          class="app-navbar__theme-toggle app-navbar__icon-button"
          type="button"
          :aria-pressed="isDarkTheme"
          aria-label="切换浅色和深色主题"
          @click="toggleTheme"
        >
          <span
            class="app-navbar__icon"
            aria-hidden="true"
            :style="getIconMaskStyle(themeIcon)"
          />
        </button>
      </div>
    </nav>
  </header>
</template>
