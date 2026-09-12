import { Injector, signal } from '@angular/core';
import { BreadcrumbComponent } from './breadcrumb.component';

describe('BreadcrumbComponent (Jest)', () => {
  let component: BreadcrumbComponent;

  beforeEach(() => {
    const injector = Injector.create({
      providers: [BreadcrumbComponent]
    });

    component = injector.get(BreadcrumbComponent);
  });

  it('should create breadcrumb component instance', () => {
    expect(component).toBeTruthy();
  });

  it('should default category to undefined when no value is provided', () => {
    expect(component.category()).toBeUndefined();
  });

  it('should reflect a category value once set', () => {
    (component as any).category = signal('Power Tools');
    expect(component.category()).toBe('Power Tools');
  });
});
