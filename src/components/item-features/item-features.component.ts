import { Component, input, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-item-features',
    templateUrl: './item-features.component.html',
    styleUrl: './item-features.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemFeaturesComponent {
    /** Array of feature bullet points to render under Product Details */
    public readonly features = input<readonly string[]>([]);
}
