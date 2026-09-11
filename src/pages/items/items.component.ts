import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ItemStateService } from '../../services/item-state.service';
import { SortOption } from '../../components/item-filter/item-filter.component';
import { ItemGridComponent } from '../../components/item-grid/item-grid.component';
import { ItemFilterComponent } from '../../components/item-filter/item-filter.component';
import { LoadingComponent } from '../../components/loading/loading.component';
import { ErrorComponent } from '../../components/error/error.component';

@Component({
    selector: 'app-item-list',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ItemGridComponent,
        ItemFilterComponent,
        LoadingComponent,
        ErrorComponent
    ],
    templateUrl: './items.component.html',
    styleUrls: ['./items.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemsComponent {
    private readonly stateService = inject(ItemStateService);
    private readonly titleService = inject(Title);

    constructor() {
        this.titleService.setTitle('Products - DodgeConstructions');
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

    // Encapsulated state mutator actions
    public onSearchChange(val: string): void {
        this.stateService.setSearchFilter(val);
    }

    public onCategoryChange(val: string): void {
        this.stateService.setCategoryFilter(val);
    }

    public onMinPriceChange(val: number | null): void {
        this.stateService.setMinPrice(val);
    }

    public onMaxPriceChange(val: number | null): void {
        this.stateService.setMaxPrice(val);
    }

    public onInStockToggle(val: boolean): void {
        this.stateService.setInStockOnly(val);
    }

    public onSortChange(val: SortOption): void {
        this.stateService.setSortOrder(val);
    }

    public resetFilters(): void {
        this.stateService.resetFilters();
    }
}
