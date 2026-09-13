import { Injector, signal } from '@angular/core';
import { LoadingComponent } from './loading.component';

describe('LoadingComponent (Jest)', () => {
  let component: LoadingComponent;

  beforeEach(() => {
    const injector = Injector.create({
      providers: [LoadingComponent],
    });
    component = injector.get(LoadingComponent);
  });

  it('should create loading component instance', () => {
    expect(component).toBeTruthy();
  });

  it('should default message to "Loading…"', () => {
    expect(component.message()).toBe('Loading…');
  });

  it('should reflect a custom message once set', () => {
    (component as any).message = signal('Fetching products…');
    expect(component.message()).toBe('Fetching products…');
  });
});
