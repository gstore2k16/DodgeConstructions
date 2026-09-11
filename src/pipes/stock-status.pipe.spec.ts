import { StockStatusPipe } from './stock-status.pipe';

describe('StockStatusPipe (Jest)', () => {
  let pipe: StockStatusPipe;

  beforeEach(() => {
    pipe = new StockStatusPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return "Out of Stock" when item is null or inStock is false or stockCount <= 0', () => {
    expect(pipe.transform(null)).toBe('Out of Stock');
    expect(pipe.transform({ inStock: false, stockCount: 10 })).toBe('Out of Stock');
    expect(pipe.transform({ inStock: true, stockCount: 0 })).toBe('Out of Stock');
  });

  it('should return "Low Stock (X left)" when stockCount <= 5', () => {
    expect(pipe.transform({ inStock: true, stockCount: 3 })).toBe('Low Stock (3 left)');
  });

  it('should return "In Stock (X available)" when detailed is true and stockCount > 5', () => {
    expect(pipe.transform({ inStock: true, stockCount: 12 }, true)).toBe('In Stock (12 available)');
  });

  it('should return "In Stock" when detailed is false and stockCount > 5', () => {
    expect(pipe.transform({ inStock: true, stockCount: 12 }, false)).toBe('In Stock');
  });
});
