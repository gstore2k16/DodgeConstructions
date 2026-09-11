import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ItemService } from '../../services/item.service';
import { Item } from '../../models/item.model';

@Component({
    selector: 'app-item-list',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
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
    public filter = '';

    /** Toggle: show only in-stock items */
    public inStockOnly = false;

    /** Computed list of items filtered by name and stock status */
    public filteredItems = computed<Item[]>(() => {
        const allItems = this.items();
        const term = this.filter.toLowerCase().trim();
        const stockOnly = this.inStockOnly;

        return allItems.filter((item: Item) => {
            const matchesName: boolean = term === '' || item.name.toLowerCase().includes(term);
            const matchesStock: boolean = !stockOnly || item.inStock;
            return matchesName && matchesStock;
        });
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

    /**
     * Called on filter input or checkbox change to trigger re-computation.
     * Uses signals so the computed filteredItems updates automatically.
     */
    public onFilterChange(): void {
        // Trigger recompute by updating the items signal with itself.
        // The computed signal will pick up the new filter/inStockOnly values.
        this.items.update((current: Item[]) => [...current]);
    }
}
