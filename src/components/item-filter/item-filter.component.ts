import { Component, input, output, inject, DestroyRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ErrorComponent } from '../error/error.component';
import { SortOption } from '../../models/item-filter.model';

/**
 * Reusable Filter & Sorting controls component with debounced search stream.
 */
@Component({
  selector: 'app-item-filter',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ErrorComponent
  ],
  templateUrl: './item-filter.component.html',
  styleUrls: ['./item-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemFilterComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly searchSubject$ = new Subject<string>();

  /** List of category options */
  public readonly categories = input<string[]>(['All']);

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
  public readonly searchTermChange = output<string>();
  public readonly categoryChange = output<string>();
  public readonly minPriceChange = output<number | null>();
  public readonly maxPriceChange = output<number | null>();
  public readonly inStockChange = output<boolean>();
  public readonly sortOrderChange = output<SortOption>();
  public readonly reset = output<void>();

  constructor() {
    // Pipe search inputs through debounceTime and distinctUntilChanged for optimal UI performance
    this.searchSubject$.pipe(
      debounceTime(100),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((term: string) => {
      this.searchTermChange.emit(term);
    });
  }

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
