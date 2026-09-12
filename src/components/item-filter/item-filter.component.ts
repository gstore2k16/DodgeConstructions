import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { outputFromObservable } from '@angular/core/rxjs-interop';
import { ErrorComponent } from '../error/error.component';
import { SortOption } from '../../models/item-filter.model';

/**
 * Reusable Filter & Sorting controls component with debounced search stream.
 */
@Component({
  selector: 'app-item-filter',
  imports: [
    FormsModule,
    ErrorComponent
  ],
  templateUrl: './item-filter.component.html',
  styleUrl: './item-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemFilterComponent {
  private readonly searchSubject$ = new Subject<string>();

  /** List of category options */
  public readonly categories = input<readonly string[]>(['All']);

  /** Search text value */
  public readonly searchTerm = input<string>('');

  /** Selected category filter option */
  public readonly selectedCategory = input<string>('All');

  /** Minimum price bound filter */
  public readonly minPrice = input<number | null>(null);

  /** Maximum price bound filter */
  public readonly maxPrice = input<number | null>(null);

  /** In-stock filter checkbox toggle */
  public readonly inStockOnly = input<boolean>(false);

  /** Current sort order option */
  public readonly sortOrder = input<SortOption>('default');

  /** Outputs for filter state mutations */
  /** Debounced search output; Angular owns the observable subscription lifecycle. */
  public readonly searchTermChange = outputFromObservable(
    this.searchSubject$.pipe(
      debounceTime(100),
      distinctUntilChanged()
    )
  );
  public readonly categoryChange = output<string>();
  public readonly minPriceChange = output<number | null>();
  public readonly maxPriceChange = output<number | null>();
  public readonly inStockChange = output<boolean>();
  public readonly sortOrderChange = output<SortOption>();
  public readonly reset = output<void>();

  /**
   * Pushes user keystrokes into search stream
   */
  public onSearchInput(val: string): void {
    this.searchSubject$.next(val);
  }

  /**
   * Emits category filter change event
   */
  public onCategorySelect(val: string): void {
    this.categoryChange.emit(val);
  }

  /**
   * Emits minimum price bound change event
   */
  public onMinInput(val: number | null): void {
    this.minPriceChange.emit(val);
  }

  /**
   * Emits maximum price bound change event
   */
  public onMaxInput(val: number | null): void {
    this.maxPriceChange.emit(val);
  }

  /**
   * Emits stock availability toggle change event
   */
  public onStockToggle(val: boolean): void {
    this.inStockChange.emit(val);
  }

  /**
   * Emits sorting order change event
   */
  public onSortSelect(val: string): void {
    this.sortOrderChange.emit(val as SortOption);
  }

  /**
   * Emits reset event to clear all active filters
   */
  public onResetClick(): void {
    this.searchSubject$.next('');
    this.reset.emit();
  }
}
