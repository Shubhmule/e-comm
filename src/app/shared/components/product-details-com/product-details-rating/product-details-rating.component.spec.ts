import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDetailsRatingComponent } from './product-details-rating.component';

describe('ProductDetailsRatingComponent', () => {
  let component: ProductDetailsRatingComponent;
  let fixture: ComponentFixture<ProductDetailsRatingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDetailsRatingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductDetailsRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
