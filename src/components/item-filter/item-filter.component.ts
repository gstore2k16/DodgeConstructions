import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export type SortOption = 'default' | 'price-asc' | 'price-desc';

@Component({
    selector: 'app-item-filter',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './item-filter.component.html',
    styleUrls: ['./item-filter.component.scss']
})
export class ItemFilterComponent {
    /** List of category options */
    public readonly categories = input<string[]>(['All']);

    /** Search text value */
    public readonly searchTerm = input<string>('');

    /** Selected category filter */
    public readonly selectedCategory = input<string>('All');

    /** Minimum price limit */
    public readonly minPrice = input<number | null>(null);

    /** Maximum price limit */
    public readonly maxPrice = input<number | null>(null);

    /** In-stock filter checkbox toggle */
    public readonly inStockOnly = input<boolean>(false);

    /** Current sort order option */
    public readonly sortOrder = input<SortOption>('default');

    /** Outputs for filter state changes */
    public readonly searchTermChange = output<string>();
    public readonly categoryChange = output<string>();
    public readonly minPriceChange = output<number | null>();
    public readonly maxPriceChange = output<number | null>();
    public readonly inStockChange = output<boolean>();
    public readonly sortOrderChange = output<SortOption>();
    public readonly reset = output<void>();

    public onSearchInput(val: string): void {
        this.searchTermChange.emit(val);
    }

    public onCategorySelect(val: string): void {
        this.categoryChange.emit(val);
    }

    public onMinInput(val: number | null): void {
        this.minPriceChange.emit(val !== null && val !== undefined && val >= 0 ? val : null);
    }

    public onMaxInput(val: number | null): void {
        this.maxPriceChange.emit(val !== null && val !== undefined && val >= 0 ? val : null);
    }

    public onStockToggle(val: boolean): void {
        this.inStockChange.emit(val);
    }

    public onSortSelect(val: string): void {
        this.sortOrderChange.emit(val as SortOption);
    }

    public onResetClick(): void {
        this.reset.emit();
    }
}
