import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Product, ProductFormData } from '@/types'
import { mockProducts } from '@/data/mockData'

export const useProductStore = defineStore('product', () => {
  const products = ref<Product[]>([...mockProducts])
  const searchQuery = ref('')
  const categoryFilter = ref<string>('all')

  const filteredProducts = computed(() => {
    return products.value.filter((p) => {
      const matchesSearch = p.name
        .toLowerCase()
        .includes(searchQuery.value.toLowerCase())
      const matchesCategory =
        categoryFilter.value === 'all' || p.category === categoryFilter.value
      return matchesSearch && matchesCategory
    })
  })

  const totalStock = computed(() =>
    products.value.reduce((sum, p) => sum + p.stock, 0)
  )

  const lowStockProducts = computed(() =>
    products.value.filter((p) => p.stock <= 30)
  )

  function addProduct(formData: ProductFormData) {
    const newProduct: Product = {
      ...formData,
      id: `P${String(products.value.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString().slice(0, 10),
    }
    products.value.unshift(newProduct)
  }

  function updateProduct(id: string, formData: ProductFormData) {
    const index = products.value.findIndex((p) => p.id === id)
    if (index !== -1) {
      products.value[index] = {
        ...products.value[index],
        ...formData,
      }
    }
  }

  function deleteProduct(id: string) {
    products.value = products.value.filter((p) => p.id !== id)
  }

  function getProductById(id: string): Product | undefined {
    return products.value.find((p) => p.id === id)
  }

  return {
    products,
    searchQuery,
    categoryFilter,
    filteredProducts,
    totalStock,
    lowStockProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductById,
  }
})
