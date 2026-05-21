<script setup>
import ContentCard from '@/components/ContentCard.vue'
import Footer from '@/components/Footer.vue'
import Navbar from '@/components/Navbar.vue'
import { docs } from '@/javascript/content.js'
import '@/css/content.css'

const docPath = (doc) => `/docs/${doc.slug}`
</script>

<template>
  <Navbar />

  <main class="content-page" aria-labelledby="docs-title">
    <section class="content-hero">
      <div class="content-shell">
        <p class="content-hero__eyebrow">Docs</p>
        <h1 id="docs-title" class="content-hero__title">
          Documentation for ClashWinUI.
        </h1>
        <p class="content-hero__lead">
          Guides and references for setup, usage, and troubleshooting.
        </p>
      </div>
    </section>

    <section v-if="docs.length" class="content-index" aria-label="Documentation">
      <div class="content-shell">
        <div class="content-card-grid">
          <ContentCard
            v-for="doc in docs"
            :key="doc.slug"
            :item="doc"
            :to="docPath(doc)"
          />
        </div>
      </div>
    </section>

    <section v-else class="content-empty content-shell" aria-label="No documentation">
      <h2>Docs are coming soon</h2>
    </section>
  </main>

  <Footer />
</template>
