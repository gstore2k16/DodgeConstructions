import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { Item } from '../../models/item.model';
import { ItemCardComponent } from '../item-card/item-card.component';
import { ErrorComponent } from '../error/error.component';

/** Renders a responsive grid of item cards, or an error state if the list is empty/failed to load. */
@Component({
  selector: 'app-item-grid',
  imports: [ItemCardComponent, ErrorComponent],
  templateUrl: './item-grid.component.html',
  styleUrl: './item-grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemGridComponent {
  /** The list of product items to display in the grid */
  public readonly items = input.required<readonly Item[]>();
}
