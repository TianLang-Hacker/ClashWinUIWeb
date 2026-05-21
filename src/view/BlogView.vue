<script setup>
import { computed } from 'vue'
import ContentCard from '@/components/ContentCard.vue'
import Footer from '@/components/Footer.vue'
import Navbar from '@/components/Navbar.vue'
import { blogPosts } from '@/javascript/content.js'
import '@/css/content.css'

const featuredPost = computed(() => blogPosts[0])
const otherPosts = computed(() => blogPosts.slice(1))

const postPath = (post) => `/blog/${post.slug}`
</script>

<template>
  <Navbar />

  <main class="content-page" aria-labelledby="blog-title">
    <section class="content-hero">
      <div class="content-shell">
        <p class="content-hero__eyebrow">Blog</p>
        <h1 id="blog-title" class="content-hero__title">
          Notes, guides, and release stories.
        </h1>
        <p class="content-hero__lead">
          Practical writing for running ClashWinUI and related tools with less friction.
        </p>
      </div>
    </section>

    <section v-if="featuredPost" class="content-index" aria-label="Blog posts">
      <div class="content-shell">
        <ContentCard
          :item="featuredPost"
          :to="postPath(featuredPost)"
          featured
        />

        <div v-if="otherPosts.length" class="content-card-grid">
          <ContentCard
            v-for="post in otherPosts"
            :key="post.slug"
            :item="post"
            :to="postPath(post)"
          />
        </div>
      </div>
    </section>

    <section v-else class="content-empty content-shell" aria-label="No blog posts">
      <h2>No posts yet</h2>
      <p>Fresh writing will appear here soon.</p>
    </section>
  </main>

  <Footer />
</template>
