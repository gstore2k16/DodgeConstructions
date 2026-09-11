import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ItemService } from '../../services/item.service';
import { Item } from '../../models/item.model';

@Component({
    selector: 'app-item-detail',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './item-detail.component.html',
    styleUrls: ['./item-detail.component.scss']
})
export class ItemDetailComponent implements OnInit {
    /** The loaded item */
    public item = signal<Item | undefined>(undefined);

    /** Whether data is currently loading */
    public loading = signal<boolean>(true);

    /** Error message if fetch fails */
    public error = signal<string | null>(null);

    /** Quantity selected by the user */
    public quantity = signal<number>(1);

    constructor(
        private route: ActivatedRoute,
        private itemService: ItemService
    ) {}

    ngOnInit(): void {
        const idParam: string | null = this.route.snapshot.paramMap.get('id');
        if (idParam) {
            const id: number = Number(idParam);
            this.loadItem(id);
        } else {
            this.error.set('No item ID provided.');
            this.loading.set(false);
        }
    }

    /**
     * Fetches the item by ID from the service.
     */
    private loadItem(id: number): void {
        this.loading.set(true);
        this.error.set(null);

        this.itemService.getItemById(id).subscribe({
            next: (data: Item | undefined) => {
                if (data) {
                    this.item.set(data);
                    this.quantity.set(1);
                } else {
                    this.error.set('Item not found.');
                }
                this.loading.set(false);
            },
            error: (err: Error) => {
                this.error.set('Failed to load item details. Please try again.');
                this.loading.set(false);
                console.error('ItemService error:', err);
            }
        });
    }

    /**
     * Increases the quantity by 1, capped at the available stock count.
     */
    public incrementQuantity(): void {
        const current: number = this.quantity();
        const max: number = this.item()?.stockCount ?? 1;
        if (current < max) {
            this.quantity.set(current + 1);
        }
    }

    /**
     * Decreases the quantity by 1, minimum 1.
     */
    public decrementQuantity(): void {
        const current: number = this.quantity();
        if (current > 1) {
            this.quantity.set(current - 1);
        }
    }
}
