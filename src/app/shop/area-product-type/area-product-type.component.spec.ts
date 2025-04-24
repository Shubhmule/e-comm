import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaProductTypeComponent } from './area-product-type.component';

describe('AreaProductTypeComponent', () => {
  let component: AreaProductTypeComponent;
  let fixture: ComponentFixture<AreaProductTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AreaProductTypeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AreaProductTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
