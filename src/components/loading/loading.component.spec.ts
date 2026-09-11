import { Injector } from '@angular/core';
import { LoadingComponent } from './loading.component';

describe('LoadingComponent (Jest)', () => {
  let component: LoadingComponent;

  beforeEach(() => {
    const injector = Injector.create({ providers: [LoadingComponent] });
    component = injector.get(LoadingComponent);
  });

  it('should create loading component instance', () => {
    expect(component).toBeTruthy();
  });
});
