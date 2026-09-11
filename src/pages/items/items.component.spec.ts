import { Injector, DestroyRef, ɵEffectScheduler as EffectScheduler, ɵChangeDetectionScheduler as ChangeDetectionScheduler } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { of } from 'rxjs';
import { signal } from '@angular/core';
import { ItemsComponent } from './items.component';
import { ItemStateService } from '../../services/item-state.service';
import { ProductItem } from '../../models/item.model';

describe('ItemsComponent (Jest)', () => {
  let component: ItemsComponent;
  let mockStateService: any;
  let mockTitleService: any;
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
    ['20V MAX']
  );

  beforeEach(() => {
    mockStateService = {
      items: signal([mockItem]).asReadonly(),
      filteredItems: signal([mockItem]).asReadonly(),
      comparedItems: signal<ProductItem[]>([]).asReadonly(),
      loading: signal(false).asReadonly(),
      error: signal<string | null>(null).asReadonly(),
      setCategoryFilter: jest.fn(),
      loadItems: jest.fn()
    };

    mockTitleService = {
      setTitle: jest.fn(),
      getTitle: jest.fn()
    };

    mockDestroyRef = {
      onDestroy: jest.fn()
    };

    const injector = Injector.create({
      providers: [
        { provide: EffectScheduler, useValue: { add: () => {}, schedule: () => {} } },
        { provide: ChangeDetectionScheduler, useValue: { notify: () => {} } },
        { provide: DestroyRef, useValue: mockDestroyRef },
        { provide: ItemStateService, useValue: mockStateService },
        { provide: Title, useValue: mockTitleService },
        {
          provide: ActivatedRoute,
          useValue: { queryParamMap: of(new Map([['category', 'Power Tools']])) }
        },
        ItemsComponent
      ]
    });

    component = injector.get(ItemsComponent);
  });

  it('should create items component instance', () => {
    expect(component).toBeTruthy();
  });

  it('should expose stateService signals for template binding', () => {
    expect(component.filteredItems()).toBeDefined();
    expect(component.filteredItems().length).toBe(1);
    expect(component.loading()).toBe(false);
    expect(component.error()).toBeNull();
  });
});
