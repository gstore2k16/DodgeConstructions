import { Injector } from '@angular/core';
import { of } from 'rxjs';
import { ItemStateService } from './item-state.service';
import { ItemService } from './item.service';
import { ProductItem } from '../models/item.model';

describe('ItemStateService (Jest)', () => {
  let service: ItemStateService;

  const mockItems = [
    new ProductItem(1, 'DeWalt Cordless Drill', 'Power Tools', 149.99, 'High power cordless drill.', true, 15, '/drill.jpg', ['20V MAX']),
    new ProductItem(2, 'Bosch Circular Saw', 'Power Tools', 199.99, 'Precision circular saw.', false, 0, '/saw.jpg', ['15 Amp']),
    new ProductItem(3, 'Safety Goggles', 'Safety', 19.99, 'Impact-resistant goggles.', true, 50, '/goggles.jpg', ['UV Protection'])
  ];

  beforeEach(() => {
    const mockItemService = {
      getItems: jest.fn().mockReturnValue(of(mockItems))
    };

    const injector = Injector.create({
      providers: [
        { provide: ItemService, useValue: mockItemService },
        ItemStateService
      ]
    });

    service = injector.get(ItemStateService);
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

  it('should filter items by text search term', () => {
    service.setSearchFilter('drill');
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

  it('should sort items by price ascending and descending', () => {
    service.setSortOrder('price-asc');
    expect(service.filteredItems()[0].price).toBe(19.99);

    service.setSortOrder('price-desc');
    expect(service.filteredItems()[0].price).toBe(199.99);
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

  it('should reset all filters to default', () => {
    service.setSearchFilter('drill');
    service.setCategoryFilter('Power Tools');
    service.setInStockOnly(true);
    service.setSortOrder('price-desc');

    service.resetFilters();

    expect(service.filter()).toBe('');
    expect(service.selectedCategory()).toBe('All');
    expect(service.inStockOnly()).toBe(false);
    expect(service.sortOrder()).toBe('default');
  });
});
