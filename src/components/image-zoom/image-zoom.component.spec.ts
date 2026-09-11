import { Injector } from '@angular/core';
import { ImageZoomComponent } from './image-zoom.component';

describe('ImageZoomComponent (Jest)', () => {
  let component: ImageZoomComponent;

  beforeEach(() => {
    const injector = Injector.create({ providers: [ImageZoomComponent] });
    component = injector.get(ImageZoomComponent);
  });

  it('should create image zoom component instance', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default zoom levels and hover states', () => {
    expect(component.isHovered()).toBe(false);
    expect(component.modalZoom()).toBe(1.2);
    expect(component.zoomPosition()).toEqual({ x: 50, y: 50 });
  });

  it('should reset isHovered to false on mouse leave', () => {
    component.onMouseLeave();
    expect(component.isHovered()).toBe(false);
  });

  it('should increase zoom level on zoomIn up to 3.5 max', () => {
    const initial = component.modalZoom();
    component.zoomIn();
    expect(component.modalZoom()).toBeGreaterThan(initial);
  });

  it('should decrease zoom level on zoomOut down to 1.0 min', () => {
    component.zoomOut();
    expect(component.modalZoom()).toBe(1.0);
  });
});
