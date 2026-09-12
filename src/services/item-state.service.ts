import { Injectable, inject, signal, computed, Signal, DestroyRef } from '@angular/core';
import { toSignal, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, catchError, concat, map, of, startWith, switchMap } from 'rxjs';
import { Item } from '../models/item.model';
import { ItemService } from './item.service';
import { SortOption } from '../models/item-filter.model';
import { CartLine } from '../interfaces/cart-line.interface';
import { ItemRequestState } from '../interfaces/item-request-state.interface';

@Injectable({
  providedIn: 'root'
})
export class ItemStateService {
  private readonly itemService = inject(ItemService);
  private readonly destroyRef = inject(DestroyRef, { optional: true });
  private readonly reloadItems$ = new Subject<void>();

  /**
   * A single stream is the source of truth for remote item state. `toSignal`
   * manages its subscription for this root-scoped service, avoiding manual
   * subscription and teardown code.
   */
  private readonly itemRequest = toSignal<ItemRequestState, ItemRequestState>(
    this.reloadItems$.pipe(
      startWith(undefined),
      switchMap(() => concat(
        of<ItemRequestState>(initialItemRequestState),
        this.itemService.getItems().pipe(
          takeUntilDestroyed(this.destroyRef ?? undefined),
          map((items: Item[]): ItemRequestState => ({
            items: this.freezeArray(items),
            loading: false,
            error: null
          })),
          catchError(() => of<ItemRequestState>({
            items: Object.freeze([]),
            loading: false,
            error: 'Failed to load products. Please try again later.'
          }))
        )
      ))
    ),
    {
      initialValue: initialItemRequestState
    }
  );

  // Private writable signals (Controlled internal state)
  private readonly _filter = signal<string>('');
  private readonly _selectedCategory = signal<string>('All');
  private readonly _minPrice = signal<number | null>(null);
  private readonly _maxPrice = signal<number | null>(null);
  private readonly _inStockOnly = signal<boolean>(false);
  private readonly _sortOrder = signal<SortOption>('default');
  private readonly _selectedItemId = signal<number | null>(null);
  private readonly _compareIds = signal<readonly number[]>(Object.freeze([]));
  private readonly _cartItems = signal<readonly CartLine[]>(Object.freeze([]));

  // Public Readonly Signals (Exposed to components to prevent direct state mutation)
  public readonly items: Signal<readonly Item[]> = computed(() => this.itemRequest().items);
  public readonly loading: Signal<boolean> = computed(() => this.itemRequest().loading);
  public readonly error: Signal<string | null> = computed(() => this.itemRequest().error);
  public readonly filter = this._filter.asReadonly();
  public readonly selectedCategory = this._selectedCategory.asReadonly();
  public readonly minPrice = this._minPrice.asReadonly();
  public readonly maxPrice = this._maxPrice.asReadonly();
  public readonly inStockOnly = this._inStockOnly.asReadonly();
  public readonly sortOrder = this._sortOrder.asReadonly();
  public readonly selectedItemId = this._selectedItemId.asReadonly();
  public readonly compareIds: Signal<readonly number[]> = this._compareIds.asReadonly();
  public readonly cartItems: Signal<readonly CartLine[]> = this._cartItems.asReadonly();

  // Derived Computed Signals (Encapsulated Business Logic)
  public readonly comparedItems: Signal<readonly Item[]> = computed(() => {
    const ids = this._compareIds();
    const all = this.items();
    return this.freezeArray(ids.map(id => all.find(item => item.id === id)).filter((item): item is Item => !!item));
  });
  public readonly categories: Signal<readonly string[]> = computed(() => {
    return this.freezeArray(['All', ...new Set(this.items().map(item => item.category))]);
  });

  /** Total number of units across all cart lines (for a nav/cart badge). */
  public readonly cartItemCount: Signal<number> = computed(() =>
    this._cartItems().reduce((sum, line) => sum + line.quantity, 0)
  );

  public readonly filteredItems: Signal<readonly Item[]> = computed(() => {
    let result = [...this.items()];
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

    return this.freezeArray(result);
  });

  public readonly selectedItem = computed<Item | undefined>(() => {
    const id = this._selectedItemId();
    if (id === null) return undefined;
    return this.items().find((item: Item) => item.id === id);
  });

  /**
   * Fetches products from ItemService and updates state signals.
   */
  public loadItems(): void {
    this.reloadItems$.next();
  }

  // Controlled State Mutators (Encapsulated Actions)
  public setSearchFilter(term: string): void {
    this._filter.set(term);
  }

  public setCategoryFilter(category: string): void {
    this._selectedCategory.set(category);
  }

  public setMinPrice(min: number | null): void {
    this._minPrice.set(this.normalizePrice(min));
  }

  public setMaxPrice(max: number | null): void {
    this._maxPrice.set(this.normalizePrice(max));
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

  public toggleCompare(id: number): boolean {
    const current = this._compareIds();
    if (current.includes(id)) {
      this._compareIds.set(this.freezeArray(current.filter(i => i !== id)));
      return true;
    }
    if (current.length >= 2) {
      return false; // Limit reached (Max 2 products allowed for comparison)
    }
    this._compareIds.set(this.freezeArray([...current, id]));
    return true;
  }

  public removeCompare(id: number): void {
    this._compareIds.set(this.freezeArray(this._compareIds().filter(i => i !== id)));
  }

  public clearCompare(): void {
    this._compareIds.set(Object.freeze([]));
  }

  /**
   * Adds a quantity of the given item to the cart, merging into an existing
   * line if the item is already present rather than creating a duplicate.
   */
  public addToCart(itemId: number, quantity: number): void {
    if (!Number.isFinite(quantity) || quantity <= 0) {
      return;
    }
    const current = this._cartItems();
    const existing = current.find(line => line.itemId === itemId);
    if (existing) {
      this._cartItems.set(this.freezeArray(
        current.map(line => line.itemId === itemId ? { itemId, quantity: line.quantity + quantity } : line)
      ));
    } else {
      this._cartItems.set(this.freezeArray([...current, { itemId, quantity }]));
    }
  }

  public resetFilters(): void {
    this._filter.set('');
    this._selectedCategory.set('All');
    this._minPrice.set(null);
    this._maxPrice.set(null);
    this._inStockOnly.set(false);
    this._sortOrder.set('default');
  }

  private normalizePrice(value: number | null): number | null {
    return value !== null && Number.isFinite(value) && value >= 0 ? value : null;
  }

  /**
   * ReadonlySignal prevents .set/.update access, while a frozen snapshot also
   * prevents mutation through a collection returned by a signal invocation.
   */
  private freezeArray<T>(values: readonly T[]): readonly T[] {
    return Object.freeze([...values]);
  }
}


const initialItemRequestState: ItemRequestState = {
  items: Object.freeze([]),
  loading: true,
  error: null
};
