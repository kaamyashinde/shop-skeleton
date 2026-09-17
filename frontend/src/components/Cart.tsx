import { formatOre } from "../lib/format";
import type { OrderLine, Product } from "../types/types";

type Props = {
  products: Product[];
  cart: OrderLine[];
  onAdd: (id: string) => void;
  onSetQty: (id: string, qty: number) => void;
  onClear: () => void;
};

export default function Cart({
  products,
  cart,
  onAdd,
  onSetQty,
  onClear,
}: Props) {
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
          <header className="cart-header">
            <p>
              Du har {itemCount} {itemCount === 1 ? "vare" : "varer"} i
              handlekurven
            </p>
            <button
              type="button"
              className="cart-clear"
              onClick={onClear}
              aria-label="Tøm handlekurven"
            >
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                aria-hidden="true"
              >
                <path
                  fill="currentColor"
                  d="M9 3h6l1 2h4v2H4V5h4l1-2zm1 6h2v9h-2V9zm4 0h2v9h-2V9zM8 9h2v9H8V9zM7 21h10l1-12H6l1 12z"
                />
              </svg>
            </button>
          </header>
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
        </>
      )}
    </aside>
  );
}
