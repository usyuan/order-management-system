<script setup lang="ts">
import type { OrderStatus } from '@/types'

interface Props {
  status: OrderStatus
}

const props = defineProps<Props>()

const statusConfig: Record<OrderStatus, { label: string; classes: string }> = {
  pending:   { label: '已下單', classes: 'bg-yellow-100 text-yellow-700 ring-yellow-200' },
  shipping:  { label: '配送中', classes: 'bg-blue-100 text-blue-700 ring-blue-200' },
  completed: { label: '已完成', classes: 'bg-green-100 text-green-700 ring-green-200' },
}

const config = props.status ? statusConfig[props.status] : statusConfig.pending
</script>

<template>
  <span
    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ring-1"
    :class="config.classes"
  >
    <span
      class="w-1.5 h-1.5 rounded-full mr-1.5"
      :class="{
        'bg-yellow-500': status === 'pending',
        'bg-blue-500':   status === 'shipping',
        'bg-green-500':  status === 'completed',
      }"
    />
    {{ config.label }}
  </span>
</template>
