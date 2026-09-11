import { HomeComponent } from './home.component';

describe('HomeComponent (Jest)', () => {
  let component: HomeComponent;

  beforeEach(() => {
    component = new HomeComponent();
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
});
