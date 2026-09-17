import { formatOre } from "../lib/format";
import type { OrderLine, Product } from "../types/types";

type Props = {
  products: Product[];
  cart: OrderLine[];
  onAdd: (id: string) => void;
  onSetQty: (id: string, qty: number) => void;
};

export default function Cart({ products, cart, onAdd, onSetQty }: Props) {
  const productById = Object.fromEntries(products.map((p) => [p.id, p]));
  const itemCount = cart.reduce((n, l) => n + l.quantity, 0);
  const delsumOre = cart.reduce((sum, l) => {
    const p = productById[l.product_id];
    return p ? sum + l.quantity * p.price_ore : sum;
  }, 0);

  return (
    <aside className="cart">
      {cart.length === 0 ? (
        <div className="cart-empty">
          <h2 className="cart-empty-heading">Handlekurven er tom</h2>
          <p className="cart-empty-body">Legg til varer for å fortsette.</p>
        </div>
      ) : (
        <>
          {
            /* header + lines */

            <footer className="cart-footer">
              <div className="cart-footer-row">
                <span>Delsum</span>
                <strong>{formatOre(delsumOre)}</strong>
              </div>
              <button
                type="button"
                className="cart-buy"
                disabled={cart.length === 0}
              >
                Fullfør kjøp
              </button>
            </footer>
          }
        </>
      )}
    </aside>
  );
}
