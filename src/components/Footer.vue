<script setup>
import '@/css/footer.css'
import { footerBrand, footerSections } from '@/javascript/footer.js'
</script>

<template>
  <footer class="app-footer">
    <fluent-divider class="app-footer__divider" />

    <div class="app-footer__content">
      <aside class="app-footer__brand" aria-label="Company information">
        <!-- <svg></svg> -->

        <p class="app-footer__brand-copy">
          <strong>{{ footerBrand.name }}</strong>
          <span>{{ footerBrand.description }}</span>
        </p>
      </aside>

      <nav
        v-for="section in footerSections"
        :key="section.title"
        class="app-footer__section"
        :aria-label="section.title"
      >
        <h2 class="app-footer__title">{{ section.title }}</h2>

        <fluent-anchor
          v-for="link in section.links"
          :key="link.label"
          class="app-footer__link"
          :href="link.href"
          target="_blank"
          rel="noopener noreferrer"
          appearance="hypertext"
        >
          {{ link.label }}
        </fluent-anchor>
      </nav>
    </div>
  </footer>
</template>
