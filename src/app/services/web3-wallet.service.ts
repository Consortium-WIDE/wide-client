import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import Web3 from 'web3';
import { isAddress } from 'web3-validator';

declare let window: any;

@Injectable({
  providedIn: 'root'
})
export class Web3WalletService {
  private web3: Web3 | null = null;
  private connectedToWallet = new BehaviorSubject<boolean>(false);
  connectedToWallet$ = this.connectedToWallet.asObservable();

  constructor() { }

  public async connect(): Promise<boolean> {
    let connectSuccess = false;

    if (!this.isMetaMaskInstalled()) {
      connectSuccess = false;
    } else {

      let ethRequestAccountsFailed = false;
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
      } catch (error) {
        ethRequestAccountsFailed = true;
      }
      
      if (!ethRequestAccountsFailed) {
        connectSuccess = true;
      }
    }
    
    this.connectedToWallet.next(connectSuccess);
    return this.connectedToWallet.value;
  }

  public isMetaMaskUnlocked(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if ((window as any).ethereum) {
        (window as any).ethereum.request({ method: 'eth_accounts' })
          .then((accounts: string[]) => {
            if (accounts.length > 0) {
              resolve(true); // Wallet is unlocked
            } else {
              resolve(false); // Wallet is locked
            }
          })
          .catch((error: Error) => {
            console.error('Error checking MetaMask accounts:', error);
            reject(error); // Handle or propagate the error as needed
          });
      } else {
        resolve(false); // MetaMask is not installed
      }
    });
  }

  public isMetaMaskInstalled(): boolean {
    const metaMaskInstalled = (typeof window.ethereum !== 'undefined') && window.ethereum.isMetaMask;

    if (metaMaskInstalled) {
      this.web3 = new Web3(window.ethereum);
    }

    return metaMaskInstalled;

  }

  public async signMessage(message: string): Promise<string | null> {
    if (!this.web3) {
      console.error('MetaMask is not available');
      return null;
    }

    try {
      const accounts = await this.web3.eth.getAccounts();
      if (accounts.length === 0) {
        throw new Error('No accounts found. Please connect to MetaMask.');
      }

      const account = accounts[0];
      const signature = await this.web3.eth.personal.sign(message, account, '');
      return signature;
    } catch (error) {
      console.error('Error signing message:', error);
      return null;
    }
  }

  public async getEthAddresses(): Promise<string[] | null> {
    if (!this.web3) {
      console.error('MetaMask is not available');
      return null;
    }

    const accounts = await this.web3.eth.getAccounts();
    if (accounts.length === 0) {
      console.error('No accounts found');
      return null;
    }

    return accounts;
  }

  public abridgeEthereumAddress(address: string, leadingChars: number = 4, trailingChars: number = 2) {
    if (isAddress(address)) {
      const leading = address.slice(2, 2 + leadingChars);
      const trailing = address.slice(-trailingChars);

      return `0x${leading}...${trailing}`;
    }

    return 'Invalid Address';
  }

  public isConnectedToWallet(): boolean {
    return this.connectedToWallet.value;
  }
}
