import { Injector } from '@angular/core';
import { ItemDetailViewComponent } from './item-detail-view.component';

describe('ItemDetailViewComponent (Jest)', () => {
  let component: ItemDetailViewComponent;

  beforeEach(() => {
    const injector = Injector.create({ providers: [ItemDetailViewComponent] });
    component = injector.get(ItemDetailViewComponent);
  });

  it('should create item detail view component instance', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize quantity to 1', () => {
    expect(component.quantity()).toBe(1);
  });

  it('should update quantity signal when onQuantityChange is called', () => {
    component.onQuantityChange(5);
    expect(component.quantity()).toBe(5);
  });
});
