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
    setCart((cart) => {
      const exists = cart.some((l) => l.product_id === productId)
      if (!exists) return [...cart, { product_id: productId, quantity: 1 }]
      return cart.map((l) =>
        l.product_id === productId ? { ...l, quantity: l.quantity + 1 } : l
      )
    })
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
      <ProductList products={products} cart={cart} onAdd={add} onSetQty={setQty} />
      <Cart products={products} />
    </main>
  )
}
