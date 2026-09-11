import { Injector } from '@angular/core';
import { ItemGridComponent } from './item-grid.component';

describe('ItemGridComponent (Jest)', () => {
  let component: ItemGridComponent;

  beforeEach(() => {
    const injector = Injector.create({ providers: [ItemGridComponent] });
    component = injector.get(ItemGridComponent);
  });

  it('should create item grid component instance', () => {
    expect(component).toBeTruthy();
  });
});
