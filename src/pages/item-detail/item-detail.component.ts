import { Component, input, effect, inject, ChangeDetectionStrategy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ItemStateService } from '../../services/item-state.service';
import { ItemDetailViewComponent } from '../../components/item-detail-view/item-detail-view.component';
import { LoadingComponent } from '../../components/loading/loading.component';
import { ErrorComponent } from '../../components/error/error.component';

/**
 * Item detail page. Resolves the route's :id to the selected item via
 * ItemStateService and keeps the browser tab title in sync with it.
 */
@Component({
  selector: 'app-item-detail',
  imports: [ItemDetailViewComponent, LoadingComponent, ErrorComponent],
  templateUrl: './item-detail.component.html',
  styleUrl: './item-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemDetailComponent {
  private readonly stateService = inject(ItemStateService);
  private readonly titleService = inject(Title);

  /** Route param :id bound reactively as a Signal input */
  public readonly id = input<string>();

  // Readonly signals exposed to template
  public readonly item = this.stateService.selectedItem;
  public readonly loading = this.stateService.loading;
  public readonly error = this.stateService.error;

  constructor() {
    // Declarative reactive signal effect
    effect(() => {
      const rawId = this.id();
      if (rawId) {
        const numericId = Number(rawId);
        this.stateService.selectItemById(isNaN(numericId) ? null : numericId);
      } else {
        this.stateService.selectItemById(null);
      }
    });

    // Dynamic page title update for SEO & Product UX
    effect(() => {
      const currentItem = this.item();
      const isDoneLoading = !this.loading();
      if (currentItem) {
        this.titleService.setTitle(`${currentItem.name} - DodgeConstructions`);
      } else if (isDoneLoading) {
        this.titleService.setTitle('Product Not Found - DodgeConstructions');
      }
    });
  }
}
