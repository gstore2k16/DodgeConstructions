import { Injector } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HomeComponent } from './home.component';

describe('HomeComponent (Jest)', () => {
  let component: HomeComponent;

  beforeEach(() => {
    const injector = Injector.create({
      providers: [
        provideRouter([]),
        HomeComponent
      ]
    });
    component = injector.get(HomeComponent);
  });

  it('should create home component instance', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with null fullSizeImage', () => {
    expect(component.fullSizeImage).toBeNull();
  });

  it('should set fullSizeImage URL on openFullSize', () => {
    const testUrl = 'assets/images/readme/item-list.png';
    component.openFullSize(testUrl);
    expect(component.fullSizeImage).toBe(testUrl);
  });

  it('should reset fullSizeImage to null on closeFullSize', () => {
    component.openFullSize('assets/test.png');
    expect(component.fullSizeImage).toBe('assets/test.png');

    component.closeFullSize();
    expect(component.fullSizeImage).toBeNull();
  });

  it('should overwrite fullSizeImage when openFullSize is called again with a different URL', () => {
    component.openFullSize('assets/first.png');
    component.openFullSize('assets/second.png');
    expect(component.fullSizeImage).toBe('assets/second.png');
  });

  it('should be a no-op to call closeFullSize when no image is open', () => {
    expect(component.fullSizeImage).toBeNull();
    component.closeFullSize();
    expect(component.fullSizeImage).toBeNull();
  });
});
