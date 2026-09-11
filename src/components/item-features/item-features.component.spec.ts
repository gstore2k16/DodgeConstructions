import { Injector } from '@angular/core';
import { ItemFeaturesComponent } from './item-features.component';

describe('ItemFeaturesComponent (Jest)', () => {
  let component: ItemFeaturesComponent;

  beforeEach(() => {
    const injector = Injector.create({ providers: [ItemFeaturesComponent] });
    component = injector.get(ItemFeaturesComponent);
  });

  it('should create item features component instance', () => {
    expect(component).toBeTruthy();
  });
});
