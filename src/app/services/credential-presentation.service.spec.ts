import { TestBed } from '@angular/core/testing';

import { CredentialPresentationService } from './credential-presentation.service';

describe('CredentialPresentationService', () => {
  let service: CredentialPresentationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CredentialPresentationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
