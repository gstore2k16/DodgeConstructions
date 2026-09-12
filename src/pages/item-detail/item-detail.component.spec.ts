import { Injector, WritableSignal, ɵEffectScheduler as EffectScheduler, ɵChangeDetectionScheduler as ChangeDetectionScheduler } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { signal } from '@angular/core';
import { ItemDetailComponent } from './item-detail.component';
import { ItemStateService } from '../../services/item-state.service';
import { ProductItem } from '../../models/item.model';

describe('ItemDetailComponent (Jest)', () => {
  let component: ItemDetailComponent;
  let mockStateService: any;
  let mockTitleService: any;
  let selectedItemSignal: WritableSignal<ProductItem | undefined>;
  let loadingSignal: WritableSignal<boolean>;
  let errorSignal: WritableSignal<string | null>;

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

  beforeEach(() => {
    selectedItemSignal = signal<ProductItem | undefined>(mockItem);
    loadingSignal = signal(false);
    errorSignal = signal<string | null>(null);

    mockStateService = {
      selectedItem: selectedItemSignal.asReadonly(),
      loading: loadingSignal.asReadonly(),
      error: errorSignal.asReadonly(),
      selectItemById: jest.fn()
    };

    mockTitleService = {
      setTitle: jest.fn(),
      getTitle: jest.fn()
    };

    const injector = Injector.create({
      providers: [
        { provide: EffectScheduler, useValue: { add: () => {}, schedule: () => {} } },
        { provide: ChangeDetectionScheduler, useValue: { notify: () => {} } },
        { provide: ItemStateService, useValue: mockStateService },
        { provide: Title, useValue: mockTitleService },
        ItemDetailComponent
      ]
    });

    component = injector.get(ItemDetailComponent);
  });

  it('should create item detail component instance', () => {
    expect(component).toBeTruthy();
  });

  it('should expose selectedItem signal from stateService', () => {
    expect(component.item()).toBe(mockItem);
    expect(component.loading()).toBe(false);
    expect(component.error()).toBeNull();
  });

  it('should handle missing item gracefully when selectedItem is undefined', () => {
    selectedItemSignal.set(undefined);
    expect(component.item()).toBeUndefined();
    expect(component.loading()).toBe(false);
  });

  it('should reflect a loading state transition from stateService', () => {
    loadingSignal.set(true);
    expect(component.loading()).toBe(true);

    loadingSignal.set(false);
    expect(component.loading()).toBe(false);
  });

  it('should reflect an error message from stateService', () => {
    errorSignal.set('Failed to load products. Please try again later.');
    expect(component.error()).toBe('Failed to load products. Please try again later.');
  });

  it('should reflect a different selected item when the underlying signal changes', () => {
    const otherItem = new ProductItem(2, 'Bosch Saw', 'Power Tools', 199.99, 'Saw', true, 3, '/saw.jpg', []);
    selectedItemSignal.set(otherItem);
    expect(component.item()).toBe(otherItem);
    expect(component.item()?.name).toBe('Bosch Saw');
  });
});
