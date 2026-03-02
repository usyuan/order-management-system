<script setup lang="ts">
import { ref, watch } from 'vue'
import AppModal from '@/components/common/AppModal.vue'
import type { Product, ProductFormData, ProductCategory } from '@/types'

interface Props {
  show: boolean
  editTarget: Product | null
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', data: ProductFormData): void
}>()

const categories: ProductCategory[] = [
  '電子產品', '服飾配件', '居家用品', '食品飲料', '運動休閒',
]

const defaultForm = (): ProductFormData => ({
  name: '',
  category: '電子產品',
  unitPrice: 0,
  stock: 0,
  imageUrl: '',
  description: '',
})

const form = ref<ProductFormData>(defaultForm())

watch(
  () => props.show,
  (val) => {
    if (val) {
      form.value = props.editTarget
        ? {
            name:        props.editTarget.name,
            category:    props.editTarget.category,
            unitPrice:   props.editTarget.unitPrice,
            stock:       props.editTarget.stock,
            imageUrl:    props.editTarget.imageUrl,
            description: props.editTarget.description ?? '',
          }
        : defaultForm()
    }
  }
)

const errors = ref<Partial<Record<keyof ProductFormData, string>>>({})

function validate(): boolean {
  errors.value = {}
  if (!form.value.name.trim())          errors.value.name = '請輸入商品名稱'
  if (form.value.unitPrice <= 0)        errors.value.unitPrice = '單價須大於 0'
  if (form.value.stock < 0)            errors.value.stock = '庫存不可為負數'
  if (!form.value.imageUrl.trim())      errors.value.imageUrl = '請輸入圖片網址'
  return Object.keys(errors.value).length === 0
}

function handleSubmit() {
  if (!validate()) return
  emit('submit', { ...form.value })
}
</script>

<template>
  <AppModal
    :show="show"
    :title="editTarget ? '編輯商品' : '新增商品'"
    max-width="md"
    @close="emit('close')"
  >
    <form class="space-y-4" @submit.prevent="handleSubmit">
      <!-- 商品名稱 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">商品名稱 <span class="text-red-500">*</span></label>
        <input
          v-model="form.name"
          type="text"
          placeholder="例：Apple MacBook Pro"
          class="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          :class="errors.name ? 'border-red-400' : 'border-gray-300'"
        />
        <p v-if="errors.name" class="mt-1 text-xs text-red-500">{{ errors.name }}</p>
      </div>

      <!-- 分類 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">分類 <span class="text-red-500">*</span></label>
        <select
          v-model="form.category"
          class="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
        >
          <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
        </select>
      </div>

      <!-- 單價 / 庫存 -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">單價 (TWD) <span class="text-red-500">*</span></label>
          <input
            v-model.number="form.unitPrice"
            type="number"
            min="1"
            class="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            :class="errors.unitPrice ? 'border-red-400' : 'border-gray-300'"
          />
          <p v-if="errors.unitPrice" class="mt-1 text-xs text-red-500">{{ errors.unitPrice }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">庫存量 <span class="text-red-500">*</span></label>
          <input
            v-model.number="form.stock"
            type="number"
            min="0"
            class="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            :class="errors.stock ? 'border-red-400' : 'border-gray-300'"
          />
          <p v-if="errors.stock" class="mt-1 text-xs text-red-500">{{ errors.stock }}</p>
        </div>
      </div>

      <!-- 圖片網址 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">圖片網址 <span class="text-red-500">*</span></label>
        <input
          v-model="form.imageUrl"
          type="text"
          placeholder="https://..."
          class="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          :class="errors.imageUrl ? 'border-red-400' : 'border-gray-300'"
        />
        <p v-if="errors.imageUrl" class="mt-1 text-xs text-red-500">{{ errors.imageUrl }}</p>
      </div>

      <!-- 描述 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">商品描述</label>
        <textarea
          v-model="form.description"
          rows="3"
          placeholder="簡短描述商品特色..."
          class="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
        />
      </div>

      <!-- 圖片預覽 -->
      <div v-if="form.imageUrl" class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
        <img
          :src="form.imageUrl"
          alt="預覽"
          class="w-14 h-14 object-cover rounded-lg border border-gray-200"
          @error="(e) => ((e.target as HTMLImageElement).src = 'https://placehold.co/56x56/ccc/white?text=?')"
        />
        <p class="text-xs text-gray-500">圖片預覽</p>
      </div>
    </form>

    <template #footer>
      <button
        class="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
        @click="emit('close')"
      >
        取消
      </button>
      <button
        class="px-5 py-2 text-sm rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
        @click="handleSubmit"
      >
        {{ editTarget ? '儲存變更' : '新增商品' }}
      </button>
    </template>
  </AppModal>
</template>
