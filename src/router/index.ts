import { createRouter, createWebHistory } from 'vue-router'
import BlogView from '@/view/BlogView.vue'
import ContentDetailView from '@/view/ContentDetailView.vue'
import DocsView from '@/view/DocsView.vue'
import Homeview from '@/view/Homeview.vue'

const router = createRouter({
  history: createWebHistory('/ClashWinUIWeb'),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Homeview,
    },
    {
      path: '/blog',
      name: 'blog',
      component: BlogView,
    },
    {
      path: '/blog/:slug',
      name: 'blog-detail',
      component: ContentDetailView,
      props: (route) => ({
        collection: 'blog',
        slug: String(route.params.slug ?? ''),
      }),
    },
    {
      path: '/docs',
      name: 'docs',
      component: DocsView,
    },
    {
      path: '/docs/:slug',
      name: 'docs-detail',
      component: ContentDetailView,
      props: (route) => ({
        collection: 'docs',
        slug: String(route.params.slug ?? ''),
      }),
    },
  ],
})

export default router
