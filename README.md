# Mini Oda Shop — skeleton

Django + SQLite backend, React + TypeScript (Vite) frontend. Browse products, add
them to a cart, place an order.

I used around 2.5 hrs total. 2 hrs on planning the approach and implementin the code. 0.5 hrs on understandin the task, getting familiarised to the codebase and finishin up the read me documentation.

## Prerequisites

Python 3 and Node, any recent version. Check with `python3 --version` and
`node --version`.

## Run

Backend, on port 8000:

```bash
python3 -m venv .venv
.venv/bin/pip install -r backend/requirements.txt
.venv/bin/python backend/manage.py migrate
.venv/bin/python backend/manage.py seed_products
.venv/bin/python backend/manage.py runserver
```

Frontend, on port 5173, in a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). You should see the product count and an empty cart. The
Vite dev server proxies `/api` to Django, so the browser only ever talks to one
origin and there is no CORS setup to worry about.

Run `seed_products` again whenever you change `products.json`. It updates the
existing rows instead of duplicating them, so it is safe to repeat.

## Requirements Fulfilled

The assignment asks for three things. All three work:

- **Add / remove products.** Product cards and cart lines share the same
quantity stepper. `+` adds or increments. `−` steps down. Quantity `0`
removes the line and the product card returns to a single `+`. The cart
trash icon clears everything locally.
- **Line items and totals.** The cart shows thumbnail, title, subtitle,
quantity, line total, item count, and **Delsum**. Totals stay in øre until
render.
- **Checkout.** **Fullfør kjøp** `POST`s `{ items: [{ product_id, quantity }] }`
to `/api/orders`. On success the cart clears and an alert shows the
`order_id`. On failure the cart is left unchanged.

Out of scope, and skipped: auth, mobile layouts, search, tests.

The cart is not persisted. Refreshing the page empties it. That is
intentional — there is no cart API.

## Technical Choices

### Frontend layout

The skeleton kept `api.ts`, `types.ts`, and CSS next to `App.tsx`. I split
`frontend/src/` the usual way so each concern has a folder:

```
frontend/src/
  api/           fetch helpers
  types/         Product, OrderLine
  lib/           formatOre
  styles/        tokens + layout
  components/    ProductList, Cart, QtyControls
  App.tsx        product fetch + cart state
```

### `add` / `setQty` vs `buy`

Cart mutations and checkout are different operations, so they are different
functions.

- `add(productId)` and `setQty(productId, quantity)` only update React state.
`add` inserts or increments. `setQty` sets an absolute quantity and drops
the line at `0`. The `×` on a cart line is just `setQty(id, 0)`.
- `buy()` is the only network write. It calls `placeOrder`, then clears the
cart if the response is ok.

Keeping quantity local means add/remove stays instant and the backend stays a
product catalogue plus an order writer.

`add` and `setQty` are both there because the buttons mean different things.
`+` is “one more”. `−` and `×` are “set this to N / remove”. One function
could cover both, but then every `+` would have to know the current quantity.
`add` keeps that lookup in one place.

### `QtyControls`

Product cards and cart lines use the same quantity UI: a `+` when qty is 0,
and `−  qty  +` otherwise. That lives in `QtyControls` so the stepper is not
copied. Each parent still decides what `onAdd` / `onDec` do.

### `Order` and `OrderItem`

Checkout is a header plus lines, not a blob of products on one row.

- **Order** — one completed purchase: `created_at` and `total_ore`.
- **OrderItem** — one product on that purchase: quantity and
`unit_price_ore`.

`unit_price_ore` is a snapshot of the product price at buy time. Old orders
do not move if `products.json` is re-seeded. `total_ore` is stored on the
order so you can inspect it without summing items. `OrderItem.product` uses
`PROTECT` so a product that has been sold cannot be deleted out from under
history.

### `create_order` helpers

`create_order` is the HTTP adapter. Parsing and persistence are named helpers:

- `_lines_from_request` — decode JSON, reject an empty cart, look up products
in one `in_bulk`, reject unknown ids and non-positive quantities.
- `_save_order` — compute `total_ore`, then in `transaction.atomic()` create
the `Order` and `bulk_create` the `OrderItem`s.

The view stays short: parse or 400, save, return `{ "order_id" }` with 201.

`@csrf_exempt` is on the POST because the frontend sends JSON with no CSRF
cookie. Fine for this no-auth local API; not what you would ship.

## Next Steps

If this were going live, I would do these four next, in this order:

1. **Make Buy safe to double-click** (backend). Two clicks can persist two
  orders, so this is the first thing that can cost money.
2. **Persist the cart** (frontend). A refresh currently throws away the
  basket, which is the main way a real shopper would lose work before
   checkout.
3. **Tighten checkout validation** (backend). Duplicate `product_id`s in
  one POST become two `OrderItem` rows, so stored orders would not match
   what the customer saw.
4. **Split `Cart.tsx`** (frontend). Header, item list, and footer are
  already separate in the markup, and pulling them apart is the cheapest
   way to make the next cart UI change safe.

## AI use

AI was used to:

- polish the approach
- generate code from small, single-responsibility instructions I wrote
- help optimize some of those suggestions
- break large methods into helpers
- turn dictated notes into this README

I still chose the data model, the client-side cart, and what stayed out of
scope.