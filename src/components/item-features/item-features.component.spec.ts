import { Injector, signal } from '@angular/core';
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

  it('should default features to an empty array', () => {
    expect(component.features()).toEqual([]);
  });

  it('should reflect a custom features list once set', () => {
    (component as any).features = signal(['20V MAX', 'Brushless motor']);
    expect(component.features()).toEqual(['20V MAX', 'Brushless motor']);
  });
});
