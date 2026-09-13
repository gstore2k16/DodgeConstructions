import {
  Component,
  input,
  signal,
  viewChild,
  ElementRef,
  ChangeDetectionStrategy,
} from '@angular/core';

@Component({
  selector: 'app-image-zoom',
  templateUrl: './image-zoom.component.html',
  styleUrl: './image-zoom.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(window:keydown.escape)': 'onEscapeKey()',
  },
})
export class ImageZoomComponent {
  /** Image source URL */
  public readonly src = input.required<string>();

  /** Image alt text */
  public readonly alt = input<string>('Product image');

  /** Signal tracking whether hover zoom is active */
  public readonly isHovered = signal<boolean>(false);

  /** Signal tracking focal point percentage for hover zoom (0-100%) */
  public readonly zoomPosition = signal<{ x: number; y: number }>({ x: 50, y: 50 });

  /** Signal tracking full-screen modal zoom level (1.0 to 3.5x) */
  public readonly modalZoom = signal<number>(1.2);

  /** Signal reference to native HTML dialog element */
  public readonly dialogRef = viewChild<ElementRef<HTMLDialogElement>>('zoomDialog');

  /**
   * Mouse move handler over main image to calculate focal origin.
   */
  public onMouseMove(event: MouseEvent): void {
    const target = event.currentTarget as HTMLElement;
    if (!target) return;

    const rect: DOMRect = target.getBoundingClientRect();
    const x: number = Math.max(0, Math.min(100, ((event.clientX - rect.left) / rect.width) * 100));
    const y: number = Math.max(0, Math.min(100, ((event.clientY - rect.top) / rect.height) * 100));

    this.zoomPosition.set({ x, y });
    this.isHovered.set(true);
  }

  public onMouseLeave(): void {
    this.isHovered.set(false);
  }

  /**
   * Opens native top-layer full-screen dialog modal.
   */
  public openModal(): void {
    const dialog = this.dialogRef()?.nativeElement;
    if (dialog) {
      this.modalZoom.set(1.2);
      if (!dialog.open) {
        dialog.showModal();
      }
    }
  }

  /**
   * Closes native top-layer full-screen dialog modal.
   */
  public closeModal(): void {
    const dialog = this.dialogRef()?.nativeElement;
    if (dialog?.open) {
      dialog.close();
    }
  }

  public onEscapeKey(): void {
    this.closeModal();
  }

  public zoomIn(): void {
    this.modalZoom.update((z: number) => Math.min(3.5, z + 0.4));
  }

  public zoomOut(): void {
    this.modalZoom.update((z: number) => Math.max(1.0, z - 0.4));
  }
}
