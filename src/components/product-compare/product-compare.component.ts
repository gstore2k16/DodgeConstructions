import { Component, inject, signal, viewChild, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ItemStateService } from '../../services/item-state.service';
import { Item } from '../../models/item.model';

@Component({
    selector: 'app-product-compare',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './product-compare.component.html',
    styleUrls: ['./product-compare.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCompareComponent {
    private readonly stateService = inject(ItemStateService);

    public readonly comparedItems = this.stateService.comparedItems;
    public readonly dialogRef = viewChild<ElementRef<HTMLDialogElement>>('compareDialog');

    public remove(id: number): void {
        this.stateService.removeCompare(id);
    }

    public clearAll(): void {
        this.stateService.clearCompare();
    }

    public openModal(): void {
        const dialog = this.dialogRef()?.nativeElement;
        if (dialog && !dialog.open) {
            dialog.showModal();
        }
    }

    public closeModal(): void {
        const dialog = this.dialogRef()?.nativeElement;
        if (dialog?.open) {
            dialog.close();
        }
    }

    /**
     * Calculates absolute price difference between 2 items.
     */
    public getPriceDifference(item1: Item, item2: Item): number {
        return Math.abs(item1.price - item2.price);
    }

    /**
     * Returns name of the cheaper item.
     */
    public getCheaperItemName(item1: Item, item2: Item): string {
        if (item1.price < item2.price) return item1.name;
        if (item2.price < item1.price) return item2.name;
        return 'Both have equal price';
    }
}
