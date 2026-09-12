import { Injector, signal } from '@angular/core';
import { QuantitySelectorComponent } from './quantity-selector.component';

describe('QuantitySelectorComponent (Jest)', () => {
  let component: QuantitySelectorComponent;

  beforeEach(() => {
    const injector = Injector.create({
      providers: [QuantitySelectorComponent]
    });
    component = injector.get(QuantitySelectorComponent);
  });

  it('should create quantity selector component instance', () => {
    expect(component).toBeTruthy();
  });

  it('should default quantity to 1, min to 1 and max to 999', () => {
    expect(component.quantity()).toBe(1);
    expect(component.min()).toBe(1);
    expect(component.max()).toBe(999);
  });

  it('should emit incremented quantity value on increment call', () => {
    const spy = jest.spyOn(component.quantityChange, 'emit');
    component.increment();
    expect(spy).toHaveBeenCalledWith(2);
  });

  it('should block decrementing below default min value', () => {
    const spy = jest.spyOn(component.quantityChange, 'emit');
    component.decrement();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should allow decrementing when quantity is above min', () => {
    (component as any).quantity = signal(5);
    const spy = jest.spyOn(component.quantityChange, 'emit');
    component.decrement();
    expect(spy).toHaveBeenCalledWith(4);
  });

  it('should block incrementing at or above a custom max value', () => {
    (component as any).quantity = signal(3);
    (component as any).max = signal(3);
    const spy = jest.spyOn(component.quantityChange, 'emit');
    component.increment();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should respect a custom min value when decrementing', () => {
    (component as any).quantity = signal(10);
    (component as any).min = signal(10);
    const spy = jest.spyOn(component.quantityChange, 'emit');
    component.decrement();
    expect(spy).not.toHaveBeenCalled();
  });
});
