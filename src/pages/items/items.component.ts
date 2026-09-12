import { Component, inject, effect, ChangeDetectionStrategy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { ItemStateService } from '../../services/item-state.service';
import { SortOption } from '../../models/item-filter.model';
import { ItemGridComponent } from '../../components/item-grid/item-grid.component';
import { ItemFilterComponent } from '../../components/item-filter/item-filter.component';
import { LoadingComponent } from '../../components/loading/loading.component';
import { ErrorComponent } from '../../components/error/error.component';
import { ProductCompareComponent } from '../../components/product-compare/product-compare.component';

/**
 * Main Product Listing Page component connecting reactive filter state to the grid UI.
 */
@Component({
  selector: 'app-item-list',
  imports: [
    ItemGridComponent,
    ItemFilterComponent,
    LoadingComponent,
    ErrorComponent,
    ProductCompareComponent
  ],
  templateUrl: './items.component.html',
  styleUrl: './items.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemsComponent {
  private readonly stateService = inject(ItemStateService);
  private readonly titleService = inject(Title);
  private readonly route = inject(ActivatedRoute);
  private readonly queryParams = toSignal(this.route.queryParamMap);

  constructor() {
    this.titleService.setTitle('Products - DodgeConstructions');

    // Keep URL-driven category state synchronized without a manual subscription.
    effect(() => {
      const params = this.queryParams();
      if (params) {
        this.stateService.setCategoryFilter(params.get('category') ?? 'All');
      }
    });
  }

  // Readonly signals exposed for template rendering
  public readonly loading = this.stateService.loading;
  public readonly error = this.stateService.error;
  public readonly filter = this.stateService.filter;
  public readonly selectedCategory = this.stateService.selectedCategory;
  public readonly minPrice = this.stateService.minPrice;
  public readonly maxPrice = this.stateService.maxPrice;
  public readonly inStockOnly = this.stateService.inStockOnly;
  public readonly sortOrder = this.stateService.sortOrder;
  public readonly categories = this.stateService.categories;
  public readonly filteredItems = this.stateService.filteredItems;

  /** Updates search text filter */
  public onSearchChange(val: string): void {
    this.stateService.setSearchFilter(val);
  }

  /** Updates category filter option */
  public onCategoryChange(val: string): void {
    this.stateService.setCategoryFilter(val);
  }

  /** Updates minimum price bound */
  public onMinPriceChange(val: number | null): void {
    this.stateService.setMinPrice(val);
  }

  /** Updates maximum price bound */
  public onMaxPriceChange(val: number | null): void {
    this.stateService.setMaxPrice(val);
  }

  /** Updates in-stock availability filter */
  public onInStockToggle(val: boolean): void {
    this.stateService.setInStockOnly(val);
  }

  /** Updates product sorting order */
  public onSortChange(val: SortOption): void {
    this.stateService.setSortOrder(val);
  }

  /** Resets all active filters */
  public resetFilters(): void {
    this.stateService.resetFilters();
  }
}
