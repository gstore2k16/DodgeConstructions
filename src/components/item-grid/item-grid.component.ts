import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Item } from '../../models/item.model';
import { ItemCardComponent } from '../item-card/item-card.component';
import { ErrorComponent } from '../error/error.component';

@Component({
    selector: 'app-item-grid',
    standalone: true,
    imports: [CommonModule, ItemCardComponent, ErrorComponent],
    templateUrl: './item-grid.component.html',
    styleUrls: ['./item-grid.component.scss']
})
export class ItemGridComponent {
    /** The list of product items to display in the grid */
    public readonly items = input.required<Item[]>();
}
