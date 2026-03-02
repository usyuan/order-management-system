import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/orders',
    },
    {
      path: '/orders',
      name: 'orders',
      component: () => import('@/views/OrderManagement.vue'),
      meta: { title: '訂單管理' },
    },
    {
      path: '/products',
      name: 'products',
      component: () => import('@/views/ProductManagement.vue'),
      meta: { title: '商品管理' },
    },
  ],
})

router.afterEach((to) => {
  document.title = `${to.meta.title as string} | 訂單管理系統`
})

export default router
