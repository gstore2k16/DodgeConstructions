import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';

/** Numeric stepper for picking a quantity within a min/max range, emitting `quantityChange` on every change. */
@Component({
  selector: 'app-quantity-selector',
  templateUrl: './quantity-selector.component.html',
  styleUrl: './quantity-selector.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuantitySelectorComponent {
  /** Current selected quantity value */
  public readonly quantity = input<number>(1);

  /** Minimum allowable quantity value (default 1) */
  public readonly min = input<number>(1);

  /** Maximum allowable quantity value (e.g. stock count) */
  public readonly max = input<number>(999);

  /** Event emitted when quantity changes */
  public readonly quantityChange = output<number>();

  public increment(): void {
    if (this.quantity() < this.max()) {
      this.quantityChange.emit(this.quantity() + 1);
    }
  }

  public decrement(): void {
    if (this.quantity() > this.min()) {
      this.quantityChange.emit(this.quantity() - 1);
    }
  }
}
