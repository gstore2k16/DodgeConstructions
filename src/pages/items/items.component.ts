import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ItemService } from '../../services/item.service';
import { Item } from '../../models/item.model';
import { ItemGridComponent } from '../../components/item-grid/item-grid.component';
import { ItemFilterComponent, SortOption } from '../../components/item-filter/item-filter.component';

@Component({
    selector: 'app-item-list',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        RouterLink,
        ItemGridComponent,
        ItemFilterComponent
    ],
    templateUrl: './items.component.html',
    styleUrls: ['./items.component.scss']
})
export class ItemsComponent implements OnInit {
    /** All items loaded from the service */
    public items = signal<Item[]>([]);

    /** Whether data is currently loading */
    public loading = signal<boolean>(true);

    /** Error message if the fetch fails */
    public error = signal<string | null>(null);

    /** Text filter bound to the search input */
    public filter = signal<string>('');

    /** Selected category filter ('All' means no category filter) */
    public selectedCategory = signal<string>('All');

    /** Minimum price filter */
    public minPrice = signal<number | null>(null);

    /** Maximum price filter */
    public maxPrice = signal<number | null>(null);

    /** Toggle: show only in-stock items */
    public inStockOnly = signal<boolean>(false);

    /** Sort order option: 'default' | 'price-asc' | 'price-desc' */
    public sortOrder = signal<SortOption>('default');

    /** Dynamically computed unique list of categories from loaded items */
    public categories = computed<string[]>(() => {
        const all = this.items();
        const set = new Set<string>();
        all.forEach((item: Item) => set.add(item.category));
        return ['All', ...Array.from(set)];
    });

    /** Computed list of items after applying category, search, stock, price, and sorting */
    public filteredItems = computed<Item[]>(() => {
        let result = [...this.items()];
        const term = this.filter().toLowerCase().trim();
        const category = this.selectedCategory();
        const minP = this.minPrice();
        const maxP = this.maxPrice();
        const stockOnly = this.inStockOnly();
        const sort = this.sortOrder();

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

    constructor(private itemService: ItemService) {}

    ngOnInit(): void {
        this.loadItems();
    }

    /**
     * Fetches items from the service and updates component signals.
     */
    private loadItems(): void {
        this.loading.set(true);
        this.error.set(null);

        this.itemService.getItems().subscribe({
            next: (data: Item[]) => {
                this.items.set(data);
                this.loading.set(false);
            },
            error: (err: Error) => {
                this.error.set('Failed to load products. Please try again later.');
                this.loading.set(false);
                console.error('ItemService error:', err);
            }
        });
    }

    public onSearchChange(val: string): void {
        this.filter.set(val);
    }

    public onCategoryChange(val: string): void {
        this.selectedCategory.set(val);
    }

    public onMinPriceChange(val: number | null): void {
        this.minPrice.set(val);
    }

    public onMaxPriceChange(val: number | null): void {
        this.maxPrice.set(val);
    }

    public onInStockToggle(val: boolean): void {
        this.inStockOnly.set(val);
    }

    public onSortChange(val: SortOption): void {
        this.sortOrder.set(val);
    }

    public resetFilters(): void {
        this.filter.set('');
        this.selectedCategory.set('All');
        this.minPrice.set(null);
        this.maxPrice.set(null);
        this.inStockOnly.set(false);
        this.sortOrder.set('default');
    }
}
