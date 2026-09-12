import { Injector, signal } from '@angular/core';
import { ItemGridComponent } from './item-grid.component';
import { ProductItem } from '../../models/product-item.model';

describe('ItemGridComponent (Jest)', () => {
  let component: ItemGridComponent;

  const mockItems = [
    new ProductItem(1, 'Drill', 'Tools', 100, 'Desc', true, 5, '/a.jpg', []),
    new ProductItem(2, 'Saw', 'Tools', 150, 'Desc', false, 0, '/b.jpg', [])
  ];

  beforeEach(() => {
    const injector = Injector.create({ providers: [ItemGridComponent] });
    component = injector.get(ItemGridComponent);
  });

  it('should create item grid component instance', () => {
    expect(component).toBeTruthy();
  });

  it('should expose the items passed in via the items input', () => {
    (component as any).items = signal(mockItems);
    expect(component.items().length).toBe(2);
    expect(component.items()).toBe(mockItems);
  });

  it('should support an empty items list', () => {
    (component as any).items = signal([]);
    expect(component.items()).toEqual([]);
  });
});
