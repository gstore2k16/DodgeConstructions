import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

/** Generic inline error state: a message plus an optional link back to a working page. */
@Component({
  selector: 'app-error',
  imports: [RouterLink],
  templateUrl: './error.component.html',
  styleUrl: './error.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
