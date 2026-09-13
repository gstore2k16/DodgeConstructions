import { Injector, signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { ProductCompareComponent } from './product-compare.component';
import { ItemStateService } from '../../services/item-state.service';
import { ProductItem } from '../../models/product-item.model';

describe('ProductCompareComponent (Jest)', () => {
  let component: ProductCompareComponent;
  let mockStateService: any;

  const mockItem1 = new ProductItem(1, 'Drill A', 'Tools', 100, 'Desc A', true, 10, '/a.jpg', [
    'Feature 1',
  ]);
  const mockItem2 = new ProductItem(2, 'Drill B', 'Tools', 150, 'Desc B', false, 0, '/b.jpg', [
    'Feature 2',
  ]);

  beforeEach(() => {
    mockStateService = {
      comparedItems: signal([mockItem1, mockItem2]).asReadonly(),
      removeCompare: jest.fn(),
      clearCompare: jest.fn(),
    };

    const injector = Injector.create({
      providers: [
        { provide: ItemStateService, useValue: mockStateService },
        provideRouter([]),
        ProductCompareComponent,
      ],
    });
    component = injector.get(ProductCompareComponent);
  });

  it('should create product compare component instance', () => {
    expect(component).toBeTruthy();
  });

  it('should expose comparedItems from stateService', () => {
    expect(component.comparedItems()).toEqual([mockItem1, mockItem2]);
  });

  it('should trigger stateService.removeCompare on remove call', () => {
    component.remove(1);
    expect(mockStateService.removeCompare).toHaveBeenCalledWith(1);
  });

  it('should trigger stateService.clearCompare on clearAll call', () => {
    component.clearAll();
    expect(mockStateService.clearCompare).toHaveBeenCalled();
  });

  describe('modal dialog control', () => {
    function mockDialog(open: boolean) {
      return { open, showModal: jest.fn(), close: jest.fn() };
    }

    it('should open the dialog when it is not already open', () => {
      const dialog = mockDialog(false);
      (component as any).dialogRef = signal({ nativeElement: dialog });

      component.openModal();

      expect(dialog.showModal).toHaveBeenCalled();
    });

    it('should not call showModal again if the dialog is already open', () => {
      const dialog = mockDialog(true);
      (component as any).dialogRef = signal({ nativeElement: dialog });

      component.openModal();

      expect(dialog.showModal).not.toHaveBeenCalled();
    });

    it('should close the dialog only when it is currently open', () => {
      const openDialog = mockDialog(true);
      (component as any).dialogRef = signal({ nativeElement: openDialog });
      component.closeModal();
      expect(openDialog.close).toHaveBeenCalled();

      const closedDialog = mockDialog(false);
      (component as any).dialogRef = signal({ nativeElement: closedDialog });
      component.closeModal();
      expect(closedDialog.close).not.toHaveBeenCalled();
    });

    it('should do nothing when there is no dialog element', () => {
      (component as any).dialogRef = signal(undefined);
      component.openModal();
      component.closeModal();
      expect(component.comparedItems().length).toBe(2);
    });
  });
});
