import { Component, input, inject, computed, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Item } from '../../models/item.model';
import { ItemStateService } from '../../services/item-state.service';

/**
 * Component representing an individual product item card in the items grid.
 */
@Component({
  selector: 'app-item-card',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './item-card.component.html',
  styleUrls: ['./item-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemCardComponent {
  private readonly stateService = inject(ItemStateService);

  /** The product item model to render */
  public readonly item = input.required<Item>();

  /** Computed signal checking if this item is currently selected for comparison */
  public readonly isCompared = computed(() => this.stateService.compareIds().includes(this.item().id));

  /** Temporary alert indicator when user attempts to select more than 2 items */
  public readonly limitNotice = signal<boolean>(false);

  /**
   * Toggles product selection in comparison list.
   * Auto-unchecks input checkbox and shows temporary notice when limit is reached.
   */
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
