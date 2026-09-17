import { useEffect, useState } from 'react'
import { fetchProducts } from './api/api'
import Cart from './components/Cart'
import ProductList from './components/ProductList'
import type { Product } from './types/types'

export default function App() {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    fetchProducts().then(setProducts)
  }, [])

  // TODO: The cart state, and adding, changing a quantity and buying.

  return (
    <main className="layout">
      <ProductList products={products} />
      <Cart products={products} />
    </main>
  )
}
