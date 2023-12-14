import { TestBed } from '@angular/core/testing';

import { WideStorageService } from './wide-storage.service';

describe('WideStorageService', () => {
  let service: WideStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WideStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
