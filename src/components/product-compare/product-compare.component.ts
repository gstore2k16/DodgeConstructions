import { Component, inject, viewChild, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ItemStateService } from '../../services/item-state.service';
import { PriceDifferencePipe } from '../../pipes/price-difference.pipe';
import { StockStatusPipe } from '../../pipes/stock-status.pipe';

/**
 * Component managing the side-by-side product comparison bar and native dialog modal matrix.
 */
@Component({
  selector: 'app-product-compare',
  imports: [RouterLink, CurrencyPipe, PriceDifferencePipe, StockStatusPipe],
  templateUrl: './product-compare.component.html',
  styleUrl: './product-compare.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCompareComponent {
  private readonly stateService = inject(ItemStateService);

  /** Computed list of selected products for comparison */
  public readonly comparedItems = this.stateService.comparedItems;

  /** Reference to the native comparison <dialog> element */
  public readonly dialogRef = viewChild<ElementRef<HTMLDialogElement>>('compareDialog');

  /**
   * Removes a single product from comparison list by ID.
   */
  public remove(id: number): void {
    this.stateService.removeCompare(id);
  }

  /**
   * Clears all selected products from comparison.
   */
  public clearAll(): void {
    this.stateService.clearCompare();
  }

  /**
   * Opens the comparison modal matrix dialog on the browser top-layer.
   */
  public openModal(): void {
    const dialog = this.dialogRef()?.nativeElement;
    if (dialog && !dialog.open) {
      dialog.showModal();
    }
  }

  /**
   * Closes the comparison modal dialog.
   */
  public closeModal(): void {
    const dialog = this.dialogRef()?.nativeElement;
    if (dialog?.open) {
      dialog.close();
    }
  }
}
