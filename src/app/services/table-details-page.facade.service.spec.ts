import { TestBed } from '@angular/core/testing';

import { TableDetailsPageFacadeService } from './table-details-page.facade.service';

describe('TableDetailsPageFacadeService', () => {
  let service: TableDetailsPageFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TableDetailsPageFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
