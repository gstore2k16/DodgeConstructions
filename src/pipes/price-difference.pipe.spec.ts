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

  it('should return empty string when null or undefined is provided', () => {
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(undefined)).toBe('');
  });

  it('should return empty string when more than 2 items are provided', () => {
    expect(pipe.transform([itemA, itemB, itemC])).toBe('');
  });

  it('should return identical pricing message when prices match', () => {
    expect(pipe.transform([itemA, itemC])).toBe('Both products have identical pricing.');
  });

  it('should indicate cheaper item name and price difference amount', () => {
    expect(pipe.transform([itemA, itemB])).toBe('Drill A is $50.00 lower in price.');
  });

  it('should indicate the second item as cheaper when it has the lower price', () => {
    expect(pipe.transform([itemB, itemA])).toBe('Drill A is $50.00 lower in price.');
  });

  it('should format the difference to exactly two decimal places', () => {
    const cheap = new ProductItem(4, 'Cheap Item', 'Tools', 10.00, 'Desc', true, 5, '/d.jpg', []);
    const pricey = new ProductItem(5, 'Pricey Item', 'Tools', 10.125, 'Desc', true, 5, '/e.jpg', []);
    expect(pipe.transform([cheap, pricey])).toBe('Cheap Item is $0.13 lower in price.');
  });
});
