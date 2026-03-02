import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Order, OrderStatus } from '@/types'
import { mockOrders } from '@/data/mockData'

export const useOrderStore = defineStore('order', () => {
  const orders = ref<Order[]>([...mockOrders])
  const searchQuery = ref('')
  const statusFilter = ref<OrderStatus | 'all'>('all')

  const filteredOrders = computed(() => {
    return orders.value.filter((order) => {
      const matchesSearch = order.id
        .toLowerCase()
        .includes(searchQuery.value.toLowerCase())
      const matchesStatus =
        statusFilter.value === 'all' || order.status === statusFilter.value
      return matchesSearch && matchesStatus
    })
  })

  const totalRevenue = computed(() =>
    orders.value.reduce((sum, o) => sum + o.totalAmount, 0)
  )

  const countByStatus = computed(() => ({
    pending:   orders.value.filter((o) => o.status === 'pending').length,
    shipping:  orders.value.filter((o) => o.status === 'shipping').length,
    completed: orders.value.filter((o) => o.status === 'completed').length,
  }))

  function getOrderById(id: string): Order | undefined {
    return orders.value.find((o) => o.id === id)
  }

  function updateOrderStatus(id: string, status: OrderStatus) {
    const order = orders.value.find((o) => o.id === id)
    if (order) order.status = status
  }

  return {
    orders,
    searchQuery,
    statusFilter,
    filteredOrders,
    totalRevenue,
    countByStatus,
    getOrderById,
    updateOrderStatus,
  }
})
