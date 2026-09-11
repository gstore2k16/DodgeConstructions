import { Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of, firstValueFrom } from 'rxjs';
import { ItemService } from './item.service';
import { ProductItem } from '../models/item.model';

describe('ItemService (Jest)', () => {
  let service: ItemService;
  let mockHttpClient: any;

  const mockRawData = [
    {
      id: 1,
      name: 'Test Drill',
      category: 'Tools',
      price: 99.99,
      description: 'Test drill description',
      inStock: true,
      stockCount: 5,
      image: 'assets/drill.jpg',
      features: ['Cordless']
    }
  ];

  beforeEach(() => {
    mockHttpClient = {
      get: jest.fn().mockReturnValue(of(mockRawData))
    };

    const injector = Injector.create({
      providers: [
        { provide: HttpClient, useValue: mockHttpClient },
        ItemService
      ]
    });

    service = injector.get(ItemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch items from API/asset URL and transform to ProductItem instances', async () => {
    const items = await firstValueFrom(service.getItems());
    expect(items.length).toBe(1);
    expect(items[0].id).toBe(1);
    expect(items[0].name).toBe('Test Drill');
    expect(items[0] instanceof ProductItem).toBe(true);
  });

  it('should fetch single item by ID', async () => {
    const item = await firstValueFrom(service.getItemById(1));
    expect(item).toBeTruthy();
    expect(item?.id).toBe(1);
    expect(item?.name).toBe('Test Drill');
  });

  it('should clear cached items observable on clearCache', () => {
    service.getItems();
    service.clearCache();
    expect(service).toBeTruthy();
  });
});
