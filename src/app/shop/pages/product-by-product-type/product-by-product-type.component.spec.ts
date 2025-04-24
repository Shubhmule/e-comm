import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductByProductTypeComponent } from './product-by-product-type.component';

describe('ProductByProductTypeComponent', () => {
  let component: ProductByProductTypeComponent;
  let fixture: ComponentFixture<ProductByProductTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductByProductTypeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductByProductTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
