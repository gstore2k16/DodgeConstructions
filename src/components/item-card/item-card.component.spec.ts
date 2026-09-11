import { Injector } from '@angular/core';
import { signal } from '@angular/core';
import { ItemCardComponent } from './item-card.component';
import { ItemStateService } from '../../services/item-state.service';
import { ProductItem } from '../../models/item.model';

describe('ItemCardComponent (Jest)', () => {
  let component: ItemCardComponent;
  let mockStateService: any;

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
      compareIds: signal<number[]>([]).asReadonly(),
      toggleCompare: jest.fn().mockReturnValue(true)
    };

    const injector = Injector.create({
      providers: [
        { provide: ItemStateService, useValue: mockStateService },
        ItemCardComponent
      ]
    });

    component = injector.get(ItemCardComponent);
  });

  it('should create item card component instance', () => {
    expect(component).toBeTruthy();
  });
});
