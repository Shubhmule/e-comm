import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomefilterComponent } from './customefilter.component';

describe('CustomefilterComponent', () => {
  let component: CustomefilterComponent;
  let fixture: ComponentFixture<CustomefilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomefilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomefilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
