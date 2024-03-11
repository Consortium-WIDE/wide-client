import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Web3WalletService } from '../../../../../services/web3-wallet.service';
import { ToastNotificationService } from '../../../../../services/toast-notification.service';
import { CredentialHelperService } from '../../../../../services/credential-helper.service';
import { WideStorageService } from '../../../../../services/wide-storage.service';
import { HttpResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { TooltipComponent } from '../../../../../components/tooltip/tooltip.component';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-popup-update-review',
  standalone: true,
  imports: [CommonModule, TooltipComponent],
  templateUrl: './popup-update-review.component.html',
  styleUrl: './popup-update-review.component.scss'
})
export class PopupUpdateReviewComponent implements OnInit {
  waitingForData: boolean = true;
  payload: any = {};
  config: any = {};
  referrer: string = 'source';
  credential: any = {};
  issuer: any = {};
  decryptedData: any;
  mergedData: any;
  showRawData: boolean = false;

  constructor(private router: Router, private web3WalletService: Web3WalletService, private toastNotificationService: ToastNotificationService, private credentialHelperService: CredentialHelperService, private wideStorageService: WideStorageService) { }

  async ngOnInit(): Promise<void> {
    let state = null;

    if (this.router.getCurrentNavigation()) {
      // If coming directly via router.navigate()
      state = this.router.getCurrentNavigation()?.extras.state as any;
    } else {
      // If page is refreshed or navigated via URL
      state = history.state;;
    }

    if (state) {
      this.referrer = this.getDomainFromURL(state.referrer);

      window.addEventListener('message', async (event) => {
        if (event.origin === this.referrer) {
          this.config = event.data.config;
          this.payload = Object.fromEntries(
            Object.entries(event.data.payload).filter(([key, value]) => value !== null)
          );

          this.issuer = await this.getIssuer(this.config.wideCredentialId);
          this.credential = await this.getCredential(this.config.wideCredentialId);

          this.waitingForData = false;
        }
      });

      window.opener.postMessage({ status: 'ready' }, this.referrer);
    } else {
      console.error('Failed to retrieve window state');
    }
  }

  async getIssuer(wideCredentialId: string): Promise<any> {
    const account = await this.web3WalletService.getAccount();

    if (!account) {
      this.toastNotificationService.error('Error', 'Cannot find wallet address');
      throw new Error('Account has not been set!');
    }

    return await this.credentialHelperService.getCredentialIssuerById(account, wideCredentialId);
  }

  async getCredential(wideCredentialId: string): Promise<any> {
    const account = await this.web3WalletService.getAccount();

    if (!account) {
      this.toastNotificationService.error('Error', 'Cannot find wallet address');
      throw new Error('Account has not been set!');
    }

    return await this.credentialHelperService.getCredentialsForIssuer(account, wideCredentialId);
  }

  getObjectKeys(obj: object): string {
    return Object.keys(obj).join(', ');
  }

  async decryptCredential(): Promise<void> {
    if (!this.credential) {
      this.toastNotificationService.error('Cannot decrypt', 'Unable to find any credentials for this issuer');
      return;
    }

    this.decryptedData = await this.credentialHelperService.decryptCredential(this.credential.payload);
    this.mergedData = { ...this.decryptedData, ...this.payload }

    this.toastNotificationService.info('Successful Decryption', 'Successfully decrypted all credentials');
  }

  //TODO: Move to common service
  async encryptData() {
    const accountAddress = await this.web3WalletService.getAccount();

    if (!accountAddress) {
      this.toastNotificationService.error('Error', 'Cannot find wallet address');
      return;
    }

    const issuerPayload = this.issuer;
    const encryptedData = await this.web3WalletService.encryptPayload(this.mergedData);

    if (!encryptedData) {
      this.toastNotificationService.error('Error', 'Unable to encrypt your data');
    } else {

      this.toastNotificationService.info('Success', 'Successfully encrypted your data');

      const navigationExtras = {
        state: {
          accountAddress: accountAddress,
          issuer: issuerPayload,
          rawDataHash: this.web3WalletService.hashDataKeccak256(this.mergedData),
          encryptedData: encryptedData,
          dataSource: this.mergedData,
          referrer: this.referrer
        }
      };

      this.router.navigate(['update/store'], navigationExtras);
    }
  }
  getExistingCredentialNames(): string[] {
    return this.credential.credentials.map((c: any) => c.name).join(', ')
  }

  cancel(cancelReasonCode: string): void {
    window.opener.postMessage({ status: cancelReasonCode }, this.referrer);
    window.close();
  }

  getDomainFromURL(url: string): string {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.origin;
    } catch (error) {
      console.error("Error parsing URL:", error);
      throw error;
    }
  }

  isAdded(prop: any): boolean {
    return !(prop.key in this.decryptedData);
  }
  isUpdated(prop: any): boolean {
    return prop.key in this.decryptedData && this.decryptedData[prop.key] !== this.mergedData[prop.key];
  }
  isDeleted(prop: any): boolean {
    return !(prop.key in this.mergedData);
  }

  hasChanged(prop: any): string | null {
    if (this.isAdded(prop)) {
      return 'added';
    }

    if (this.isUpdated(prop)) {
      return 'updated';
    }

    if (this.isDeleted(prop)){
      return 'deleted';
    }

    return null;
  }
}
