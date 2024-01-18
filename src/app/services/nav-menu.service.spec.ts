import { TestBed } from '@angular/core/testing';

import { NavMenuService } from './nav-menu.service';

describe('BreadcrumbService', () => {
  let service: NavMenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NavMenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
