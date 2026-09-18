export type Product = {
  id: string
  title: string
  subtitle: string
  description: string
  image: string
  price_ore: number
}


export type OrderLine = {
  product_id: string
  quantity: number
}
