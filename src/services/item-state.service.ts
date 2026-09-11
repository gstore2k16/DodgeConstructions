import { Injectable, inject, signal, computed, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subscription } from 'rxjs';
import { Item } from '../models/item.model';
import { ItemService } from './item.service';
import { SortOption } from '../components/item-filter/item-filter.component';

@Injectable({
  providedIn: 'root'
})
export class ItemStateService {
  private readonly itemService = inject(ItemService);
  private readonly destroyRef = inject(DestroyRef);
  private loadSub?: Subscription;

  // Private writable signals (Controlled internal state)
  private readonly _items = signal<Item[]>([]);
  private readonly _loading = signal<boolean>(true);
  private readonly _error = signal<string | null>(null);
  private readonly _filter = signal<string>('');
  private readonly _selectedCategory = signal<string>('All');
  private readonly _minPrice = signal<number | null>(null);
  private readonly _maxPrice = signal<number | null>(null);
  private readonly _inStockOnly = signal<boolean>(false);
  private readonly _sortOrder = signal<SortOption>('default');
  private readonly _selectedItemId = signal<number | null>(null);

  // Public Readonly Signals (Exposed to components to prevent direct state mutation)
  public readonly items = this._items.asReadonly();
  public readonly loading = this._loading.asReadonly();
  public readonly error = this._error.asReadonly();
  public readonly filter = this._filter.asReadonly();
  public readonly selectedCategory = this._selectedCategory.asReadonly();
  public readonly minPrice = this._minPrice.asReadonly();
  public readonly maxPrice = this._maxPrice.asReadonly();
  public readonly inStockOnly = this._inStockOnly.asReadonly();
  public readonly sortOrder = this._sortOrder.asReadonly();
  public readonly selectedItemId = this._selectedItemId.asReadonly();

  // Derived Computed Signals (Encapsulated Business Logic)
  public readonly categories = computed<string[]>(() => {
    const all = this._items();
    const set = new Set<string>();
    all.forEach((item: Item) => set.add(item.category));
    return ['All', ...Array.from(set)];
  });

  public readonly filteredItems = computed<Item[]>(() => {
    let result = [...this._items()];
    const term = this._filter().toLowerCase().trim();
    const category = this._selectedCategory();
    const minP = this._minPrice();
    const maxP = this._maxPrice();
    const stockOnly = this._inStockOnly();
    const sort = this._sortOrder();

    // 1. Text search filter
    if (term) {
      result = result.filter((item: Item) => item.name.toLowerCase().includes(term));
    }

    // 2. Category filter
    if (category !== 'All') {
      result = result.filter((item: Item) => item.category === category);
    }

    // 3. Stock filter
    if (stockOnly) {
      result = result.filter((item: Item) => item.inStock);
    }

    // 4. Price range filter
    if (minP !== null && !isNaN(minP)) {
      result = result.filter((item: Item) => item.price >= minP);
    }
    if (maxP !== null && !isNaN(maxP)) {
      result = result.filter((item: Item) => item.price <= maxP);
    }

    // 5. Sorting
    if (sort === 'price-asc') {
      result.sort((a: Item, b: Item) => a.price - b.price);
    } else if (sort === 'price-desc') {
      result.sort((a: Item, b: Item) => b.price - a.price);
    }

    return result;
  });

  public readonly selectedItem = computed<Item | undefined>(() => {
    const id = this._selectedItemId();
    if (id === null) return undefined;
    return this._items().find((item: Item) => item.id === id);
  });

  constructor() {
    this.loadItems();
  }

  /**
   * Fetches products from ItemService and updates state signals.
   */
  public loadItems(): void {
    if (this._items().length > 0 && !this._error()) {
      this._loading.set(false);
      return;
    }

    this.loadSub?.unsubscribe();

    this._loading.set(true);
    this._error.set(null);

    this.loadSub = this.itemService.getItems().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (data: Item[]) => {
        this._items.set(data);
        this._loading.set(false);
      },
      error: (err: Error) => {
        this._error.set('Failed to load products. Please try again later.');
        this._loading.set(false);
      }
    });
  }

  // Controlled State Mutators (Encapsulated Actions)
  public setSearchFilter(term: string): void {
    this._filter.set(term);
  }

  public setCategoryFilter(category: string): void {
    this._selectedCategory.set(category);
  }

  public setMinPrice(min: number | null): void {
    this._minPrice.set(min);
  }

  public setMaxPrice(max: number | null): void {
    this._maxPrice.set(max);
  }

  public setInStockOnly(inStock: boolean): void {
    this._inStockOnly.set(inStock);
  }

  public setSortOrder(sort: SortOption): void {
    this._sortOrder.set(sort);
  }

  public selectItemById(id: number | null): void {
    this._selectedItemId.set(id);
  }

  public resetFilters(): void {
    this._filter.set('');
    this._selectedCategory.set('All');
    this._minPrice.set(null);
    this._maxPrice.set(null);
    this._inStockOnly.set(false);
    this._sortOrder.set('default');
  }
}
