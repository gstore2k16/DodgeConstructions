import { Injector } from '@angular/core';
import { ItemFilterComponent } from './item-filter.component';

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe('ItemFilterComponent (Jest)', () => {
  let component: ItemFilterComponent;

  beforeEach(() => {
    const injector = Injector.create({
      providers: [ItemFilterComponent]
    });
    component = injector.get(ItemFilterComponent);
  });

  it('should create item filter component instance', () => {
    expect(component).toBeTruthy();
  });

  it('should default inputs to their documented defaults', () => {
    expect(component.categories()).toEqual(['All']);
    expect(component.searchTerm()).toBe('');
    expect(component.selectedCategory()).toBe('All');
    expect(component.minPrice()).toBeNull();
    expect(component.maxPrice()).toBeNull();
    expect(component.inStockOnly()).toBe(false);
    expect(component.sortOrder()).toBe('default');
  });

  it('should emit categoryChange output event on onCategorySelect call', () => {
    const spy = jest.spyOn(component.categoryChange, 'emit');
    component.onCategorySelect('Power Tools');
    expect(spy).toHaveBeenCalledWith('Power Tools');
  });

  it('should emit minPriceChange output event on onMinInput call', () => {
    const spy = jest.spyOn(component.minPriceChange, 'emit');
    component.onMinInput(50);
    expect(spy).toHaveBeenCalledWith(50);
  });

  it('should emit minPriceChange with null when cleared', () => {
    const spy = jest.spyOn(component.minPriceChange, 'emit');
    component.onMinInput(null);
    expect(spy).toHaveBeenCalledWith(null);
  });

  it('should emit maxPriceChange output event on onMaxInput call', () => {
    const spy = jest.spyOn(component.maxPriceChange, 'emit');
    component.onMaxInput(200);
    expect(spy).toHaveBeenCalledWith(200);
  });

  it('should emit inStockChange output event on onStockToggle call', () => {
    const spy = jest.spyOn(component.inStockChange, 'emit');
    component.onStockToggle(true);
    expect(spy).toHaveBeenCalledWith(true);
  });

  it('should emit sortOrderChange output event on onSortSelect call', () => {
    const spy = jest.spyOn(component.sortOrderChange, 'emit');
    component.onSortSelect('price-asc');
    expect(spy).toHaveBeenCalledWith('price-asc');
  });

  it('should emit reset output event on onResetClick call', () => {
    const spy = jest.spyOn(component.reset, 'emit');
    component.onResetClick();
    expect(spy).toHaveBeenCalled();
  });

  it('should emit a debounced search term after rapid onSearchInput calls settle', async () => {
    const received: string[] = [];
    component.searchTermChange.subscribe((val: string) => received.push(val));

    component.onSearchInput('d');
    component.onSearchInput('dr');
    component.onSearchInput('dri');

    await wait(150);

    expect(received).toEqual(['dri']);
  });

  it('should not re-emit the search term when the same value is pushed twice in a row', async () => {
    const received: string[] = [];
    component.searchTermChange.subscribe((val: string) => received.push(val));

    component.onSearchInput('drill');
    await wait(150);
    component.onSearchInput('drill');
    await wait(150);

    expect(received).toEqual(['drill']);
  });

  it('should emit an empty search term when onResetClick is called after a prior search', async () => {
    const received: string[] = [];
    component.searchTermChange.subscribe((val: string) => received.push(val));

    component.onSearchInput('drill');
    await wait(150);

    component.onResetClick();
    await wait(150);

    expect(received).toEqual(['drill', '']);
  });
});
