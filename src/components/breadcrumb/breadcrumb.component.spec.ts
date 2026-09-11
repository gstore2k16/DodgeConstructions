import { Injector } from '@angular/core';
import { BreadcrumbComponent } from './breadcrumb.component';
import { ItemStateService } from '../../services/item-state.service';

describe('BreadcrumbComponent (Jest)', () => {
  let component: BreadcrumbComponent;
  let mockStateService: any;

  beforeEach(() => {
    mockStateService = {
      resetFilters: jest.fn(),
      setCategoryFilter: jest.fn()
    };

    const injector = Injector.create({
      providers: [
        { provide: ItemStateService, useValue: mockStateService },
        BreadcrumbComponent
      ]
    });

    component = injector.get(BreadcrumbComponent);
  });

  it('should create breadcrumb component instance', () => {
    expect(component).toBeTruthy();
  });

  it('should call stateService.setCategoryFilter("All") when onItemsClick is triggered', () => {
    component.onItemsClick();
    expect(mockStateService.setCategoryFilter).toHaveBeenCalledWith('All');
  });

  it('should call stateService.setCategoryFilter when onCategoryClick is triggered with category name', () => {
    component.onCategoryClick('Power Tools');
    expect(mockStateService.setCategoryFilter).toHaveBeenCalledWith('Power Tools');
  });
});
