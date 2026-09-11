import { PriceDifferencePipe } from './price-difference.pipe';
import { ProductItem } from '../models/item.model';

describe('PriceDifferencePipe (Jest)', () => {
  let pipe: PriceDifferencePipe;

  const itemA = new ProductItem(1, 'Drill A', 'Tools', 100.00, 'Desc', true, 10, '/a.jpg', []);
  const itemB = new ProductItem(2, 'Drill B', 'Tools', 150.00, 'Desc', true, 5, '/b.jpg', []);
  const itemC = new ProductItem(3, 'Drill C', 'Tools', 100.00, 'Desc', true, 8, '/c.jpg', []);

  beforeEach(() => {
    pipe = new PriceDifferencePipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return empty string when less than 2 items are provided', () => {
    expect(pipe.transform([])).toBe('');
    expect(pipe.transform([itemA])).toBe('');
  });

  it('should return identical pricing message when prices match', () => {
    expect(pipe.transform([itemA, itemC])).toBe('Both products have identical pricing.');
  });

  it('should indicate cheaper item name and price difference amount', () => {
    expect(pipe.transform([itemA, itemB])).toBe('Drill A is $50.00 lower in price.');
  });
});
