<script setup>
import Footer from '@/components/Footer.vue'
import Navbar from '@/components/Navbar.vue'
import '@/css/home.css'
import Code from '@fluentui/svg-icons/icons/code_24_regular.svg'
import darkThemeIcon from '@fluentui/svg-icons/icons/dark_theme_24_regular.svg'
import desktopIcon from '@fluentui/svg-icons/icons/desktop_24_regular.svg'
import AnimalCat from '@fluentui/svg-icons/icons/animal_cat_24_regular.svg'
import Settings from '@fluentui/svg-icons/icons/apps_settings_20_regular.svg'
import DotnetIcon from '@/components/DotnetIcon.vue'
import Memory from '@fluentui/svg-icons/icons/memory_16_regular.svg'

const homeTitle = 'ClashWinUI'
const releaseUrl = 'https://github.com/TianLang-Hacker/ClashWinUI/releases/latest'

const heroActions = [
  {
    label: 'Quick Start',
    href: '/docs',
    appearance: 'accent',
  },
  {
    label: 'Download',
    href: releaseUrl,
    appearance: 'outline',
  },
]

const features = [
  {
    title: 'Native Desktop Experience',
    details: 'Enjoy a seamless and highly optimized native Windows desktop experience.',
    icon: desktopIcon,
  },
  {
    title: 'Powered by .NET 10 & WinUI 3',
    details: 'Built with the latest technologies to ensure lightning-fast performance and a modern UI.',
    iconComponent: DotnetIcon,
  },
  {
    title: 'Fluent Design System',
    details: 'A beautifully crafted interface that perfectly aligns with Windows 11 design guidelines.',
    icon: darkThemeIcon,
  },
  {
    title: 'Lightweight & Efficient',
    details: 'Optimized for minimal CPU and memory footprint, keeping your system running smoothly.',
    icon: Memory,
  },
  {
    title: 'Mihomo Kernel',
    details: 'Powered by the robust Mihomo kernel for unparalleled routing performance and stability.',
    icon: Settings,
  },
  {
    title: 'Custom Kernel Support',
    details: 'Total flexibility to define custom kernel paths and switch to your preferred versions.',
    icon: AnimalCat,
  },
  {
    title: 'Accessible Configuration',
    details: 'Configuration files are neatly stored in your User folder for effortless manual adjustments.',
    icon: AnimalCat,
  },
  {
    title: 'Fully Open Source',
    details: 'Transparent and community-driven. Join us on GitHub to help make it even better!',
    icon: Code,
  },
];

const getHomeIconMaskStyle = (iconUrl) => ({
  '--home-icon-url': `url("${iconUrl}")`,
})
</script>

<template>
  <Navbar />

  <main class="home-page" :aria-label="homeTitle">
    <section class="home-hero" aria-labelledby="home-title">
      <div class="home-hero__inner">
        <h1 id="home-title" class="home-hero__title">
          <span>{{ homeTitle }}</span>
          <span></span>
        </h1>

        <p class="home-hero__tagline">
          Welcome to ClashWinUI
        </p>

        <div class="home-actions" aria-label="首页操作">
          <fluent-anchor
            v-for="action in heroActions"
            :key="action.label"
            class="home-actions__link"
            :class="`home-actions__link--${action.appearance}`"
            :appearance="action.appearance"
            :href="action.href"
            :target="action.href.startsWith('http') ? '_blank' : undefined"
            :rel="action.href.startsWith('http') ? 'noreferrer' : undefined"
          >
            {{ action.label }}
          </fluent-anchor>
        </div>
      </div>
    </section>

    <section id="docs" class="home-features" aria-label="首页亮点">
      <div class="home-features__grid">
        <article
          v-for="feature in features"
          :key="feature.title"
          class="home-feature-card"
        >
          <span
            class="home-feature-card__icon"
            :class="{ 'home-feature-card__icon--component': feature.iconComponent }"
            aria-hidden="true"
            :style="feature.icon ? getHomeIconMaskStyle(feature.icon) : undefined"
          >
            <component
              :is="feature.iconComponent"
              v-if="feature.iconComponent"
              class="home-feature-card__component-icon"
            />
          </span>

          <h2 class="home-feature-card__title">{{ feature.title }}</h2>

          <p class="home-feature-card__details">
            {{ feature.details }}
          </p>
        </article>
      </div>
    </section>
  </main>

  <Footer />
</template>
