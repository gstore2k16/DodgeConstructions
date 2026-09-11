import { Component, input, effect, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemStateService } from '../../services/item-state.service';
import { ItemDetailViewComponent } from '../../components/item-detail-view/item-detail-view.component';
import { LoadingComponent } from '../../components/loading/loading.component';
import { ErrorComponent } from '../../components/error/error.component';

@Component({
    selector: 'app-item-detail',
    standalone: true,
    imports: [CommonModule, ItemDetailViewComponent, LoadingComponent, ErrorComponent],
    templateUrl: './item-detail.component.html',
    styleUrls: ['./item-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemDetailComponent {
    private readonly stateService = inject(ItemStateService);

    /** Route param :id bound reactively as a Signal input */
    public readonly id = input<string>();

    // Readonly signals exposed to template
    public readonly item = this.stateService.selectedItem;
    public readonly loading = this.stateService.loading;
    public readonly error = this.stateService.error;

    constructor() {
        // Declarative reactive signal effect
        effect(() => {
            const rawId = this.id();
            if (rawId) {
                const numericId = Number(rawId);
                this.stateService.selectItemById(isNaN(numericId) ? null : numericId);
            } else {
                this.stateService.selectItemById(null);
            }
        });
    }
}

