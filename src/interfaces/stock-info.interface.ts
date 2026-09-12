/** Minimal shape StockStatusPipe needs to render availability — satisfied structurally by Item/ProductItem. */
export interface StockInfo {
  inStock: boolean;
  stockCount: number;
}
