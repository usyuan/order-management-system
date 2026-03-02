// =====================
// 訂單相關型別定義
// =====================

export type OrderStatus = 'pending' | 'shipping' | 'completed'

export interface OrderItem {
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  subtotal: number
}

export interface Order {
  id: string
  customerName: string
  customerEmail: string
  customerPhone: string
  totalAmount: number
  status: OrderStatus
  createdAt: string
  items: OrderItem[]
  shippingAddress: string
  note?: string
}

// =====================
// 商品相關型別定義
// =====================

export type ProductCategory =
  | '電子產品'
  | '服飾配件'
  | '居家用品'
  | '食品飲料'
  | '運動休閒'

export interface Product {
  id: string
  name: string
  category: ProductCategory
  unitPrice: number
  stock: number
  imageUrl: string
  description?: string
  createdAt: string
}

export type ProductFormData = Omit<Product, 'id' | 'createdAt'>

// =====================
// UI 共用型別
// =====================

export interface SelectOption<T = string> {
  label: string
  value: T
}
