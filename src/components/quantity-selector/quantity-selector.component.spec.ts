import { Injector } from '@angular/core';
import { QuantitySelectorComponent } from './quantity-selector.component';

describe('QuantitySelectorComponent (Jest)', () => {
  let component: QuantitySelectorComponent;

  beforeEach(() => {
    const injector = Injector.create({ providers: [QuantitySelectorComponent] });
    component = injector.get(QuantitySelectorComponent);
  });

  it('should create quantity selector component instance', () => {
    expect(component).toBeTruthy();
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
});
