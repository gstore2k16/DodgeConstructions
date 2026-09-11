import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-item-features',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './item-features.component.html',
    styleUrls: ['./item-features.component.scss']
})
export class ItemFeaturesComponent {
    /** Array of feature bullet points to render under Product Details */
    public features = input<string[]>([]);
}
