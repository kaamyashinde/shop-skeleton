import type { OrderLine, Product } from '../types'

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch('/api/products')
  if (!res.ok) throw new Error(`GET /api/products failed: ${res.status}`)
  const data: { products: Product[] } = await res.json()
  return data.products
}

export async function placeOrder(lines: OrderLine[]): Promise<{ order_id: number }> {
  const res = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items: lines }),
  })
  if (!res.ok) throw new Error(`POST /api/orders failed: ${res.status}`)
  return res.json()
}
