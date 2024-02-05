import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, firstValueFrom, of, tap } from 'rxjs';
import Web3 from 'web3';
import { isAddress } from 'web3-validator';
import { EncryptionService } from '../encryption.service';
import { DataProcessingService } from '../data-processing.service';
import { environment } from '../../environments/environment';
import { SiweMessage } from 'siwe';
import { ToastNotificationService } from './toast-notification.service';
import { Router } from '@angular/router';
import { canonicalize } from 'json-canonicalize';

declare let window: any;

@Injectable({
  providedIn: 'root'
})
export class Web3WalletService {
  private web3: Web3 | null = null;
  private connectedToWallet = new BehaviorSubject<boolean>(false);
  private apiUrl = environment.wideServerApiUrl; // Replace with your actual API URL
  private serverPubKey: string | undefined;

  connectedToWallet$ = this.connectedToWallet.asObservable();
  private metaMaskCheckStatus = new BehaviorSubject<boolean>(true);
  public metaMaskCheckStatus$ = this.metaMaskCheckStatus.asObservable();

  constructor(private encryptionService: EncryptionService, private dataProcessingSerivce: DataProcessingService, private http: HttpClient, private toastNotificationService: ToastNotificationService, private router: Router) { }

  public async connect(): Promise<boolean> {
    if (!this.connectedToWallet.value) {
      let connectSuccess = false;

      if (!this.isMetaMaskInstalled()) {
        connectSuccess = false;
      } else {
        let ethRequestAccountsFailed = false;
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });

          const ethAddress = await this.getEthAddresses();

          if (ethAddress != null && ethAddress.length > 0) {
            const siweMessageRaw = await firstValueFrom(this.getSiweSignInMessage(ethAddress[0]));

            if (siweMessageRaw.requiresSignup) {
              this.toastNotificationService.info('Terms of Service', 'Please accept the Terms of Service before logging into and using WIDE');
              this.router.navigateByUrl('/getting-started');
            }

            if (siweMessageRaw.alreadyLoggedIn) {
              connectSuccess = true;
            } else {

              const siweMessage = new SiweMessage(siweMessageRaw.message);
              const msgToSign = siweMessage.prepareMessage();

              try {
                const signedMessage = await this.signMessage(msgToSign);

                if (signedMessage) {
                  const siweResponse = await firstValueFrom(this.verifySiweMessage(siweMessage, signedMessage));

                  if (!siweResponse.success && siweResponse.requiresSignup) {
                    this.toastNotificationService.info('Terms of Service', 'Please accept the Terms of Service before logging into and using WIDE');
                    this.router.navigateByUrl('/getting-started');
                  } else if (siweResponse.success) {
                    connectSuccess = true;
                  }

                }
              } catch (signError) {
                console.error('Signing process was rejected', signError);
                ethRequestAccountsFailed = true;
              }
            }
          }

        } catch (error) {
          ethRequestAccountsFailed = true;
        }

        this.connectedToWallet.next(connectSuccess);
      }
    }
    return this.connectedToWallet.value;
  }

  public async signTermsOfService(): Promise<boolean> {
    if (!this.isMetaMaskInstalled()) {
      return false;
    }

    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const ethAddress = await this.getEthAddresses();

      if (!ethAddress || ethAddress.length === 0) {
        return false;
      }

      // Convert Observable to Promise
      const siweMessageResponse = await this.getSiweSignUpMessage(ethAddress[0]).toPromise();
      const siweMessage = new SiweMessage(siweMessageResponse.message);
      const msgToSign = siweMessage.prepareMessage();

      const signedMessage = await this.signMessage(msgToSign);
      if (!signedMessage) {
        return false;
      }

      // Convert Observable to Promise and await the response
      const verifyResponse = await this.verifySiweMessage(siweMessage, signedMessage, true).toPromise();

      if (verifyResponse.success) {
        this.toastNotificationService.info('Terms of Service', 'Successfully signed the WIDE Terms of Service.');
      } else {
        this.toastNotificationService.error('Terms of Service', 'Failed to sign the WIDE Terms of Service.');
      }
      //Update service status
      this.connectedToWallet.next(verifyResponse.success);

      // Return based on the response from verifySiweMessage
      return verifyResponse.success;

    } catch (error) {
      console.error(error);
      return false;
    }

  }

  public isMetaMaskUnlocked(): Promise<boolean> {
    this.metaMaskCheckStatus.next(true);

    return new Promise((resolve, reject) => {
      if ((window as any).ethereum) {
        (window as any).ethereum.request({ method: 'eth_accounts' })
          .then((accounts: string[]) => {
            this.metaMaskCheckStatus.next(false);
            resolve(accounts.length > 0)
          })
          .catch((error: Error) => {
            console.error('Error checking MetaMask accounts:', error);
            this.metaMaskCheckStatus.next(false);
            reject(error); // Handle or propagate the error as needed
          });
      } else {
        this.metaMaskCheckStatus.next(false);
        resolve(false); // MetaMask is not installed
      }
    });
  }

  public updateMetaMaskCheckStatus(status: boolean): void {
    this.metaMaskCheckStatus.next(status);
  }

  public isMetaMaskInstalled(): boolean {
    const metaMaskInstalled = (typeof window.ethereum !== 'undefined') && window.ethereum.isMetaMask;

    if (metaMaskInstalled) {
      this.web3 = new Web3(window.ethereum);
    }

    return metaMaskInstalled;

  }

  public getSiweSignInMessage(accountAddress: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/siwe/generate_signin?ethereumAddress=${accountAddress}`, { withCredentials: true });
  }

  public getSiweSignUpMessage(accountAddress: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/siwe/generate_signup?ethereumAddress=${accountAddress}`);
  }

  public verifySiweMessage(siweMessage: SiweMessage, siweSignature: string, isOnboarding: boolean = false): Observable<any> {
    const payload = { "message": siweMessage, "signature": siweSignature, "isOnboarding": isOnboarding };
    return this.http.post(`${this.apiUrl}/siwe/verify_signin`, payload, { withCredentials: true });
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

  public signOutSiwe(accountAddress: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/siwe/signout?ethereumAddress=${accountAddress}`, { withCredentials: true });
  }

  public async encryptPayload(payload: any): Promise<any | null> {
    if (!this.web3) {
      console.error('MetaMask is not available');
      return null;
    }

    const account = await this.getAccount();

    if (!account) {
      return null;
    }

    try {
      const pubKey = await this.getEncryptionPublicKey(account);
      if (!pubKey) {
        return null;
      }

      const separatedCredentials = this.dataProcessingSerivce.separateJson(payload);

      const encryptedPayload = this.encryptionService.encryptData(pubKey, JSON.stringify(payload));
      const encryptedCredentials = separatedCredentials.map((cred) => { return { 'name': Object.keys(cred)[0], 'val': this.encryptionService.encryptData(pubKey, JSON.stringify(cred)) } });

      let response = {
        'payload': encryptedPayload,
        'credentials': encryptedCredentials ?? []
      }

      return response;

    } catch (error) {
      console.error('Error encrypting data', error);
      return null;
    }
  }

  //TODO: deprecate
  public async encryptBatch(data: string[]): Promise<any[] | null> {
    if (!this.web3) {
      console.error('MetaMask is not available');
      return null;
    }

    const account = await this.getAccount();

    if (!account) {
      return null;
    }

    try {
      const pubKey = await this.getEncryptionPublicKey(account);

      if (!pubKey) {
        return null;
      }

      let encryptedDataBatched: any[] = [];

      data.forEach((item) => {
        encryptedDataBatched.push(this.encryptionService.encryptData(pubKey, JSON.stringify(item)))
      });

      return encryptedDataBatched;

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


  public async getServerPublicKey(): Promise<string | undefined> {
    if (this.serverPubKey) {
      return this.serverPubKey;
    }

    const response = await this.http.get<any>(`${this.apiUrl}/siwe/publicKey`).toPromise();
    this.serverPubKey = response.message;
    return this.serverPubKey;
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

  public async getAccount(): Promise<string | null> {
    if (!this.web3) {
      console.error('MetaMask is not available');
      return null;
    }

    const accounts = await this.web3.eth.getAccounts();
    if (accounts.length === 0) {
      console.error('No accounts found');
      return null;
    }

    return accounts[0];
  }

  public async getEncryptionPublicKey(account: string): Promise<string | null> {
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

  public async logout(): Promise<void> {
    // Disconnect from MetaMask
    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_requestAccounts', params: [{ eth_accounts: {} }] })
        .then(async () => {
          const ethAddress = await this.getEthAddresses();

          if (ethAddress != null && ethAddress.length > 0) {
            await firstValueFrom(this.signOutSiwe(ethAddress[0]));
            this.connectedToWallet.next(false);
            this.toastNotificationService.info('Wallet Connection', 'Disconnected WIDE application and MetaMask');
          }
        })
        .catch((error: Error) => {
          this.toastNotificationService.error('Wallet Connection', 'Error disconnecting MetaMask wallet');
          console.error('Error disconnecting MetaMask wallet:', error);
        });
    } else {
      this.toastNotificationService.error('Wallet Connection', 'MetaMask is not available');
    }
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

  public isCheckingMetaMask(): boolean {
    return this.metaMaskCheckStatus.value;
  }

  public hashDataKeccak256(data: any): string | undefined {
    const canonicalizedData = canonicalize(data);
    const stringifiedData = JSON.stringify(canonicalizedData);
    return this.web3?.utils.keccak256(stringifiedData);
  }

  public hashTextKeccak256(textData: string): string | undefined {
    return this.web3?.utils.keccak256(textData);
  }
}
