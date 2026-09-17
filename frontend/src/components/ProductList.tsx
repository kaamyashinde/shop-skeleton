import { formatOre } from '../lib/format'
import type { OrderLine, Product } from '../types/types'
import QtyControls from './QtyControls'

type Props = {
  products: Product[]
  cart: OrderLine[]
  onAdd: (id: string) => void
  onSetQty: (id: string, qty: number) => void
}

export default function ProductList({ products, cart, onAdd, onSetQty }: Props) {
  const qtyById = Object.fromEntries(cart.map((l) => [l.product_id, l.quantity]))

  return (
    <section className="products">
      {products.map((product) => {
        const qty = qtyById[product.id] ?? 0
        return (
          <article className="product-card" key={product.id}>
            <div className="product-image">
              <img src={product.image} alt={product.title} loading="lazy" />
            </div>
            <h2 className="product-title">{product.title}</h2>
            <p className="product-subtitle">{product.subtitle}</p>
            <div className="product-card-footer">
              <p className="product-price">{formatOre(product.price_ore)}</p>
              <QtyControls
                qty={qty}
                onAdd={() => onAdd(product.id)}
                onDec={() => onSetQty(product.id, qty - 1)}
              />
            </div>
          </article>
        )
      })}
    </section>
  )
}