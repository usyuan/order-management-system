<script setup lang="ts">
import { ref } from 'vue'
import { useOrderStore } from '@/stores/orderStore'
import AppBadge from '@/components/common/AppBadge.vue'
import OrderDetailModal from '@/components/orders/OrderDetailModal.vue'
import type { Order, OrderStatus } from '@/types'

const store = useOrderStore()

const selectedOrder = ref<Order | null>(null)
const showModal = ref(false)

function openDetail(order: Order) {
  selectedOrder.value = order
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  selectedOrder.value = null
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency: 'TWD',
    minimumFractionDigits: 0,
  }).format(amount)
}

const statusOptions: { label: string; value: OrderStatus | 'all' }[] = [
  { label: '全部狀態', value: 'all' },
  { label: '已下單',   value: 'pending' },
  { label: '配送中',   value: 'shipping' },
  { label: '已完成',   value: 'completed' },
]
</script>

<template>
  <div class="space-y-6">
    <!-- 統計卡片 -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <StatCard
        label="總訂單數"
        :value="String(store.orders.length)"
        color="blue"
        icon='<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>'
      />
      <StatCard
        label="已下單"
        :value="String(store.countByStatus.pending)"
        color="yellow"
        icon='<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>'
      />
      <StatCard
        label="配送中"
        :value="String(store.countByStatus.shipping)"
        color="indigo"
        icon='<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/></svg>'
      />
      <StatCard
        label="總營收"
        :value="formatCurrency(store.totalRevenue)"
        color="green"
        icon='<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>'
      />
    </div>

    <!-- 工具列 -->
    <div class="bg-white rounded-2xl border border-gray-200 shadow-sm">
      <div class="p-5 border-b border-gray-100 flex items-center justify-between gap-4 flex-col sm:flex-row">
        <h2 class="text-base font-semibold text-gray-800">訂單列表</h2>
        <div class="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <!-- 搜尋 -->
          <div class="relative flex-1 min-w-0">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              v-model="store.searchQuery"
              type="text"
              placeholder="搜尋訂單編號..."
              class="pl-9 pr-4 py-2 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
            />
          </div>
          <!-- 狀態篩選 -->
          <select
            v-model="store.statusFilter"
            class="px-3 py-2 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-700 flex-shrink-0 whitespace-nowrap"
          >
            <option v-for="opt in statusOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>
        </div>
      </div>

      <!-- 手機版：卡片列表（可替代表格） -->
      <div class="space-y-4 sm:hidden p-2">
        <div v-for="order in store.filteredOrders" :key="order.id" class="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <p class="text-xs text-gray-400 mb-1">訂單編號</p>
              <p class="font-mono text-sm font-medium text-blue-600 truncate">{{ order.id }}</p>
              <p class="mt-2 text-sm text-gray-700 truncate">{{ order.customerName }}</p>
            </div>
            <div class="text-right flex-shrink-0">
              <p class="text-xs text-gray-400">總金額</p>
              <p class="text-sm font-semibold text-gray-800">{{ formatCurrency(order.totalAmount) }}</p>
            </div>
          </div>
          <div class="mt-3 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <AppBadge :status="order.status" />
              <p class="text-xs text-gray-500">{{ order.createdAt }}</p>
            </div>
            <button class="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors" @click="openDetail(order)">查看詳情</button>
          </div>
        </div>
      </div>

      <!-- 平板/桌機：表格 -->
      <div class="overflow-x-auto hidden sm:block">
        <table class="min-w-full text-sm">
          <thead class="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th class="px-5 py-3 text-left font-semibold">訂單編號</th>
              <th class="px-5 py-3 text-left font-semibold hidden sm:table-cell">客戶名稱</th>
              <th class="px-5 py-3 text-right font-semibold">總金額</th>
              <th class="px-5 py-3 text-center font-semibold">訂單狀態</th>
              <th class="px-5 py-3 text-left font-semibold hidden md:table-cell">下單日期</th>
              <th class="px-5 py-3 text-center font-semibold">操作</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="order in store.filteredOrders" :key="order.id" class="hover:bg-blue-50/30 transition-colors">
              <td class="px-5 py-3.5 font-mono text-blue-600 font-medium whitespace-nowrap">{{ order.id }}</td>
              <td class="px-5 py-3.5 text-gray-800 hidden sm:table-cell">{{ order.customerName }}</td>
              <td class="px-5 py-3.5 text-right font-semibold text-gray-800 whitespace-nowrap">{{ formatCurrency(order.totalAmount) }}</td>
              <td class="px-5 py-3.5 text-center"><AppBadge :status="order.status" /></td>
              <td class="px-5 py-3.5 text-gray-500 hidden md:table-cell">{{ order.createdAt }}</td>
              <td class="px-5 py-3.5 text-center whitespace-nowrap">
                <button class="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors" @click="openDetail(order)">查看詳情</button>
              </td>
            </tr>
            <tr v-if="store.filteredOrders.length === 0">
              <td colspan="6" class="px-5 py-10 text-center text-gray-400 text-sm">
                查無符合條件的訂單
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 分頁提示 -->
      <div class="px-5 py-3 border-t border-gray-100 text-xs text-gray-400">
        共 {{ store.filteredOrders.length }} 筆訂單
      </div>
    </div>

    <!-- 訂單詳情 Modal -->
    <OrderDetailModal
      :show="showModal"
      :order="selectedOrder"
      @close="closeModal"
    />
  </div>
</template>

<!-- 頁面內用的統計卡片 -->
<script lang="ts">
import { defineComponent, h } from 'vue'

const colorMap: Record<string, { bg: string; icon: string; text: string }> = {
  blue:   { bg: 'bg-blue-50',   icon: 'text-blue-500',   text: 'text-blue-700' },
  yellow: { bg: 'bg-yellow-50', icon: 'text-yellow-500', text: 'text-yellow-700' },
  indigo: { bg: 'bg-indigo-50', icon: 'text-indigo-500', text: 'text-indigo-700' },
  green:  { bg: 'bg-green-50',  icon: 'text-green-500',  text: 'text-green-700' },
}

const StatCard = defineComponent({
  props: {
    label: String,
    value: String,
    color: { type: String, default: 'blue' },
    icon: String,
  },
  setup(props) {
    return () => {
      const c = colorMap[props.color ?? 'blue']
      return h('div', { class: 'bg-white rounded-2xl border border-gray-200 p-5 shadow-sm flex items-center gap-4' }, [
        h('div', { class: `w-11 h-11 rounded-xl ${c.bg} ${c.icon} flex items-center justify-center flex-shrink-0`, innerHTML: props.icon }),
        h('div', [
          h('p', { class: 'text-xs text-gray-500 mb-0.5' }, props.label),
          h('p', { class: `text-xl font-bold ${c.text}` }, props.value),
        ]),
      ])
    }
  },
})

export default { components: { StatCard } }
</script>
