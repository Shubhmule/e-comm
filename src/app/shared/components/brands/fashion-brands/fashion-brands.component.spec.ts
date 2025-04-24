import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FashionBrandsComponent } from './fashion-brands.component';

describe('FashionBrandsComponent', () => {
  let component: FashionBrandsComponent;
  let fixture: ComponentFixture<FashionBrandsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FashionBrandsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FashionBrandsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
