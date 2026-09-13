import { Injector } from '@angular/core';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app.component';

describe('AppComponent (Jest)', () => {
  let component: AppComponent;

  beforeEach(() => {
    const injector = Injector.create({
      providers: [provideRouter([]), AppComponent],
    });
    component = injector.get(AppComponent);
  });

  it('should create the app component instance', () => {
    expect(component).toBeTruthy();
  });

  it('should have title initialized to "DCC Coding Sessions"', () => {
    expect(component.title).toBe('DCC Coding Sessions');
  });
});
