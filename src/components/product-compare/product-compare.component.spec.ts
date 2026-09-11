import { Injector } from '@angular/core';
import { signal } from '@angular/core';
import { ProductCompareComponent } from './product-compare.component';
import { ItemStateService } from '../../services/item-state.service';
import { ProductItem } from '../../models/item.model';

describe('ProductCompareComponent (Jest)', () => {
  let component: ProductCompareComponent;
  let mockStateService: any;

  const mockItem1 = new ProductItem(1, 'Drill A', 'Tools', 100, 'Desc A', true, 10, '/a.jpg', ['Feature 1']);
  const mockItem2 = new ProductItem(2, 'Drill B', 'Tools', 150, 'Desc B', false, 0, '/b.jpg', ['Feature 2']);

  beforeEach(() => {
    mockStateService = {
      comparedItems: signal([mockItem1, mockItem2]).asReadonly(),
      removeCompare: jest.fn(),
      clearCompare: jest.fn()
    };

    const injector = Injector.create({
      providers: [
        { provide: ItemStateService, useValue: mockStateService },
        ProductCompareComponent
      ]
    });

    component = injector.get(ProductCompareComponent);
  });

  it('should create product compare component instance', () => {
    expect(component).toBeTruthy();
  });

  it('should trigger stateService.removeCompare on remove call', () => {
    component.remove(1);
    expect(mockStateService.removeCompare).toHaveBeenCalledWith(1);
  });

  it('should trigger stateService.clearCompare on clearAll call', () => {
    component.clearAll();
    expect(mockStateService.clearCompare).toHaveBeenCalled();
  });

  it('should calculate price difference and cheaper item name', () => {
    expect(component.getPriceDifference(mockItem1, mockItem2)).toBe(50);
    expect(component.getCheaperItemName(mockItem1, mockItem2)).toBe('Drill A');
  });
});
