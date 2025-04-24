import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElectronicsBrandsComponent } from './electronics-brands.component';

describe('ElectronicsBrandsComponent', () => {
  let component: ElectronicsBrandsComponent;
  let fixture: ComponentFixture<ElectronicsBrandsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ElectronicsBrandsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ElectronicsBrandsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
