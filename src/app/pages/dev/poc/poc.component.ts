import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { ClaimsProcessorService } from '../../../services/claims-processor.service';
import { WideStorageService } from '../../../services/wide-storage.service';

@Component({
  selector: 'app-poc',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './poc.component.html',
  styleUrl: './poc.component.scss'
})
export class PocComponent {
  inputData = JSON.stringify({ "key1": "value", "key2": "val2" });

  messageToSign: string = "";
  encryptedData: any = {};
  encryptedDataString: string = JSON.stringify(this.encryptedData);
  decryptedData: any = {};
  decryptedDataString: string = JSON.stringify(this.decryptedData);

  connectedToWallet: boolean = false;

  walletData: any = {
    publicKeys: null,
    publicEncryptKey: null
  }

  constructor(private claimsProcessorService: ClaimsProcessorService, private wideStorageService: WideStorageService) {
    this.connectedToWallet = claimsProcessorService.isConnectedToWallet();
  }

  async encryptClaim(onlyJson: boolean = true) {
    try {
      let data = this.inputData;

      if (onlyJson) {
        // Try parsing the JSON data
        data = JSON.parse(this.inputData);
      }

      this.encryptedData = await this.claimsProcessorService.encryptData(data);
      this.encryptedDataString = JSON.stringify(this.encryptedData);
    } catch (error) {
      // Handle parsing error
      console.error(error);
    }
  }

  async signClaim() {
    this.claimsProcessorService.signMessage(this.messageToSign).then(signature => {
      console.log("Signature:", signature);
    }).catch(error => {
      console.error("Error:", error);
    });
  }

  async decryptClaim() {
    try {
      this.encryptedData = JSON.parse(this.encryptedDataString);
      this.decryptedData = await this.claimsProcessorService.decryptData(this.encryptedData);

      this.decryptedDataString = JSON.parse(this.decryptedData);

    } catch (error) {
      // Handle parsing error
      console.error(error);
    }
  }

  //////////////////////////
  async fetchAccounts() {
    this.claimsProcessorService.getPublicKeys().then(async accounts => {
      if (accounts) {
        console.debug('accounts', accounts);
        this.walletData.publicKeys = accounts;
      } else {
        throw 'No access to public keys. Is metamask unlocked?'
      }
    }).catch(error => {
      console.error("Error:", error);
    });
  }

  async fetchEncryptKey() {
      if (this.walletData.publicKeys) {
        if (this.walletData.publicKeys.length > 0) {
          await this.fetchPublicEncryptKey(this.walletData.publicKeys[0]);
        }
      } else {
        throw 'No access to public keys. Is metamask unlocked?'
      }
  }

  async fetchPublicEncryptKey(account: string) {
    this.wideStorageService.getPublicKey(account).subscribe({
      next: (pubKey) => {
        this.walletData.publicEncryptKey = pubKey;
      },
      error: (err) => console.error(err),
      complete: () => console.info('fetchPublicEncryptKey complete')
    });
  }

  async registerEncryptKey() {
    if (this.walletData.publicKeys) {
      const account = this.walletData.publicKeys[0];
      this.claimsProcessorService.getEncryptionPublicKey(account).then(async encPubKey => {
        console.debug('Encryption Public Key', encPubKey);
        if (encPubKey) {
          this.wideStorageService.setPublicKey(account, encPubKey).subscribe({
            next: (response) => console.log('response', response),
            error: (err) => console.error(err),
            complete: () => console.info('fetchPublicEncryptKey complete')
          })
        }
      });
    } else {
      console.error('Public Keys need to be retrieved first');
    }
  }
}
