import { TestBed } from '@angular/core/testing';

import { MenuPageFacadeService } from './menu-page-facade.service';

describe('MenuPageFacadeService', () => {
  let service: MenuPageFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MenuPageFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
