import { Component, input, ChangeDetectionStrategy } from '@angular/core';

/** Renders a bullet list of product feature strings under "Product Details". */
@Component({
  selector: 'app-item-features',
  templateUrl: './item-features.component.html',
  styleUrl: './item-features.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemFeaturesComponent {
  /** Array of feature bullet points to render under Product Details */
  public readonly features = input<readonly string[]>([]);
}
