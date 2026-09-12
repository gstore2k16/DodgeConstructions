/** One line item in the cart: an item id paired with the quantity added. */
export interface CartLine {
  readonly itemId: number;
  readonly quantity: number;
}
