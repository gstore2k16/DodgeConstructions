import { Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of, firstValueFrom } from 'rxjs';
import { ItemService } from './item.service';
import { ProductItem } from '../models/product-item.model';

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
    },
    {
      id: 2,
      name: 'Test Saw',
      category: 'Tools',
      price: 149.99,
      description: 'Test saw description',
      inStock: false,
      stockCount: 0,
      image: 'assets/saw.jpg',
      features: []
    }
  ];

  function createService(httpClientMock: any): ItemService {
    const injector = Injector.create({
      providers: [
        { provide: HttpClient, useValue: httpClientMock },
        ItemService
      ]
    });
    return injector.get(ItemService);
  }

  beforeEach(() => {
    mockHttpClient = {
      get: jest.fn().mockReturnValue(of(mockRawData))
    };
    service = createService(mockHttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch items from API/asset URL and transform to ProductItem instances', async () => {
    const items = await firstValueFrom(service.getItems());
    expect(items.length).toBe(2);
    expect(items[0].id).toBe(1);
    expect(items[0].name).toBe('Test Drill');
    expect(items[0] instanceof ProductItem).toBe(true);
    expect(items[1].name).toBe('Test Saw');
    expect(items[1].inStock).toBe(false);
  });

  it('should fetch single item by ID', async () => {
    const item = await firstValueFrom(service.getItemById(1));
    expect(item).toBeTruthy();
    expect(item?.id).toBe(1);
    expect(item?.name).toBe('Test Drill');
  });

  it('should resolve undefined when no item matches the requested ID', async () => {
    const item = await firstValueFrom(service.getItemById(999));
    expect(item).toBeUndefined();
  });

  it('should only call http.get once across multiple getItems()/getItemById() calls thanks to shareReplay caching', async () => {
    await firstValueFrom(service.getItems());
    await firstValueFrom(service.getItems());
    await firstValueFrom(service.getItemById(2));

    expect(mockHttpClient.get._calls.length).toBe(1);
  });

  it('should re-fetch from http.get after clearCache is called', async () => {
    await firstValueFrom(service.getItems());
    expect(mockHttpClient.get._calls.length).toBe(1);

    service.clearCache();

    await firstValueFrom(service.getItems());
    expect(mockHttpClient.get._calls.length).toBe(2);
  });

  it('should return an empty list when the API returns no items', async () => {
    const emptyHttpClient = { get: jest.fn().mockReturnValue(of([])) };
    const emptyService = createService(emptyHttpClient);

    const items = await firstValueFrom(emptyService.getItems());
    expect(items).toEqual([]);
  });
});
