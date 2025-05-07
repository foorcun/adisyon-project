import { TestBed } from '@angular/core/testing';

import { OdemePageFacadeService } from './odeme-page-facade.service';

describe('OdemePageFacadeService', () => {
  let service: OdemePageFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OdemePageFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
