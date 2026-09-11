import { Injector } from '@angular/core';
import { ErrorComponent } from './error.component';

describe('ErrorComponent (Jest)', () => {
  let component: ErrorComponent;

  beforeEach(() => {
    const injector = Injector.create({ providers: [ErrorComponent] });
    component = injector.get(ErrorComponent);
  });

  it('should create error component instance', () => {
    expect(component).toBeTruthy();
  });
});
