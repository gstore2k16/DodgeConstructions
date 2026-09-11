import { Component, input, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ItemStateService } from '../../services/item-state.service';

/**
 * Reusable Breadcrumb navigation component supporting category link filtering.
 */
@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BreadcrumbComponent {
  private readonly stateService = inject(ItemStateService);

  /** The category name to display in the breadcrumb trail */
  public readonly category = input<string | undefined>();

  /**
   * Filters items page by category when category breadcrumb link is clicked
   */
  public onCategoryClick(cat: string | undefined): void {
    if (cat) {
      this.stateService.setCategoryFilter(cat);
    }
  }

  /**
   * Resets category filter to All when Items breadcrumb link is clicked
   */
  public onItemsClick(): void {
    this.stateService.setCategoryFilter('All');
  }
}
