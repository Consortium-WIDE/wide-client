import { TestBed } from '@angular/core/testing';

import { ClaimsProcessorService } from './claims-processor.service';

describe('ClaimsProcessorService', () => {
  let service: ClaimsProcessorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClaimsProcessorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
