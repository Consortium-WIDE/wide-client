import { Injectable } from '@angular/core';
import Web3 from 'web3';

// Define a type for the Ethereum object on the window
declare global {
  interface Window {
    ethereum: any;
  }
}

@Injectable({
  providedIn: 'root'
})
export class ClaimsProcessorService {
  private web3: Web3 | null = null;

  constructor() {
    if (window.ethereum) {
      this.web3 = new Web3(window.ethereum);
    } else {
      console.error('MetaMask is not installed!');
    }
  }

  public async connectWallet(): Promise<void> {
    if (!this.web3) {
      console.error('Web3 is not initialized');
      return;
    }

    try {
      await window.ethereum.enable(); // Request access
      console.log('Wallet connected');
    } catch (error) {
      console.error('User denied wallet access', error);
    }
  }

  public async encryptData(data: string): Promise<any | null> {
    if (!this.web3) {
      console.error('Web3 is not initialized');
      return null;
    }

    await this.connectWallet();

    const accounts = await this.web3.eth.getAccounts();
    if (accounts.length === 0) {
      console.error('No accounts found');
      return null;
    }

    try {
      const pubKey = await this.getPublicKey(accounts[0]);

      console.log('Public Key is ', pubKey)
      if (pubKey) {
        //const encrypted = await EthCrypto.encryptWithPublicKey(pubKey, data);
        //return encrypted;
      }
    } catch (error) {
      console.error('Error encrypting data', error);
      return null;
    }
  }

  private async getPublicKey(account: string): Promise<string | null> {
    if (!this.web3) {
      console.error('Web3 is not initialized');
      return null;
    }

    try {
      const message = "Some string to sign";
      const signature = await this.web3.eth.personal.sign(message, account, "");

      // Derive the public key from the signature
      const publicKey = this.web3.eth.accounts.recover(message, signature);
      return publicKey;
    } catch (error) {
      console.error('Error retrieving public key', error);
      return null;
    }
  }

  public async decryptData(encryptedData: string): Promise<any | null> {
    if (!this.web3) {
      console.error('Web3 is not initialized');
      return null;
    }

    const accounts = await this.web3.eth.getAccounts();
    if (accounts.length === 0) {
      console.error('No accounts found');
      return null;
    }

    try {
      const decryptedData = this.web3.eth.accounts.decrypt(JSON.parse(encryptedData), accounts[0]);
      return decryptedData; // Or the appropriate field you want to return
    } catch (error) {
      console.error('Error decrypting data', error);
      return null;
    }
  }

  public printHello() {
    console.log('Hello from ClaimsProcessorService!');
  }
}
