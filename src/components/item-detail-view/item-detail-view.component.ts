import { Component, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Item } from '../../models/item.model';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { QuantitySelectorComponent } from '../quantity-selector/quantity-selector.component';
import { ItemFeaturesComponent } from '../item-features/item-features.component';
import { ImageZoomComponent } from '../image-zoom/image-zoom.component';

@Component({
    selector: 'app-item-detail-view',
    standalone: true,
    imports: [
        CommonModule,
        BreadcrumbComponent,
        QuantitySelectorComponent,
        ItemFeaturesComponent,
        ImageZoomComponent
    ],
    templateUrl: './item-detail-view.component.html',
    styleUrls: ['./item-detail-view.component.scss']
})
export class ItemDetailViewComponent {
    /** The item object to render */
    public item = input.required<Item>();

    /** Quantity selected by user */
    public quantity = signal<number>(1);

    public onQuantityChange(newQuantity: number): void {
        this.quantity.set(newQuantity);
    }
}
