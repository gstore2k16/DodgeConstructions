import { Component, input, ChangeDetectionStrategy } from '@angular/core';

/** Simple loading indicator with a customizable message, shown while data is being fetched. */
@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadingComponent {
  /** Custom loading message string */
  public readonly message = input<string>('Loading…');
}
