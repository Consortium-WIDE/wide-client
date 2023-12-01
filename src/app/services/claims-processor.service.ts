import { Injectable } from '@angular/core';
import * as sigUtil from 'eth-sig-util';
import Web3 from 'web3';
import WalletConnectProvider from '@walletconnect/web3-provider';

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

  public async connectWalletMetaMask(): Promise<void> {
    if (!window.ethereum) {
      console.error('Ethereum object not found');
      return;
    }

    try {
      // Request access to account
      await window.ethereum.request({ method: 'eth_requestAccounts' });
    } catch (error) {
      console.error('User denied wallet access', error);
    }
  }

  public async connectWalletConnect(): Promise<void> {
    const provider = new WalletConnectProvider({
      infuraId: 'YOUR_INFURA_ID' // Replace with your Infura ID
    });

    try {
      await provider.enable();
    } catch (error) {
      console.error('User denied wallet access or connection failed', error);
    }
  }

  public async encryptData(data: string): Promise<any | null> {
    if (!this.web3) {
      console.error('Web3 is not initialized');
      return null;
    }

    //await this.connectWalletConnect();

    const accounts = await this.web3.eth.getAccounts();
    if (accounts.length === 0) {
      console.error('No accounts found');
      return null;
    }

    try {
      const pubKey = await this.getEncryptionPublicKey(accounts[0]);
      if (pubKey) {
        const encryptedData = sigUtil.encrypt(pubKey, { data: JSON.stringify(data) }, 'x25519-xsalsa20-poly1305');
        return encryptedData;
      }
    } catch (error) {
      console.error('Error encrypting data', error);
      return null;
    }
  }

  public async decryptData(encryptedData: any): Promise<string | null> {
    if (!window.ethereum) {
      console.error('Ethereum object not found');
      return null;
    }

    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    if (accounts.length === 0) {
      console.error('No accounts found');
      return null;
    }

    try {
      // Ensure the encrypted data is a JSON string
      const encryptedDataString = JSON.stringify(encryptedData);

      // Decrypt the data using MetaMask
      const decryptedData = await window.ethereum.request({
        method: 'eth_decrypt',
        params: [encryptedDataString, accounts[0]]
      });

      return decryptedData;
    } catch (error) {
      console.error('Error decrypting data', error);
      return null;
    }
  }

  private async getEncryptionPublicKey(account: string): Promise<string | null> {
    if (!window.ethereum) {
      console.error('Ethereum object not found');
      return null;
    }

    try {
      // Request the encryption public key from MetaMask
      const encryptionPublicKey = await window.ethereum.request({
        method: 'eth_getEncryptionPublicKey',
        params: [account], // The user's account/ Ethereum address
      });
      return encryptionPublicKey;
    } catch (error) {
      console.error('Error retrieving encryption public key', error);
      return null;
    }
  }
}
