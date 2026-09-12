import { Injector, DestroyRef, signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { ItemCardComponent } from './item-card.component';
import { ItemStateService } from '../../services/item-state.service';
import { ProductItem } from '../../models/product-item.model';

describe('ItemCardComponent (Jest)', () => {
  let component: ItemCardComponent;
  let mockStateService: any;
  let mockDestroyRef: any;
  let compareIdsSignal: any;

  const mockItem = new ProductItem(
    1,
    'DeWalt Cordless Drill',
    'Power Tools',
    149.99,
    'High power cordless drill.',
    true,
    15,
    '/assets/images/drill.jpg',
    ['20V MAX']
  );

  function createComponent() {
    const injector = Injector.create({
      providers: [
        { provide: DestroyRef, useValue: mockDestroyRef },
        { provide: ItemStateService, useValue: mockStateService },
        provideRouter([]),
        ItemCardComponent
      ]
    });
    const comp = injector.get(ItemCardComponent);
    (comp as any).item = signal(mockItem);
    return comp;
  }

  beforeEach(() => {
    jest.useFakeTimers();

    mockDestroyRef = { onDestroy: jest.fn() };
    compareIdsSignal = signal<number[]>([]);
    mockStateService = {
      compareIds: compareIdsSignal.asReadonly(),
      toggleCompare: jest.fn().mockReturnValue(true)
    };

    component = createComponent();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('should create item card component instance', () => {
    expect(component).toBeTruthy();
  });

  it('should report isCompared as false when the item id is not in compareIds', () => {
    expect(component.isCompared()).toBe(false);
  });

  it('should report isCompared as true when the item id is in compareIds', () => {
    compareIdsSignal.set([1, 2]);
    expect(component.isCompared()).toBe(true);
  });

  it('should toggle comparison via stateService and stop event propagation', () => {
    const checkbox = { checked: true } as HTMLInputElement;
    const stopPropagation = jest.fn();
    const event = { target: checkbox, stopPropagation } as unknown as Event;

    component.onCompareToggle(event);

    expect(stopPropagation).toHaveBeenCalled();
    expect(mockStateService.toggleCompare).toHaveBeenCalledWith(1);
  });

  it('should leave the checkbox checked and limitNotice false when toggleCompare succeeds', () => {
    const checkbox = { checked: true } as HTMLInputElement;
    const event = { target: checkbox, stopPropagation: jest.fn() } as unknown as Event;

    component.onCompareToggle(event);

    expect(checkbox.checked).toBe(true);
    expect(component.limitNotice()).toBe(false);
  });

  it('should uncheck the checkbox and show a temporary limit notice when toggleCompare fails', () => {
    mockStateService.toggleCompare = jest.fn().mockReturnValue(false);
    const checkbox = { checked: true } as HTMLInputElement;
    const event = { target: checkbox, stopPropagation: jest.fn() } as unknown as Event;

    component.onCompareToggle(event);

    expect(checkbox.checked).toBe(false);
    expect(component.limitNotice()).toBe(true);
  });

  it('should clear the limit notice automatically after the timeout elapses', () => {
    mockStateService.toggleCompare = jest.fn().mockReturnValue(false);
    const checkbox = { checked: true } as HTMLInputElement;
    const event = { target: checkbox, stopPropagation: jest.fn() } as unknown as Event;

    component.onCompareToggle(event);
    expect(component.limitNotice()).toBe(true);

    jest.advanceTimersByTime(3500);

    expect(component.limitNotice()).toBe(false);
  });

  it('should not have cleared the limit notice before the timeout elapses', () => {
    mockStateService.toggleCompare = jest.fn().mockReturnValue(false);
    const checkbox = { checked: true } as HTMLInputElement;
    const event = { target: checkbox, stopPropagation: jest.fn() } as unknown as Event;

    component.onCompareToggle(event);
    jest.advanceTimersByTime(1000);

    expect(component.limitNotice()).toBe(true);
  });
});
