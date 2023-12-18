import { Injectable } from '@angular/core';
import Web3 from 'web3';

declare let window: any;

@Injectable({
  providedIn: 'root'
})
export class Web3WalletService {
  private web3: Web3 | null = null;
  private connectedToWallet: boolean = false;

  constructor() { }

  public async connect(): Promise<boolean> {
    this.connectedToWallet = this.connectToMetamask();

    if (!window.ethereum) {
      console.error('Ethereum object not found');
      this.connectedToWallet = false;
      return this.connectedToWallet;
    }

    if (!this.connectedToWallet) {
      console.error('MetaMask is not installed!');
      this.connectedToWallet = false;
      return this.connectedToWallet;
    }

    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
    } catch (error) {
      this.connectedToWallet = false;
      return this.connectedToWallet;
    }

    return this.connectedToWallet;
  }

  private connectToMetamask(): boolean {
    if (window.ethereum) {
      this.web3 = new Web3(window.ethereum);
      this.connectedToWallet = true;
    } else {
      this.connectedToWallet = false;
    }

    return this.connectedToWallet;
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

  public isConnectedToWallet(): boolean {
    return this.connectedToWallet;
  }
}
