import { useEffect, useState } from 'react'
import { fetchProducts } from './api/api'
import Cart from './components/Cart'
import ProductList from './components/ProductList'
import type { OrderLine, Product } from './types/types'

export default function App() {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    fetchProducts().then(setProducts)
  }, [])

  const [cart, setCart] = useState<OrderLine[]>([])

  const add = (productId: string) => {
    const line = cart.some((l) => l.product_id == productId)
    if (!line) return [...cart, {product_id: productId, quantity: 1}]
    return cart.map((l) =>
      l.product_id === productId ? { ...l, quantity: l.quantity + 1 } : l
    )
  }

  const setQty = (productId: string, quantity: number) => {
    setCart((cart) =>
      quantity === 0
        ? cart.filter((l) => l.product_id !== productId)
        : cart.map((l) => (l.product_id === productId ? { ...l, quantity } : l))
    )
  }

  return (
    <main className="layout">
      <ProductList products={products} />
      <Cart products={products} />
    </main>
  )
}
