import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaProductCategorywiseComponent } from './area-product-categorywise.component';

describe('AreaProductCategorywiseComponent', () => {
  let component: AreaProductCategorywiseComponent;
  let fixture: ComponentFixture<AreaProductCategorywiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AreaProductCategorywiseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AreaProductCategorywiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
