<script setup lang="ts">
import { ref } from 'vue'
import { useProductStore } from '@/stores/productStore'
import ProductFormModal from '@/components/products/ProductFormModal.vue'
import type { Product, ProductFormData, ProductCategory } from '@/types'

const store = useProductStore()

const showModal = ref(false)
const editTarget = ref<Product | null>(null)
const deleteConfirmId = ref<string | null>(null)

function openCreate() {
  editTarget.value = null
  showModal.value = true
}

function openEdit(product: Product) {
  editTarget.value = product
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  editTarget.value = null
}

function handleSubmit(data: ProductFormData) {
  if (editTarget.value) {
    store.updateProduct(editTarget.value.id, data)
  } else {
    store.addProduct(data)
  }
  closeModal()
}

function confirmDelete(id: string) {
  deleteConfirmId.value = id
}

function executeDelete() {
  if (deleteConfirmId.value) {
    store.deleteProduct(deleteConfirmId.value)
    deleteConfirmId.value = null
  }
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency: 'TWD',
    minimumFractionDigits: 0,
  }).format(amount)
}

const categories: ProductCategory[] = [
  '電子產品', '服飾配件', '居家用品', '食品飲料', '運動休閒',
]

const categoryColorMap: Record<string, string> = {
  '電子產品': 'bg-blue-100 text-blue-700',
  '服飾配件': 'bg-pink-100 text-pink-700',
  '居家用品': 'bg-amber-100 text-amber-700',
  '食品飲料': 'bg-green-100 text-green-700',
  '運動休閒': 'bg-purple-100 text-purple-700',
}
</script>

<template>
  <div class="space-y-6">
    <!-- 統計卡片 -->
    <div class="grid grid-cols-3 gap-4">
      <div class="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
        <p class="text-xs text-gray-500 mb-1">商品總數</p>
        <p class="text-2xl font-bold text-blue-700">{{ store.products.length }}</p>
      </div>
      <div class="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
        <p class="text-xs text-gray-500 mb-1">總庫存量</p>
        <p class="text-2xl font-bold text-indigo-700">{{ store.totalStock.toLocaleString() }}</p>
      </div>
      <div class="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
        <p class="text-xs text-gray-500 mb-1">低庫存商品 (≤30)</p>
        <p class="text-2xl font-bold text-red-500">{{ store.lowStockProducts.length }}</p>
      </div>
    </div>

    <!-- 工具列 -->
    <div class="bg-white rounded-2xl border border-gray-200 shadow-sm">
      <div class="p-5 border-b border-gray-100 flex items-center justify-between gap-4 flex-wrap">
        <h2 class="text-base font-semibold text-gray-800">商品列表</h2>
        <div class="flex gap-3">
          <!-- 搜尋 -->
          <div class="relative">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              v-model="store.searchQuery"
              type="text"
              placeholder="搜尋商品名稱..."
              class="pl-9 pr-4 py-2 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 w-48"
            />
          </div>
          <!-- 分類篩選 -->
          <select
            v-model="store.categoryFilter"
            class="px-3 py-2 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-700"
          >
            <option value="all">全部分類</option>
            <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
          </select>
          <!-- 新增按鈕 -->
          <button
            class="flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
            @click="openCreate"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            新增商品
          </button>
        </div>
      </div>

      <!-- 商品表格 -->
      <div class="overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead class="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th class="px-5 py-3 text-left font-semibold">商品</th>
              <th class="px-5 py-3 text-left font-semibold">分類</th>
              <th class="px-5 py-3 text-right font-semibold">單價</th>
              <th class="px-5 py-3 text-right font-semibold">庫存量</th>
              <th class="px-5 py-3 text-left font-semibold">建立日期</th>
              <th class="px-5 py-3 text-center font-semibold">操作</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="product in store.filteredProducts"
              :key="product.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <!-- 商品名稱 + 圖片 -->
              <td class="px-5 py-3.5">
                <div class="flex items-center gap-3">
                  <img
                    :src="product.imageUrl"
                    :alt="product.name"
                    class="w-10 h-10 rounded-lg object-cover border border-gray-100 flex-shrink-0"
                    @error="(e) => ((e.target as HTMLImageElement).src = 'https://placehold.co/40x40/ccc/white?text=?')"
                  />
                  <div>
                    <p class="font-medium text-gray-800">{{ product.name }}</p>
                    <p class="text-xs text-gray-400 font-mono">{{ product.id }}</p>
                  </div>
                </div>
              </td>
              <!-- 分類 -->
              <td class="px-5 py-3.5">
                <span
                  class="px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="categoryColorMap[product.category] ?? 'bg-gray-100 text-gray-600'"
                >
                  {{ product.category }}
                </span>
              </td>
              <!-- 單價 -->
              <td class="px-5 py-3.5 text-right font-semibold text-gray-800">
                {{ formatCurrency(product.unitPrice) }}
              </td>
              <!-- 庫存 -->
              <td class="px-5 py-3.5 text-right">
                <span
                  class="font-semibold"
                  :class="product.stock <= 30 ? 'text-red-500' : 'text-gray-700'"
                >
                  {{ product.stock }}
                </span>
                <span v-if="product.stock <= 30" class="ml-1 text-xs text-red-400">低庫存</span>
              </td>
              <!-- 建立日期 -->
              <td class="px-5 py-3.5 text-gray-500">{{ product.createdAt }}</td>
              <!-- 操作 -->
              <td class="px-5 py-3.5 text-center">
                <div class="flex items-center justify-center gap-2">
                  <button
                    class="px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                    @click="openEdit(product)"
                  >
                    編輯
                  </button>
                  <button
                    class="px-3 py-1.5 text-xs font-medium text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                    @click="confirmDelete(product.id)"
                  >
                    刪除
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="store.filteredProducts.length === 0">
              <td colspan="6" class="px-5 py-10 text-center text-gray-400 text-sm">
                查無符合條件的商品
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="px-5 py-3 border-t border-gray-100 text-xs text-gray-400">
        共 {{ store.filteredProducts.length }} 項商品
      </div>
    </div>

    <!-- 新增 / 編輯 Modal -->
    <ProductFormModal
      :show="showModal"
      :edit-target="editTarget"
      @close="closeModal"
      @submit="handleSubmit"
    />

    <!-- 刪除確認 Modal -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div
          v-if="deleteConfirmId"
          class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        >
          <div class="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center">
            <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-800 mb-1">確認刪除？</h3>
            <p class="text-sm text-gray-500 mb-5">此操作無法復原，商品資料將被永久刪除。</p>
            <div class="flex gap-3">
              <button
                class="flex-1 py-2.5 text-sm rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
                @click="deleteConfirmId = null"
              >
                取消
              </button>
              <button
                class="flex-1 py-2.5 text-sm rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition-colors"
                @click="executeDelete"
              >
                確認刪除
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active { transition: opacity 0.2s ease; }
.modal-fade-enter-from,
.modal-fade-leave-to     { opacity: 0; }
</style>
