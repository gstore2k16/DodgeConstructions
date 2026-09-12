import { Component, input, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Item } from '../../models/item.model';
import { ItemStateService } from '../../services/item-state.service';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { QuantitySelectorComponent } from '../quantity-selector/quantity-selector.component';
import { ItemFeaturesComponent } from '../item-features/item-features.component';
import { ImageZoomComponent } from '../image-zoom/image-zoom.component';
import { ErrorComponent } from '../error/error.component';

@Component({
    selector: 'app-item-detail-view',
    imports: [
        CurrencyPipe,
        BreadcrumbComponent,
        QuantitySelectorComponent,
        ItemFeaturesComponent,
        ImageZoomComponent,
        ErrorComponent
    ],
    templateUrl: './item-detail-view.component.html',
    styleUrl: './item-detail-view.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemDetailViewComponent {
    private readonly stateService = inject(ItemStateService);

    /** The item object to render */
    public readonly item = input.required<Item>();

    /** Quantity selected by user */
    public readonly quantity = signal<number>(1);

    /** Transient confirmation flag shown on the Add to Cart button after a successful add */
    public readonly addedToCart = signal<boolean>(false);

    public onQuantityChange(newQuantity: number): void {
        this.quantity.set(newQuantity);
    }

    /**
     * Adds the current quantity of this item to the cart and shows a brief
     * confirmation on the button so the click has a visible, honest result.
     */
    public onAddToCart(): void {
        this.stateService.addToCart(this.item().id, this.quantity());
        this.quantity.set(1);
        this.addedToCart.set(true);
        setTimeout(() => this.addedToCart.set(false), 2000);
    }
}
