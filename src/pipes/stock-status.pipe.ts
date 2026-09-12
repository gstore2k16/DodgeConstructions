import { Pipe, PipeTransform } from '@angular/core';

export interface StockInfo {
  inStock: boolean;
  stockCount: number;
}

@Pipe({
  name: 'stockStatus',
  pure: true
})
export class StockStatusPipe implements PipeTransform {
  /**
   * Transforms stock availability into a user-friendly status message.
   * @param item Object containing inStock status and stockCount
   * @param detailed Optional flag to include exact count formatting
   */
  transform(item: StockInfo | null | undefined, detailed: boolean = true): string {
    if (!item || !item.inStock || item.stockCount <= 0) {
      return 'Out of Stock';
    }

    if (item.stockCount <= 5) {
      return `Low Stock (${item.stockCount} left)`;
    }

    return detailed ? `In Stock (${item.stockCount} available)` : 'In Stock';
  }
}
