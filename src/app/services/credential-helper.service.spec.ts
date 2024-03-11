import { TestBed } from '@angular/core/testing';

import { CredentialHelperService } from './credential-helper.service';

describe('CredentialHelperService', () => {
  let service: CredentialHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CredentialHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
