import { formatOre } from '../format'
import type { Product } from '../types/types'

type Props = {
  products: Product[]
}

export default function ProductList({ products }: Props) {
  return (
    <section className="products">
      {products.map((product) => (
        <article className="product-card" key={product.id}>
          <div className="product-image">
            <img src={product.image} alt={product.title} loading="lazy" />
          </div>
          <h2 className="product-title">{product.title}</h2>
          <p className="product-subtitle">{product.subtitle}</p>
          <p className="product-price">{formatOre(product.price_ore)}</p>
          {/* TODO: A button that puts the product in the cart. */}
        </article>
      ))}
    </section>
  )
}
