import { TestBed } from '@angular/core/testing';

import { DaohausService } from './daohaus.service';

describe('DaohausServiceService', () => {
  let service: DaohausService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DaohausService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
