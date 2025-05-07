import { TestBed } from '@angular/core/testing';

import { AdminOrdersPageFacadeService } from './admin-orders-page-facade.service';

describe('AdminOrdersPageFacadeService', () => {
  let service: AdminOrdersPageFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminOrdersPageFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
