import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Item } from '../../models/item.model';

@Component({
    selector: 'app-item-card',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './item-card.component.html',
    styleUrls: ['./item-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemCardComponent {
    /** The product item to render */
    public readonly item = input.required<Item>();
}
