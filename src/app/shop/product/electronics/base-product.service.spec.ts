import { TestBed } from '@angular/core/testing';

import { BaseProductService } from './base-product.service';

describe('BaseProductService', () => {
  let service: BaseProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BaseProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
