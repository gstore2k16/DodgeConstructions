import { Component, input, output, inject, DestroyRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ErrorComponent } from '../error/error.component';

export type SortOption = 'default' | 'price-asc' | 'price-desc';

@Component({
    selector: 'app-item-filter',
    standalone: true,
    imports: [CommonModule, FormsModule, ErrorComponent],
    templateUrl: './item-filter.component.html',
    styleUrls: ['./item-filter.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemFilterComponent {
    private readonly destroyRef = inject(DestroyRef);
    private readonly searchSubject$ = new Subject<string>();
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

    constructor() {
        this.searchSubject$.pipe(
            debounceTime(20),
            distinctUntilChanged(),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe((term: string) => {
            this.searchTermChange.emit(term);
        });
    }

    public onSearchInput(val: string): void {
        this.searchSubject$.next(val);
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
        this.searchSubject$.next('');
        this.reset.emit();
    }
}
