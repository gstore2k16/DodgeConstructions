import { Injector } from '@angular/core';
import { of, throwError } from 'rxjs';
import { ItemStateService } from './item-state.service';
import { ItemService } from './item.service';
import { ProductItem } from '../models/product-item.model';

describe('ItemStateService (Jest)', () => {
  let service: ItemStateService;
  let mockItemService: any;

  const mockItems = [
    new ProductItem(1, 'DeWalt Cordless Drill', 'Power Tools', 149.99, 'High power cordless drill.', true, 15, '/drill.jpg', ['20V MAX']),
    new ProductItem(2, 'Bosch Circular Saw', 'Power Tools', 199.99, 'Precision circular saw.', false, 0, '/saw.jpg', ['15 Amp']),
    new ProductItem(3, 'Safety Goggles', 'Safety', 19.99, 'Impact-resistant goggles.', true, 50, '/goggles.jpg', ['UV Protection'])
  ];

  function createService(itemServiceMock: any): ItemStateService {
    const injector = Injector.create({
      providers: [
        { provide: ItemService, useValue: itemServiceMock },
        ItemStateService
      ]
    });
    return injector.get(ItemStateService);
  }

  beforeEach(() => {
    mockItemService = {
      getItems: jest.fn().mockReturnValue(of(mockItems))
    };
    service = createService(mockItemService);
  });

  it('should be created and automatically load items', () => {
    expect(service).toBeTruthy();
    expect(service.items().length).toBe(3);
    expect(service.loading()).toBe(false);
  });

  it('should expose immutable collection snapshots', () => {
    expect(Object.isFrozen(service.items())).toBe(true);
    expect(Object.isFrozen(service.filteredItems())).toBe(true);
    expect(Object.isFrozen(service.categories())).toBe(true);
    expect(Object.isFrozen(service.compareIds())).toBe(true);
    expect(Object.isFrozen(service.comparedItems())).toBe(true);
    expect(Object.isFrozen(service.cartItems())).toBe(true);

    let threw = false;
    try {
      (service.items() as any).push(mockItems[0]);
    } catch {
      threw = true;
    }
    expect(threw).toBe(true);
  });

  it('should derive categories list starting with "All"', () => {
    expect(service.categories()).toEqual(['All', 'Power Tools', 'Safety']);
  });

  it('should surface a friendly error message and stop loading when getItems() fails', () => {
    const failingItemService = {
      getItems: jest.fn().mockReturnValue(throwError(() => new Error('network down')))
    };
    const failingService = createService(failingItemService);

    expect(failingService.loading()).toBe(false);
    expect(failingService.error()).toBe('Failed to load products. Please try again later.');
    expect(failingService.items()).toEqual([]);
    expect(Object.isFrozen(failingService.items())).toBe(true);
  });

  it('should re-invoke ItemService.getItems() and refresh state when loadItems() is called', () => {
    expect(mockItemService.getItems._calls.length).toBe(1);

    service.loadItems();

    expect(mockItemService.getItems._calls.length).toBe(2);
    expect(service.items().length).toBe(3);
    expect(service.loading()).toBe(false);
    expect(service.error()).toBeNull();
  });

  it('should filter items by text search term', () => {
    service.setSearchFilter('drill');
    expect(service.filteredItems().length).toBe(1);
    expect(service.filteredItems()[0].name).toBe('DeWalt Cordless Drill');
  });

  it('should filter items by text search term case-insensitively and trim whitespace', () => {
    service.setSearchFilter('  DRILL  ');
    expect(service.filteredItems().length).toBe(1);
    expect(service.filteredItems()[0].name).toBe('DeWalt Cordless Drill');
  });

  it('should filter items by selected category', () => {
    service.setCategoryFilter('Safety');
    expect(service.filteredItems().length).toBe(1);
    expect(service.filteredItems()[0].name).toBe('Safety Goggles');
  });

  it('should filter items by inStockOnly', () => {
    service.setInStockOnly(true);
    expect(service.filteredItems().length).toBe(2);
    expect(service.filteredItems().every(item => item.inStock)).toBe(true);
  });

  it('should filter items by minimum price', () => {
    service.setMinPrice(100);
    expect(service.filteredItems().length).toBe(2);
    expect(service.filteredItems().every(item => item.price >= 100)).toBe(true);
  });

  it('should filter items by maximum price', () => {
    service.setMaxPrice(150);
    expect(service.filteredItems().length).toBe(2);
    expect(service.filteredItems().every(item => item.price <= 150)).toBe(true);
  });

  it('should filter items within a combined min/max price range', () => {
    service.setMinPrice(100);
    service.setMaxPrice(180);
    expect(service.filteredItems().length).toBe(1);
    expect(service.filteredItems()[0].name).toBe('DeWalt Cordless Drill');
  });

  it('should normalize negative, NaN, or non-finite prices to null (no restriction)', () => {
    service.setMinPrice(-50);
    expect(service.minPrice()).toBeNull();

    service.setMaxPrice(NaN);
    expect(service.maxPrice()).toBeNull();

    service.setMinPrice(Infinity);
    expect(service.minPrice()).toBeNull();

    service.setMinPrice(25);
    expect(service.minPrice()).toBe(25);
  });

  it('should combine search, category, stock, and price filters together', () => {
    service.setCategoryFilter('Power Tools');
    service.setInStockOnly(true);
    service.setMaxPrice(180);

    expect(service.filteredItems().length).toBe(1);
    expect(service.filteredItems()[0].name).toBe('DeWalt Cordless Drill');
  });

  it('should sort items by price ascending and descending', () => {
    service.setSortOrder('price-asc');
    expect(service.filteredItems()[0].price).toBe(19.99);

    service.setSortOrder('price-desc');
    expect(service.filteredItems()[0].price).toBe(199.99);
  });

  it('should select an item by ID and expose it via selectedItem', () => {
    expect(service.selectedItem()).toBeUndefined();

    service.selectItemById(3);
    expect(service.selectedItem()?.name).toBe('Safety Goggles');
  });

  it('should return undefined from selectedItem for a non-existent ID', () => {
    service.selectItemById(9999);
    expect(service.selectedItem()).toBeUndefined();
  });

  it('should return undefined from selectedItem when the ID is explicitly cleared to null', () => {
    service.selectItemById(1);
    expect(service.selectedItem()).toBeTruthy();

    service.selectItemById(null);
    expect(service.selectedItem()).toBeUndefined();
  });

  it('should allow toggling comparison up to max 2 items', () => {
    expect(service.toggleCompare(1)).toBe(true);
    expect(service.toggleCompare(2)).toBe(true);
    expect(service.toggleCompare(3)).toBe(false); // Max limit 2 reached
    expect(service.comparedItems().length).toBe(2);

    service.removeCompare(1);
    expect(service.comparedItems().length).toBe(1);

    service.clearCompare();
    expect(service.comparedItems().length).toBe(0);
  });

  it('should untoggle (remove) an item that is already selected for comparison', () => {
    service.toggleCompare(1);
    service.toggleCompare(2);
    expect(service.compareIds()).toEqual([1, 2]);

    const result = service.toggleCompare(1);

    expect(result).toBe(true);
    expect(service.compareIds()).toEqual([2]);
    expect(service.comparedItems().length).toBe(1);
  });

  it('should exclude stale IDs from comparedItems if the underlying item no longer exists', () => {
    service.toggleCompare(1);
    service.toggleCompare(999); // not a real item id, but under the 2-item cap
    expect(service.compareIds()).toEqual([1, 999]);
    expect(service.comparedItems().length).toBe(1);
    expect(service.comparedItems()[0].id).toBe(1);
  });

  it('should reset all filters (including price range) to default', () => {
    service.setSearchFilter('drill');
    service.setCategoryFilter('Power Tools');
    service.setInStockOnly(true);
    service.setSortOrder('price-desc');
    service.setMinPrice(50);
    service.setMaxPrice(150);

    service.resetFilters();

    expect(service.filter()).toBe('');
    expect(service.selectedCategory()).toBe('All');
    expect(service.inStockOnly()).toBe(false);
    expect(service.sortOrder()).toBe('default');
    expect(service.minPrice()).toBeNull();
    expect(service.maxPrice()).toBeNull();
    expect(service.filteredItems().length).toBe(3);
  });

  it('should add a new cart line when adding an item for the first time', () => {
    service.addToCart(1, 2);

    expect(service.cartItems()).toEqual([{ itemId: 1, quantity: 2 }]);
    expect(service.cartItemCount()).toBe(2);
  });

  it('should merge quantity into an existing cart line instead of duplicating it', () => {
    service.addToCart(1, 2);
    service.addToCart(1, 3);
    service.addToCart(2, 1);

    expect(service.cartItems()).toEqual([
      { itemId: 1, quantity: 5 },
      { itemId: 2, quantity: 1 }
    ]);
    expect(service.cartItemCount()).toBe(6);
  });

  it('should ignore non-positive or invalid quantities when adding to cart', () => {
    service.addToCart(1, 0);
    service.addToCart(1, -2);
    service.addToCart(1, NaN);

    expect(service.cartItems()).toEqual([]);
    expect(service.cartItemCount()).toBe(0);
  });
});
