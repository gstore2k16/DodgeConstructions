import { Component, input, signal, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-image-zoom',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './image-zoom.component.html',
    styleUrls: ['./image-zoom.component.scss']
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

    /** Reference to native HTML dialog element */
    @ViewChild('zoomDialog') public dialogRef?: ElementRef<HTMLDialogElement>;

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
        if (this.dialogRef?.nativeElement) {
            this.modalZoom.set(1.2);
            if (!this.dialogRef.nativeElement.open) {
                this.dialogRef.nativeElement.showModal();
            }
        }
    }

    /**
     * Closes native top-layer full-screen dialog modal.
     */
    public closeModal(): void {
        if (this.dialogRef?.nativeElement?.open) {
            this.dialogRef.nativeElement.close();
        }
    }

    public zoomIn(): void {
        this.modalZoom.update((z: number) => Math.min(3.5, z + 0.4));
    }

    public zoomOut(): void {
        this.modalZoom.update((z: number) => Math.max(1.0, z - 0.4));
    }
}
