import { Injector, signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { ErrorComponent } from './error.component';

describe('ErrorComponent (Jest)', () => {
  let component: ErrorComponent;

  beforeEach(() => {
    const injector = Injector.create({
      providers: [provideRouter([]), ErrorComponent],
    });
    component = injector.get(ErrorComponent);
    (component as any).message = signal('Initial error message');
  });

  it('should create error component instance', () => {
    expect(component).toBeTruthy();
  });

  it('should default showBackLink to false', () => {
    expect(component.showBackLink()).toBe(false);
  });

  it('should default backLinkText to "← Back to items"', () => {
    expect(component.backLinkText()).toBe('← Back to items');
  });

  it('should default backLinkRoute to "/items"', () => {
    expect(component.backLinkRoute()).toBe('/items');
  });

  it('should reflect the message once set', () => {
    (component as any).message = signal('Something went wrong.');
    expect(component.message()).toBe('Something went wrong.');
  });

  it('should reflect overridden showBackLink, backLinkText and backLinkRoute values', () => {
    (component as any).showBackLink = signal(true);
    (component as any).backLinkText = signal('Go home');
    (component as any).backLinkRoute = signal('/');

    expect(component.showBackLink()).toBe(true);
    expect(component.backLinkText()).toBe('Go home');
    expect(component.backLinkRoute()).toBe('/');
  });
});
