import { Injector, DestroyRef, signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { ItemDetailViewComponent } from './item-detail-view.component';
import { ItemStateService } from '../../services/item-state.service';
import { ProductItem } from '../../models/product-item.model';

describe('ItemDetailViewComponent (Jest)', () => {
  let component: ItemDetailViewComponent;
  let mockStateService: any;
  let mockDestroyRef: any;

  const mockItem = new ProductItem(
    1,
    'DeWalt Cordless Drill',
    'Power Tools',
    149.99,
    'High power cordless drill.',
    true,
    15,
    '/assets/images/drill.jpg',
    ['20V MAX'],
  );

  function createComponent() {
    const injector = Injector.create({
      providers: [
        { provide: DestroyRef, useValue: mockDestroyRef },
        { provide: ItemStateService, useValue: mockStateService },
        provideRouter([]),
        ItemDetailViewComponent,
      ],
    });
    const comp = injector.get(ItemDetailViewComponent);
    (comp as any).item = signal(mockItem);
    return comp;
  }

  beforeEach(() => {
    jest.useFakeTimers();

    mockDestroyRef = { onDestroy: jest.fn() };
    mockStateService = {
      addToCart: jest.fn(),
    };

    component = createComponent();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
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

  it('should initialize addedToCart to false', () => {
    expect(component.addedToCart()).toBe(false);
  });

  it('should add the current quantity of the item to the cart and show a confirmation', () => {
    component.onQuantityChange(3);

    component.onAddToCart();

    expect(mockStateService.addToCart).toHaveBeenCalledWith(mockItem.id, 3);
    expect(component.addedToCart()).toBe(true);
  });

  it('should reset quantity back to 1 after adding to cart', () => {
    component.onQuantityChange(4);

    component.onAddToCart();

    expect(component.quantity()).toBe(1);
  });

  it('should clear the confirmation state after the timeout elapses', () => {
    component.onAddToCart();
    expect(component.addedToCart()).toBe(true);

    jest.advanceTimersByTime(2000);

    expect(component.addedToCart()).toBe(false);
  });
});
