import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import Web3 from 'web3';
import { isAddress } from 'web3-validator';
import { environment } from '../../environments/environment';
import { SiweMessage } from 'siwe';

declare let window: any;

@Injectable({
  providedIn: 'root'
})
export class Web3WalletService {
  private web3: Web3 | null = null;
  private connectedToWallet = new BehaviorSubject<boolean>(false);
  private apiUrl = environment.wideServerApiUrl; // Replace with your actual API URL

  connectedToWallet$ = this.connectedToWallet.asObservable();

  constructor(private http: HttpClient) { }

  public async connect(): Promise<boolean> {
    let connectSuccess = false;

    if (!this.isMetaMaskInstalled()) {
      connectSuccess = false;
    } else {

      let ethRequestAccountsFailed = false;
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        //TODO: Check if HttpsCookie is set and valid, otherwise, do SIWE procedure

        const ethAddress = await this.getEthAddresses();
        if (ethAddress != null && ethAddress.length > 0) {
          await this.getSiweMessage(ethAddress[0]).subscribe({
            next: async (siweMessageRaw) => {
              const siweMessage = new SiweMessage(siweMessageRaw.message);
              const msgToSign = siweMessage.prepareMessage();
              
              const signedMessage = await this.signMessage(msgToSign);
              if (signedMessage) {
                await this.verifySiweMessage(siweMessage, signedMessage).subscribe({
                  next: async (siweResponse) => {
                    console.log('siweResponse', siweResponse)
                    alert(siweResponse.message);
                  },
                  error: (err) => console.error(err),
                  complete: () => console.info('verifySiweMessage complete')
                });
              }
            },
            error: (err) => console.error(err),
            complete: () => console.info('getSiweMessage complete')
          });
        }

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

  public isMetaMaskInstalled(): boolean {
    const metaMaskInstalled = (typeof window.ethereum !== 'undefined') && window.ethereum.isMetaMask;

    if (metaMaskInstalled) {
      this.web3 = new Web3(window.ethereum);
    }

    return metaMaskInstalled;

  }

  public getSiweMessage(accountAddress: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/siwe/generate_message?ethereumAddress=${accountAddress}`);
  }

  public verifySiweMessage(siweMessage: SiweMessage, siweSignature: string): Observable<any> {
    const payload = { "message": siweMessage, "signature": siweSignature };
    return this.http.post(`${this.apiUrl}/siwe/verify_message`, payload);
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
