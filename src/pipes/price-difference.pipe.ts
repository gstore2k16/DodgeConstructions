import { Pipe, PipeTransform } from '@angular/core';
import { Item } from '../models/item.model';

@Pipe({
  name: 'priceDifference',
  pure: true,
})
export class PriceDifferencePipe implements PipeTransform {
  /**
   * Calculates and formats the price comparison summary between two products.
   * @param items Pair of items to compare
   */
  transform(items: readonly Item[] | null | undefined): string {
    if (!items || items.length !== 2) return '';
    const [itemA, itemB] = items;
    if (itemA.price === itemB.price) {
      return 'Both products have identical pricing.';
    }

    const cheaper = itemA.price < itemB.price ? itemA : itemB;
    const diff = Math.abs(itemA.price - itemB.price);

    return `${cheaper.name} is $${diff.toFixed(2)} lower in price.`;
  }
}
