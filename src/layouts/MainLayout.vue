<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const navItems = [
  {
    name: '訂單管理',
    path: '/orders',
    icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>`,
  },
  {
    name: '商品管理',
    path: '/products',
    icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>`,
  },
]

const isSidebarOpen = ref(false)

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value
}

const activeTitle = computed(
  () => navItems.find((n) => route.path.startsWith(n.path))?.name ?? '系統'
)
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Mobile overlay -->
    <div v-if="isSidebarOpen" class="fixed inset-0 bg-black/40 z-30 lg:hidden" @click="isSidebarOpen = false"></div>

    <!-- Sidebar -->
    <aside
      :class="[
        'bg-white border-r border-gray-200 flex flex-col fixed inset-y-0 left-0 z-40 shadow-sm w-56 transition-transform duration-200',
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
        'lg:translate-x-0 lg:static lg:z-20'
      ]"
    >
      <!-- Brand -->
      <div class="h-16 flex items-center px-6 border-b border-gray-100">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <p class="text-sm font-bold text-gray-800 leading-tight">OrderFlow</p>
            <p class="text-xs text-gray-400">訂單管理系統</p>
          </div>
        </div>
      </div>

      <!-- Nav -->
      <nav class="flex-1 p-3 space-y-1">
        <p class="px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">主選單</p>
        <RouterLink
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
          :class="
            route.path.startsWith(item.path)
              ? 'bg-blue-50 text-blue-700 shadow-sm'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
          "
        >
          <span v-html="item.icon" />
          {{ item.name }}
        </RouterLink>
      </nav>

      <!-- Footer -->
      <div class="p-4 border-t border-gray-100">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-xs font-bold text-white">
            管
          </div>
          <div>
            <p class="text-sm font-medium text-gray-700">系統管理員</p>
            <p class="text-xs text-gray-400">admin@orderflow.com</p>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col min-h-screen">
      <!-- Top Bar -->
      <header class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-10">
        <div class="flex items-center gap-3">
          <!-- Mobile + Tablet hamburger -->
          <button class="p-2 rounded-md lg:hidden" @click="toggleSidebar" aria-label="Toggle menu">
            <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 class="text-lg font-semibold text-gray-800">{{ activeTitle }}</h1>
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 p-2 md:p-4 lg:p-8">
        <div class="w-full px-2 md:px-4 lg:px-8">
          <RouterView />
        </div>
      </main>
    </div>
  </div>
</template>
