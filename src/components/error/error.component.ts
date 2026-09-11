import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-error',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './error.component.html',
    styleUrls: ['./error.component.scss']
})
export class ErrorComponent {
    /** Error message to display */
    public readonly message = input.required<string>();

    /** Whether to show a back navigation link */
    public readonly showBackLink = input<boolean>(false);

    /** Back link text */
    public readonly backLinkText = input<string>('← Back to items');

    /** Back link route path */
    public readonly backLinkRoute = input<string>('/items');
}
