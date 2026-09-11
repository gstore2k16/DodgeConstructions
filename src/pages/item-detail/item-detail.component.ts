import { Component, OnInit, signal, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ItemService } from '../../services/item.service';
import { Item } from '../../models/item.model';
import { ItemDetailViewComponent } from '../../components/item-detail-view/item-detail-view.component';
import { LoadingComponent } from '../../components/loading/loading.component';
import { ErrorComponent } from '../../components/error/error.component';

@Component({
    selector: 'app-item-detail',
    standalone: true,
    imports: [CommonModule, ItemDetailViewComponent, LoadingComponent, ErrorComponent],
    templateUrl: './item-detail.component.html',
    styleUrls: ['./item-detail.component.scss']
})
export class ItemDetailComponent implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly itemService = inject(ItemService);
    private readonly destroyRef = inject(DestroyRef);

    /** The loaded item */
    public readonly item = signal<Item | undefined>(undefined);

    /** Whether data is currently loading */
    public readonly loading = signal<boolean>(true);

    /** Error message if fetch fails */
    public readonly error = signal<string | null>(null);

    ngOnInit(): void {
        this.route.paramMap.pipe(
            takeUntilDestroyed(this.destroyRef)
        ).subscribe((params: ParamMap) => {
            const idParam: string | null = params.get('id');
            if (idParam) {
                const id: number = Number(idParam);
                this.loadItem(id);
            } else {
                this.error.set('No item ID provided.');
                this.loading.set(false);
            }
        });
    }

    /**
     * Fetches the item by ID from the service.
     */
    private loadItem(id: number): void {
        this.loading.set(true);
        this.error.set(null);

        this.itemService.getItemById(id).pipe(
            takeUntilDestroyed(this.destroyRef)
        ).subscribe({
            next: (data: Item | undefined) => {
                if (data) {
                    this.item.set(data);
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
}
