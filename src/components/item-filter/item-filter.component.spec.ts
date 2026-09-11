import { Injector, DestroyRef } from '@angular/core';
import { ItemFilterComponent } from './item-filter.component';

describe('ItemFilterComponent (Jest)', () => {
  let component: ItemFilterComponent;
  let mockDestroyRef: any;

  beforeEach(() => {
    mockDestroyRef = {
      onDestroy: jest.fn()
    };

    const injector = Injector.create({
      providers: [
        { provide: DestroyRef, useValue: mockDestroyRef },
        ItemFilterComponent
      ]
    });

    component = injector.get(ItemFilterComponent);
  });

  it('should create item filter component instance', () => {
    expect(component).toBeTruthy();
  });

  it('should emit categoryChange output event on onCategorySelect call', () => {
    const spy = jest.spyOn(component.categoryChange, 'emit');
    component.onCategorySelect('Power Tools');
    expect(spy).toHaveBeenCalledWith('Power Tools');
  });

  it('should emit inStockChange output event on onStockToggle call', () => {
    const spy = jest.spyOn(component.inStockChange, 'emit');
    component.onStockToggle(true);
    expect(spy).toHaveBeenCalledWith(true);
  });

  it('should emit reset output event on onResetClick call', () => {
    const spy = jest.spyOn(component.reset, 'emit');
    component.onResetClick();
    expect(spy).toHaveBeenCalled();
  });
});
