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
    public message = input.required<string>();

    /** Whether to show a back navigation link */
    public showBackLink = input<boolean>(false);

    /** Back link text */
    public backLinkText = input<string>('← Back to items');

    /** Back link route path */
    public backLinkRoute = input<string>('/items');
}
