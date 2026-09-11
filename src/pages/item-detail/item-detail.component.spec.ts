import { Injector, ɵEffectScheduler as EffectScheduler, ɵChangeDetectionScheduler as ChangeDetectionScheduler } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { signal } from '@angular/core';
import { ItemDetailComponent } from './item-detail.component';
import { ItemStateService } from '../../services/item-state.service';
import { ProductItem } from '../../models/item.model';

describe('ItemDetailComponent (Jest)', () => {
  let component: ItemDetailComponent;
  let mockStateService: any;
  let mockTitleService: any;

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
    mockStateService = {
      selectedItem: signal(mockItem).asReadonly(),
      loading: signal(false).asReadonly(),
      error: signal<string | null>(null).asReadonly(),
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
});
