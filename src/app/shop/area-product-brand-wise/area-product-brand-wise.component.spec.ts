import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaProductBrandWiseComponent } from './area-product-brand-wise.component';

describe('AreaProductBrandWiseComponent', () => {
  let component: AreaProductBrandWiseComponent;
  let fixture: ComponentFixture<AreaProductBrandWiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AreaProductBrandWiseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AreaProductBrandWiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
