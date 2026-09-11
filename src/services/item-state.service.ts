import { Injectable, inject, signal, computed, DestroyRef, effect } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Item } from '../models/item.model';
import { ItemService } from './item.service';
import { SortOption } from '../components/item-filter/item-filter.component';

/**
 * Interface representing the complete application state slice for Items.
 */
export interface ItemState {
  items: Item[];
  loading: boolean;
  error: string | null;
  filter: string;
  selectedCategory: string;
  minPrice: number | null;
  maxPrice: number | null;
  inStockOnly: boolean;
  sortOrder: SortOption;
  selectedItemId: number | null;
  compareIds: number[];
}

/**
 * Initial default state configuration
 */
const INITIAL_STATE: ItemState = {
  items: [],
  loading: true,
  error: null,
  filter: '',
  selectedCategory: 'All',
  minPrice: null,
  maxPrice: null,
  inStockOnly: false,
  sortOrder: 'default',
  selectedItemId: null,
  compareIds: []
};

const STORAGE_KEY = 'dodge_constructions_item_state_v1';
const MAX_HISTORY_LENGTH = 30;

@Injectable({
  providedIn: 'root'
})
export class ItemStateService {
  private readonly itemService = inject(ItemService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  private loadSub?: Subscription;

  // Single source of truth state signal (Unified Reactive State)
  private readonly _state = signal<ItemState>(this.getInitialStateWithPersistence());

  // Time-Travel History Buffers (Undo / Redo support)
  private readonly _history = signal<ItemState[]>([this._state()]);
  private readonly _historyIndex = signal<number>(0);
  private isTimeTraveling = false;

  // Fine-Grained Readonly Signal Selectors
  public readonly state = this._state.asReadonly();
  public readonly items = computed(() => this._state().items);
  public readonly loading = computed(() => this._state().loading);
  public readonly error = computed(() => this._state().error);
  public readonly filter = computed(() => this._state().filter);
  public readonly selectedCategory = computed(() => this._state().selectedCategory);
  public readonly minPrice = computed(() => this._state().minPrice);
  public readonly maxPrice = computed(() => this._state().maxPrice);
  public readonly inStockOnly = computed(() => this._state().inStockOnly);
  public readonly sortOrder = computed(() => this._state().sortOrder);
  public readonly selectedItemId = computed(() => this._state().selectedItemId);
  public readonly compareIds = computed(() => this._state().compareIds);

  // Advanced Computed Selectors & Analytics
  public readonly totalCount = computed(() => this._state().items.length);
  
  public readonly categories = computed<string[]>(() => {
    const all = this._state().items;
    const set = new Set<string>();
    all.forEach((item: Item) => set.add(item.category));
    return ['All', ...Array.from(set)];
  });

  public readonly comparedItems = computed<Item[]>(() => {
    const ids = this._state().compareIds;
    const all = this._state().items;
    return ids.map(id => all.find(item => item.id === id)).filter((item): item is Item => !!item);
  });

  public readonly filteredItems = computed<Item[]>(() => {
    const currentState = this._state();
    let result = [...currentState.items];
    const term = currentState.filter.toLowerCase().trim();
    const category = currentState.selectedCategory;
    const minP = currentState.minPrice;
    const maxP = currentState.maxPrice;
    const stockOnly = currentState.inStockOnly;
    const sort = currentState.sortOrder;

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

  public readonly filteredCount = computed(() => this.filteredItems().length);

  public readonly selectedItem = computed<Item | undefined>(() => {
    const id = this._state().selectedItemId;
    if (id === null) return undefined;
    return this._state().items.find((item: Item) => item.id === id);
  });

  // Calculate active filter count for badge indicator
  public readonly activeFilterCount = computed<number>(() => {
    const s = this._state();
    let count = 0;
    if (s.filter.trim()) count++;
    if (s.selectedCategory !== 'All') count++;
    if (s.minPrice !== null) count++;
    if (s.maxPrice !== null) count++;
    if (s.inStockOnly) count++;
    if (s.sortOrder !== 'default') count++;
    return count;
  });

  // Time-travel state capabilities
  public readonly canUndo = computed(() => this._historyIndex() > 0);
  public readonly canRedo = computed(() => this._historyIndex() < this._history().length - 1);

  constructor() {
    this.loadItems();

    // Effect: Synchronize state to LocalStorage
    effect(() => {
      const currentState = this._state();
      this.persistState(currentState);
    });

    // Effect: Synchronize active filters with URL query parameters for deep-linking
    effect(() => {
      const currentState = this._state();
      this.syncUrlParams(currentState);
    });
  }

  /**
   * Atomic State Mutator Engine (Patching partial state with action logging)
   */
  public patchState(partial: Partial<ItemState>, actionName: string = 'PATCH_STATE'): void {
    const previousState = this._state();
    const nextState = { ...previousState, ...partial };

    this._state.set(nextState);

    if (!this.isTimeTraveling) {
      const history = this._history().slice(0, this._historyIndex() + 1);
      if (history.length >= MAX_HISTORY_LENGTH) {
        history.shift();
      }
      history.push(nextState);
      this._history.set(history);
      this._historyIndex.set(history.length - 1);
    }

    this.logAction(actionName, previousState, partial, nextState);
  }

  /**
   * Time-Travel: Undo previous state change
   */
  public undo(): void {
    if (!this.canUndo()) return;
    this.isTimeTraveling = true;
    const newIndex = this._historyIndex() - 1;
    this._historyIndex.set(newIndex);
    this.patchState(this._history()[newIndex], 'UNDO');
    this.isTimeTraveling = false;
  }

  /**
   * Time-Travel: Redo next state change
   */
  public redo(): void {
    if (!this.canRedo()) return;
    this.isTimeTraveling = true;
    const newIndex = this._historyIndex() + 1;
    this._historyIndex.set(newIndex);
    this.patchState(this._history()[newIndex], 'REDO');
    this.isTimeTraveling = false;
  }

  /**
   * Fetches products from ItemService and updates state signals.
   */
  public loadItems(): void {
    if (this._state().items.length > 0 && !this._state().error) {
      this.patchState({ loading: false }, 'LOAD_ITEMS_CACHED');
      return;
    }

    this.loadSub?.unsubscribe();
    this.patchState({ loading: true, error: null }, 'LOAD_ITEMS_START');

    this.loadSub = this.itemService.getItems().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (data: Item[]) => {
        this.patchState({ items: data, loading: false }, 'LOAD_ITEMS_SUCCESS');
      },
      error: (err: Error) => {
        this.patchState({
          error: 'Failed to load products. Please try again later.',
          loading: false
        }, 'LOAD_ITEMS_ERROR');
      }
    });
  }

  // Encapsulated Business Actions
  public setSearchFilter(term: string): void {
    this.patchState({ filter: term }, 'SET_SEARCH_FILTER');
  }

  public setCategoryFilter(category: string): void {
    this.patchState({ selectedCategory: category }, 'SET_CATEGORY_FILTER');
  }

  public setMinPrice(min: number | null): void {
    this.patchState({ minPrice: min }, 'SET_MIN_PRICE');
  }

  public setMaxPrice(max: number | null): void {
    this.patchState({ maxPrice: max }, 'SET_MAX_PRICE');
  }

  public setInStockOnly(inStock: boolean): void {
    this.patchState({ inStockOnly: inStock }, 'SET_INSTOCK_ONLY');
  }

  public setSortOrder(sort: SortOption): void {
    this.patchState({ sortOrder: sort }, 'SET_SORT_ORDER');
  }

  public selectItemById(id: number | null): void {
    this.patchState({ selectedItemId: id }, 'SELECT_ITEM_BY_ID');
  }

  public toggleCompare(id: number): boolean {
    const current = this._state().compareIds;
    if (current.includes(id)) {
      this.patchState({ compareIds: current.filter(i => i !== id) }, 'REMOVE_COMPARE');
      return true;
    }
    if (current.length >= 2) {
      return false; // Limit reached (Max 2 products allowed for comparison)
    }
    this.patchState({ compareIds: [...current, id] }, 'ADD_COMPARE');
    return true;
  }

  public removeCompare(id: number): void {
    this.patchState({
      compareIds: this._state().compareIds.filter(i => i !== id)
    }, 'REMOVE_COMPARE');
  }

  public clearCompare(): void {
    this.patchState({ compareIds: [] }, 'CLEAR_COMPARE');
  }

  public resetFilters(): void {
    this.patchState({
      filter: '',
      selectedCategory: 'All',
      minPrice: null,
      maxPrice: null,
      inStockOnly: false,
      sortOrder: 'default'
    }, 'RESET_FILTERS');
  }

  // Internal Helpers: Persistence & URL Sync
  private getInitialStateWithPersistence(): ItemState {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...INITIAL_STATE,
          filter: parsed.filter ?? '',
          selectedCategory: parsed.selectedCategory ?? 'All',
          minPrice: parsed.minPrice ?? null,
          maxPrice: parsed.maxPrice ?? null,
          inStockOnly: parsed.inStockOnly ?? false,
          sortOrder: parsed.sortOrder ?? 'default',
          compareIds: Array.isArray(parsed.compareIds) ? parsed.compareIds : []
        };
      }
    } catch {
      // Fallback to initial state on error or SSR
    }
    return INITIAL_STATE;
  }

  private persistState(state: ItemState): void {
    try {
      const payload = {
        filter: state.filter,
        selectedCategory: state.selectedCategory,
        minPrice: state.minPrice,
        maxPrice: state.maxPrice,
        inStockOnly: state.inStockOnly,
        sortOrder: state.sortOrder,
        compareIds: state.compareIds
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Ignore storage errors
    }
  }

  private syncUrlParams(state: ItemState): void {
    // Only sync query params when on /items page
    if (!this.router.url.startsWith('/items')) return;

    const queryParams: Record<string, string | number | boolean | null> = {
      category: state.selectedCategory !== 'All' ? state.selectedCategory : null,
      search: state.filter.trim() ? state.filter.trim() : null,
      minPrice: state.minPrice,
      maxPrice: state.maxPrice,
      inStock: state.inStockOnly ? true : null,
      sort: state.sortOrder !== 'default' ? state.sortOrder : null
    };

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge',
      replaceUrl: true
    }).catch(() => {});
  }

  private logAction(action: string, prev: ItemState, patch: Partial<ItemState>, next: ItemState): void {
    if (typeof console !== 'undefined' && console.groupCollapsed) {
      console.groupCollapsed(`%c[STORE ACTION]: ${action}`, 'color: #3b82f6; font-weight: bold;');
      console.log('%cPrevious State:', 'color: #94a3b8;', prev);
      console.log('%cPayload Patch:', 'color: #f59e0b;', patch);
      console.log('%cNext State:', 'color: #10b981;', next);
      console.groupEnd();
    }
  }
}
