import { TestBed } from '@angular/core/testing';

import { ShopAreaServiceService } from './shop-area-service.service';

describe('ShopAreaServiceService', () => {
  let service: ShopAreaServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShopAreaServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
