import {
  Injector,
  signal,
  DestroyRef,
  ɵChangeDetectionScheduler as ChangeDetectionScheduler,
  ɵEffectScheduler as EffectScheduler,
} from '@angular/core';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { of } from 'rxjs';
import { ItemsComponent } from './items.component';
import { ItemStateService } from '../../services/item-state.service';
import { ProductItem } from '../../models/product-item.model';

describe('ItemsComponent (Jest)', () => {
  let component: ItemsComponent;
  let mockStateService: any;
  let mockTitleService: any;
  let mockDestroyRef: any;

  const mockItem = new ProductItem(
    1,
    'DeWalt Cordless Drill',
    'Power Tools',
    149.99,
    'High power cordless drill.',
    true,
    15,
    '/assets/images/drill.jpg',
    ['20V MAX'],
  );

  beforeEach(() => {
    mockDestroyRef = { onDestroy: jest.fn() };
    mockStateService = {
      items: signal([mockItem]).asReadonly(),
      filteredItems: signal([mockItem]).asReadonly(),
      comparedItems: signal<ProductItem[]>([]).asReadonly(),
      loading: signal(false).asReadonly(),
      error: signal<string | null>(null).asReadonly(),
      filter: signal('').asReadonly(),
      selectedCategory: signal('All').asReadonly(),
      minPrice: signal<number | null>(null).asReadonly(),
      maxPrice: signal<number | null>(null).asReadonly(),
      inStockOnly: signal(false).asReadonly(),
      sortOrder: signal('default').asReadonly(),
      categories: signal(['All', 'Power Tools']).asReadonly(),
      setSearchFilter: jest.fn(),
      setCategoryFilter: jest.fn(),
      setMinPrice: jest.fn(),
      setMaxPrice: jest.fn(),
      setInStockOnly: jest.fn(),
      setSortOrder: jest.fn(),
      resetFilters: jest.fn(),
      loadItems: jest.fn(),
    };

    mockTitleService = {
      setTitle: jest.fn(),
      getTitle: jest.fn(),
    };

    const injector = Injector.create({
      providers: [
        { provide: EffectScheduler, useValue: { add: () => {}, schedule: () => {} } },
        { provide: ChangeDetectionScheduler, useValue: { notify: () => {} } },
        { provide: DestroyRef, useValue: mockDestroyRef },
        { provide: ItemStateService, useValue: mockStateService },
        { provide: Title, useValue: mockTitleService },
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: { queryParamMap: of(new Map([['category', 'Power Tools']])) },
        },
        ItemsComponent,
      ],
    });
    component = injector.get(ItemsComponent);
  });

  it('should create items component instance', () => {
    expect(component).toBeTruthy();
  });

  it('should set the page title to the products listing title on construction', () => {
    expect(mockTitleService.setTitle).toHaveBeenCalledWith('Products - DodgeConstructions');
  });

  it('should expose stateService signals for template binding', () => {
    expect(component.filteredItems()).toBeDefined();
    expect(component.filteredItems().length).toBe(1);
    expect(component.loading()).toBe(false);
    expect(component.error()).toBeNull();
    expect(component.categories()).toEqual(['All', 'Power Tools']);
  });

  it('should delegate onSearchChange to stateService.setSearchFilter', () => {
    component.onSearchChange('drill');
    expect(mockStateService.setSearchFilter).toHaveBeenCalledWith('drill');
  });

  it('should delegate onCategoryChange to stateService.setCategoryFilter', () => {
    component.onCategoryChange('Safety');
    expect(mockStateService.setCategoryFilter).toHaveBeenCalledWith('Safety');
  });

  it('should delegate onMinPriceChange to stateService.setMinPrice', () => {
    component.onMinPriceChange(25);
    expect(mockStateService.setMinPrice).toHaveBeenCalledWith(25);
  });

  it('should delegate onMaxPriceChange to stateService.setMaxPrice', () => {
    component.onMaxPriceChange(200);
    expect(mockStateService.setMaxPrice).toHaveBeenCalledWith(200);
  });

  it('should delegate onInStockToggle to stateService.setInStockOnly', () => {
    component.onInStockToggle(true);
    expect(mockStateService.setInStockOnly).toHaveBeenCalledWith(true);
  });

  it('should delegate onSortChange to stateService.setSortOrder', () => {
    component.onSortChange('price-desc');
    expect(mockStateService.setSortOrder).toHaveBeenCalledWith('price-desc');
  });

  it('should delegate resetFilters to stateService.resetFilters', () => {
    component.resetFilters();
    expect(mockStateService.resetFilters).toHaveBeenCalled();
  });
});
