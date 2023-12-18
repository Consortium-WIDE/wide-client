import { TestBed } from '@angular/core/testing';

import { Web3WalletService } from './web3-wallet.service';

describe('Web3WalletServiceService', () => {
  let service: Web3WalletService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Web3WalletService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
