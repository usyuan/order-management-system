<script setup lang="ts">
import AppModal from '@/components/common/AppModal.vue'
import AppBadge from '@/components/common/AppBadge.vue'
import type { Order } from '@/types'

interface Props {
  show: boolean
  order: Order | null
}

defineProps<Props>()
const emit = defineEmits<{ (e: 'close'): void }>()

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency: 'TWD',
    minimumFractionDigits: 0,
  }).format(amount)
}
</script>

<template>
  <AppModal
    :show="show"
    :title="`訂單詳情 — ${order?.id ?? ''}`"
    max-width="lg"
    @close="emit('close')"
  >
    <div v-if="order" class="space-y-5">
      <!-- 基本資訊 -->
      <div class="grid grid-cols-2 gap-4">
        <div class="col-span-2 flex items-center gap-3">
          <span class="text-sm text-gray-500">訂單狀態</span>
          <AppBadge :status="order.status" />
        </div>
        <InfoRow label="客戶姓名" :value="order.customerName" />
        <InfoRow label="聯絡電話" :value="order.customerPhone" />
        <InfoRow label="電子郵件" :value="order.customerEmail" />
        <InfoRow label="下單日期" :value="order.createdAt" />
        <div class="col-span-2">
          <InfoRow label="寄送地址" :value="order.shippingAddress" />
        </div>
        <div v-if="order.note" class="col-span-2">
          <InfoRow label="備註" :value="order.note" />
        </div>
      </div>

      <!-- 訂購商品 -->
      <div>
        <h3 class="text-sm font-semibold text-gray-700 mb-2">訂購商品</h3>
        <div class="rounded-xl border border-gray-200 overflow-hidden">
          <table class="min-w-full text-sm">
            <thead class="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th class="px-4 py-2.5 text-left">商品名稱</th>
                <th class="px-4 py-2.5 text-right">單價</th>
                <th class="px-4 py-2.5 text-right">數量</th>
                <th class="px-4 py-2.5 text-right">小計</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="item in order.items" :key="item.productId" class="hover:bg-gray-50">
                <td class="px-4 py-3 text-gray-800">{{ item.productName }}</td>
                <td class="px-4 py-3 text-right text-gray-600">{{ formatCurrency(item.unitPrice) }}</td>
                <td class="px-4 py-3 text-right text-gray-600">{{ item.quantity }}</td>
                <td class="px-4 py-3 text-right font-medium text-gray-800">{{ formatCurrency(item.subtotal) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 合計 -->
      <div class="flex justify-end pt-1">
        <div class="text-right">
          <p class="text-sm text-gray-500">訂單總金額</p>
          <p class="text-2xl font-bold text-blue-600">{{ formatCurrency(order.totalAmount) }}</p>
        </div>
      </div>
    </div>
  </AppModal>
</template>

<!-- 簡化用的區域元件 -->
<script lang="ts">
import { defineComponent, h } from 'vue'

const InfoRow = defineComponent({
  props: {
    label: String,
    value: String,
  },
  setup(props) {
    return () =>
      h('div', [
        h('p', { class: 'text-xs text-gray-400 mb-0.5' }, props.label),
        h('p', { class: 'text-sm text-gray-700 font-medium' }, props.value || '—'),
      ])
  },
})

export default { components: { InfoRow } }
</script>
