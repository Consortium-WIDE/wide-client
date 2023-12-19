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
    this.connectedToWallet.next(this.connectToMetamask());

    if (!window.ethereum) {
      console.error('Ethereum object not found');
      this.connectedToWallet.next(false);
      return this.connectedToWallet.value;
    }

    if (!this.connectedToWallet.value) {
      console.error('MetaMask is not installed!');
      this.connectedToWallet.next(false);
      return this.connectedToWallet.value;
    }

    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
    } catch (error) {
      this.connectedToWallet.next(false);
      return this.connectedToWallet.value;
    }

    return this.connectedToWallet.value;
  }

  private connectToMetamask(): boolean {
    if (window.ethereum) {
      this.web3 = new Web3(window.ethereum);
      this.connectedToWallet.next(true);
    } else {
      this.connectedToWallet.next(false);
    }

    return this.connectedToWallet.value;
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
