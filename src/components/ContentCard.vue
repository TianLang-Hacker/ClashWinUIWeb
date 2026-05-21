<script setup>
import documentIcon from '@fluentui/svg-icons/icons/document_24_regular.svg'

defineProps({
  featured: {
    default: false,
    type: Boolean,
  },
  item: {
    required: true,
    type: Object,
  },
  to: {
    required: true,
    type: String,
  },
})

const placeholderIconStyle = {
  '--content-placeholder-icon': `url("${documentIcon}")`,
}
</script>

<template>
  <RouterLink
    class="content-card"
    :class="{ 'content-card--featured': featured }"
    :to="to"
  >
    <span class="content-card__media" aria-hidden="true">
      <img
        v-if="item.image"
        class="content-card__image"
        :src="item.image"
        :alt="item.title"
        loading="lazy"
      >
      <span
        v-else
        class="content-card__placeholder"
        :style="placeholderIconStyle"
      />
    </span>

    <span class="content-card__body">
      <span class="content-card__meta">
        <time v-if="item.formattedDate" :datetime="item.dateIso">
          {{ item.formattedDate }}
        </time>
        <span v-if="item.categories.length">
          {{ item.categories[0] }}
        </span>
      </span>

      <span class="content-card__title">{{ item.title }}</span>

      <span v-if="item.description" class="content-card__description">
        {{ item.description }}
      </span>

      <span v-if="item.tags.length" class="content-card__tags" aria-label="Tags">
        <span
          v-for="tag in item.tags.slice(0, featured ? 5 : 3)"
          :key="tag"
          class="content-card__tag"
        >
          {{ tag }}
        </span>
      </span>
    </span>
  </RouterLink>
</template>
