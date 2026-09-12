import { Injector } from '@angular/core';
import { BreadcrumbComponent } from './breadcrumb.component';

describe('BreadcrumbComponent (Jest)', () => {
  let component: BreadcrumbComponent;
  beforeEach(() => {
    const injector = Injector.create({
      providers: [
        BreadcrumbComponent
      ]
    });

    component = injector.get(BreadcrumbComponent);
  });

  it('should create breadcrumb component instance', () => {
    expect(component).toBeTruthy();
  });
});
