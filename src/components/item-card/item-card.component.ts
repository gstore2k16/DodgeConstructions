import { Component, input, inject, computed, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Item } from '../../models/item.model';
import { ItemStateService } from '../../services/item-state.service';
import { StockStatusPipe } from '../../pipes/stock-status.pipe';
import { TruncatePipe } from '../../pipes/truncate.pipe';

@Component({
    selector: 'app-item-card',
    standalone: true,
    imports: [CommonModule, RouterLink, StockStatusPipe, TruncatePipe],
    templateUrl: './item-card.component.html',
    styleUrls: ['./item-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemCardComponent {
    private readonly stateService = inject(ItemStateService);

    /** The product item to render */
    public readonly item = input.required<Item>();

    /** Computed signal checking if this item is selected for comparison */
    public readonly isCompared = computed(() => this.stateService.compareIds().includes(this.item().id));

    /** Temporary alert if user tries to compare > 2 products */
    public readonly limitNotice = signal<boolean>(false);

    public onCompareToggle(event: Event): void {
        event.stopPropagation();
        const checkbox = event.target as HTMLInputElement;
        const success = this.stateService.toggleCompare(this.item().id);
        if (!success) {
            if (checkbox) {
                checkbox.checked = false;
            }
            this.limitNotice.set(true);
            setTimeout(() => this.limitNotice.set(false), 3500);
        }
    }
}
