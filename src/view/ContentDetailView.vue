<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch, watchEffect } from 'vue'
import Footer from '@/components/Footer.vue'
import Navbar from '@/components/Navbar.vue'
import { getBlogPost, getDoc } from '@/javascript/content.js'
import '@/css/content.css'

const props = defineProps({
  collection: {
    required: true,
    type: String,
  },
  slug: {
    required: true,
    type: String,
  },
})

const isDocs = computed(() => props.collection === 'docs')
const collectionLabel = computed(() => (isDocs.value ? 'Docs' : 'Blog'))
const collectionPath = computed(() => (isDocs.value ? '/docs' : '/blog'))
const item = computed(() => (
  isDocs.value ? getDoc(props.slug) : getBlogPost(props.slug)
))
const activeHeadingId = ref('')

let headingObserver

const disconnectHeadingObserver = () => {
  headingObserver?.disconnect()
  headingObserver = undefined
}

const setupHeadingObserver = async (currentItem) => {
  disconnectHeadingObserver()
  activeHeadingId.value = currentItem?.toc?.[0]?.id ?? ''

  if (!currentItem?.toc?.length || typeof window === 'undefined') {
    return
  }

  await nextTick()

  const headings = currentItem.toc
    .map((heading) => document.getElementById(heading.id))
    .filter(Boolean)

  if (!headings.length || typeof IntersectionObserver === 'undefined') {
    return
  }

  headingObserver = new IntersectionObserver((entries) => {
    const visibleEntry = entries
      .filter((entry) => entry.isIntersecting)
      .sort((first, second) => (
        first.boundingClientRect.top - second.boundingClientRect.top
      ))[0]

    if (visibleEntry?.target?.id) {
      activeHeadingId.value = visibleEntry.target.id
    }
  }, {
    rootMargin: '-96px 0px -64% 0px',
    threshold: [0, 1],
  })

  headings.forEach((heading) => headingObserver.observe(heading))
}

const scrollToHeading = (headingId) => {
  if (typeof document === 'undefined') {
    return
  }

  const targetHeading = document.getElementById(headingId)

  if (!targetHeading) {
    return
  }

  activeHeadingId.value = headingId
  targetHeading.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  })

  if (typeof window !== 'undefined') {
    window.history.replaceState(null, '', `#${headingId}`)
  }
}

watchEffect(() => {
  if (typeof document === 'undefined') {
    return
  }

  document.title = item.value
    ? `${item.value.title} - ClashWinUI`
    : `${collectionLabel.value} - ClashWinUI`
})

watch(item, setupHeadingObserver, { immediate: true })

onBeforeUnmount(() => {
  disconnectHeadingObserver()
})
</script>

<template>
  <Navbar />

  <main class="content-page content-page--article">
    <article v-if="item" class="content-article content-shell">
      <RouterLink class="content-back-link" :to="collectionPath">
        Back to {{ collectionLabel }}
      </RouterLink>

      <header class="content-article__header">
        <p class="content-article__eyebrow">{{ collectionLabel }}</p>
        <h1 class="content-article__title">{{ item.title }}</h1>
        <p v-if="item.description" class="content-article__lead">
          {{ item.description }}
        </p>

        <div class="content-article__meta">
          <time v-if="item.formattedDate" :datetime="item.dateIso">
            {{ item.formattedDate }}
          </time>
          <span v-for="category in item.categories" :key="category">
            {{ category }}
          </span>
        </div>

        <div v-if="item.tags.length" class="content-article__tags" aria-label="Tags">
          <span
            v-for="tag in item.tags"
            :key="tag"
            class="content-card__tag"
          >
            {{ tag }}
          </span>
        </div>
      </header>

      <img
        v-if="item.image"
        class="content-article__image"
        :src="item.image"
        :alt="item.title"
      >

      <div
        class="content-article__layout"
        :class="{ 'content-article__layout--no-toc': !item.toc.length }"
      >
        <aside
          v-if="item.toc.length"
          class="content-toc"
          aria-label="Table of contents"
        >
          <p class="content-toc__title">目录</p>
          <nav class="content-toc__nav">
            <a
              v-for="heading in item.toc"
              :key="heading.id"
              class="content-toc__link"
              :class="[
                `content-toc__link--depth-${heading.depth}`,
                { 'content-toc__link--active': activeHeadingId === heading.id },
              ]"
              :href="`#${heading.id}`"
              @click.prevent="scrollToHeading(heading.id)"
            >
              {{ heading.title }}
            </a>
          </nav>
        </aside>

        <div class="markdown-body" v-html="item.html" />
      </div>
    </article>

    <section v-else class="content-empty content-shell" aria-label="Content not found">
      <h1>{{ collectionLabel }} item not found</h1>
      <p>The page you opened is not available.</p>
      <RouterLink class="content-empty__link" :to="collectionPath">
        Back to {{ collectionLabel }}
      </RouterLink>
    </section>
  </main>

  <Footer />
</template>
