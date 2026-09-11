import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
  standalone: true
})
export class TruncatePipe implements PipeTransform {
  /**
   * Truncates text to a specified maximum length with an optional ellipsis.
   * @param value Text to truncate
   * @param limit Maximum character count (default 60)
   * @param trail Trailing string appended when truncated (default '…')
   */
  transform(value: string | null | undefined, limit: number = 60, trail: string = '…'): string {
    if (!value) return '';
    if (value.length <= limit) return value;
    return value.substring(0, limit).trim() + trail;
  }
}
