# OrderFlow — 訂單管理系統

基於 **Vue 3 + TypeScript + Vite + Tailwind CSS + Pinia** 建構的訂單管理系統原型。

## 技術棧

| 類別 | 技術 |
|------|------|
| Build Tool | Vite 5 |
| Framework | Vue 3 (Composition API / script setup) |
| Language | TypeScript |
| UI Library | Tailwind CSS 3 |
| State Management | Pinia |
| Router | Vue Router 4 |

---

## 快速開始

```bash
# 安裝依賴
npm install

# 啟動開發伺服器
npm run dev

# 建置生產版本
npm run build
```

開發伺服器預設執行於 `http://localhost:5173`

---

## 專案目錄結構

```
order-management-system/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── main.ts                          # 應用程式入口
    ├── App.vue                          # 根元件
    ├── assets/
    │   └── main.css                     # Tailwind 全域樣式
    ├── types/
    │   └── index.ts                     # TypeScript Interface 定義
    ├── data/
    │   └── mockData.ts                  # Mock 資料 (6 商品 / 6 訂單)
    ├── router/
    │   └── index.ts                     # Vue Router 設定
    ├── stores/
    │   ├── orderStore.ts                # Pinia 訂單 Store
    │   └── productStore.ts              # Pinia 商品 Store
    ├── layouts/
    │   └── MainLayout.vue               # 主版面 (Sidebar + Header)
    ├── components/
    │   ├── common/
    │   │   ├── AppModal.vue             # 通用 Modal 元件 (Teleport + 動畫)
    │   │   └── AppBadge.vue             # 訂單狀態徽章
    │   ├── orders/
    │   │   └── OrderDetailModal.vue     # 訂單詳情彈窗
    │   └── products/
    │       └── ProductFormModal.vue     # 商品新增 / 編輯表單
    └── views/
        ├── OrderManagement.vue          # 訂單管理頁面
        └── ProductManagement.vue        # 商品管理頁面
```

---

## 核心功能一覽

| 功能 | 說明 |
|------|------|
| **TypeScript 型別** | `Order`、`Product`、`OrderStatus`、`ProductCategory`、`ProductFormData` 完整定義 |
| **訂單管理** | 訂單列表、即時搜尋（編號）、狀態篩選、點擊查看詳情 Modal |
| **商品管理** | 商品列表、新增 / 編輯 / 刪除 CRUD、表單驗證、圖片預覽、低庫存警示 |
| **Pinia Store** | 計算屬性（`filteredOrders`、`countByStatus`、`totalRevenue`），狀態集中管理 |
| **Modal 系統** | `AppModal` 使用 `Teleport` + `Transition`，支援 ESC 關閉、點擊背景關閉 |
| **刪除確認** | 二次確認對話框，防止誤刪商品資料 |

---

## 頁面說明

### 訂單管理（`/orders`）

- 顯示所有訂單：訂單編號、客戶名稱、總金額、訂單狀態、下單日期
- **搜尋**：依訂單編號即時過濾
- **狀態篩選**：全部 / 已下單 / 配送中 / 已完成
- **訂單詳情**：點擊「查看詳情」開啟 Modal，顯示客戶資訊、商品明細、總金額

### 商品管理（`/products`）

- 顯示所有商品：圖片、名稱、分類、單價、庫存量、建立日期
- **搜尋**：依商品名稱即時過濾
- **分類篩選**：電子產品 / 服飾配件 / 居家用品 / 食品飲料 / 運動休閒
- **新增商品**：填寫表單（名稱、分類、單價、庫存、圖片網址、描述）並即時預覽圖片
- **編輯商品**：帶入現有資料的編輯表單
- **刪除商品**：含二次確認彈窗

---

## TypeScript 型別定義摘要

```typescript
// 訂單狀態
type OrderStatus = 'pending' | 'shipping' | 'completed'

// 訂單
interface Order {
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

// 商品
interface Product {
  id: string
  name: string
  category: ProductCategory
  unitPrice: number
  stock: number
  imageUrl: string
  description?: string
  createdAt: string
}
```
