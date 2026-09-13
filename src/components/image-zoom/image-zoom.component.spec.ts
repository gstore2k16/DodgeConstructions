import { Injector, signal } from '@angular/core';
import { ImageZoomComponent } from './image-zoom.component';

function makeMouseEvent(
  clientX: number,
  clientY: number,
  rect: { left: number; top: number; width: number; height: number },
): MouseEvent {
  const target = {
    getBoundingClientRect: () => rect,
  };
  return {
    clientX,
    clientY,
    currentTarget: target,
  } as unknown as MouseEvent;
}

describe('ImageZoomComponent (Jest)', () => {
  let component1: ImageZoomComponent;

  beforeEach(() => {
    const injector = Injector.create({
      providers: [ImageZoomComponent],
    });
    component = injector.get(ImageZoomComponent);
    (component as any).src = signal('/assets/test.jpg');
  });

  it('should create image zoom component instance', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default zoom levels and hover states', () => {
    expect(component.isHovered()).toBe(false);
    expect(component.modalZoom()).toBe(1.2);
    expect(component.zoomPosition()).toEqual({ x: 50, y: 50 });
  });

  it('should default alt text to "Product image"', () => {
    expect(component.alt()).toBe('Product image');
  });

  it('should compute the focal point percentage and set isHovered true on mouse move', () => {
    const event = makeMouseEvent(50, 25, { left: 0, top: 0, width: 100, height: 50 });
    component.onMouseMove(event);

    expect(component.zoomPosition()).toEqual({ x: 50, y: 50 });
    expect(component.isHovered()).toBe(true);
  });

  it('should clamp the focal point between 0 and 100 percent for out-of-bounds coordinates', () => {
    const belowEvent = makeMouseEvent(-20, -20, { left: 0, top: 0, width: 100, height: 100 });
    component.onMouseMove(belowEvent);
    expect(component.zoomPosition()).toEqual({ x: 0, y: 0 });

    const aboveEvent = makeMouseEvent(500, 500, { left: 0, top: 0, width: 100, height: 100 });
    component.onMouseMove(aboveEvent);
    expect(component.zoomPosition()).toEqual({ x: 100, y: 100 });
  });

  it('should reset isHovered to false on mouse leave', () => {
    component.onMouseLeave();
    expect(component.isHovered()).toBe(false);
  });

  it('should increase zoom level on zoomIn up to 3.5 max', () => {
    const initial = component.modalZoom();
    component.zoomIn();
    expect(component.modalZoom()).toBeGreaterThan(initial);

    for (let i = 0; i < 20; i++) {
      component.zoomIn();
    }
    expect(component.modalZoom()).toBe(3.5);
  });

  it('should decrease zoom level on zoomOut down to 1.0 min', () => {
    component.zoomOut();
    expect(component.modalZoom()).toBe(1.0);

    component.zoomOut();
    expect(component.modalZoom()).toBe(1.0);
  });

  describe('modal dialog control', () => {
    function mockDialog(open: boolean) {
      return {
        open,
        showModal: jest.fn(),
        close: jest.fn(),
      };
    }

    it('should reset modalZoom and open the dialog when it is not already open', () => {
      component.zoomIn();
      const dialog = mockDialog(false);
      (component as any).dialogRef = signal({ nativeElement: dialog });

      component.openModal();

      expect(dialog.showModal).toHaveBeenCalled();
      expect(component.modalZoom()).toBe(1.2);
    });

    it('should not call showModal again if the dialog is already open', () => {
      const dialog = mockDialog(true);
      (component as any).dialogRef = signal({ nativeElement: dialog });

      component.openModal();

      expect(dialog.showModal).not.toHaveBeenCalled();
    });

    it('should do nothing on openModal/closeModal when there is no dialog element', () => {
      (component as any).dialogRef = signal(undefined);
      component.openModal();
      component.closeModal();
      expect(component.modalZoom()).toBeDefined();
    });

    it('should close the dialog only when it is currently open', () => {
      const dialog = mockDialog(true);
      (component as any).dialogRef = signal({ nativeElement: dialog });

      component.closeModal();

      expect(dialog.close).toHaveBeenCalled();
    });

    it('should not call close when the dialog is already closed', () => {
      const dialog = mockDialog(false);
      (component as any).dialogRef = signal({ nativeElement: dialog });

      component.closeModal();

      expect(dialog.close).not.toHaveBeenCalled();
    });

    it('should close the dialog when the escape key handler fires', () => {
      const dialog = mockDialog(true);
      (component as any).dialogRef = signal({ nativeElement: dialog });

      component.onEscapeKey();

      expect(dialog.close).toHaveBeenCalled();
    });
  });
});
