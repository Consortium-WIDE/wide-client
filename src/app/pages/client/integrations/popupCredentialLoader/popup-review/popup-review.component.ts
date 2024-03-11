import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Web3WalletService } from '../../../../../services/web3-wallet.service';
import { ToastNotificationService } from '../../../../../services/toast-notification.service';
import { environment } from '../../../../../../environments/environment';
import { CredentialHelperService } from '../../../../../services/credential-helper.service';
import { WideStorageService } from '../../../../../services/wide-storage.service';
import { firstValueFrom } from 'rxjs';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-popup-review',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './popup-review.component.html',
  styleUrl: './popup-review.component.scss'
})
export class PopupReviewComponent implements OnInit {
  waitingForData: boolean = true;
  showRawData: boolean = false;
  referrer: string = 'source';
  payload: any = {};
  config: any = {};
  credentialToUpdate: any = null;

  exists: boolean = false;

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
          this.payload = event.data.payload;

          //TODO: Probably a better way to streamline the config for the back flow
          if (!this.config.allowMultiples) {
            this.exists = await this.checkForExistingCredentials();
          }
          
          this.waitingForData = false;
        }
      });

      window.opener.postMessage({ status: 'ready' }, this.referrer);
    } else {
      console.error('Failed to retrieve window state');
    }
  }

  cancel(cancelReasonCode: string): void {
    window.opener.postMessage({ status: cancelReasonCode }, this.referrer);
    window.close();
  }

  async checkForExistingCredentials(): Promise<boolean> {
    const account = await this.web3WalletService.getAccount();

    if (!account) {
      this.toastNotificationService.error('Error', 'Cannot find wallet address');
      throw new Error('Account has not been set!');
    }

    const credentialFilter: any = {
      "type": this.payload.issuer.type
    }

    return new Promise<boolean>((resolve, reject) => {
      this.wideStorageService.getUserIssuedCredentials(account).subscribe({
        next: (response: HttpResponse<any>) => {
          if (response.status === 204) {
            // If we have no credentials, it definitely does not exist
            resolve(false);
          } else {
            const issuedCredentials = response.body;
            const matchingCredentials = this.credentialHelperService.findMatchingCredentials(issuedCredentials, credentialFilter, true);
            resolve(matchingCredentials.length !== 0);
          }
        },
        error: (res) => {
          this.toastNotificationService.error(res.statusText, `Failed to load credentials (${res.status})`);
          console.error('Failed to load credentials', res);
          reject(res);
        }
      });
    });
  }

  //TODO: Move to common service
  async encryptData() {
    const accountAddress = await this.web3WalletService.getAccount();

    if (!accountAddress) {
      this.toastNotificationService.error('Error', 'Cannot find wallet address');
      return;
    }

    const issuerPayload = {
      "label": this.payload.issuer.label,
      "id": `${environment.wideDomain}/schemas/generic`,
      "type": this.payload.issuer.type,
      "issuer": this.payload.issuer.issuer,
      "issuanceDate": new Date().toISOString(),
      "credentialSubject": this.payload.issuer.credentialSubject
    }

    const encryptedData = await this.web3WalletService.encryptPayload(this.payload.data);

    if (!encryptedData) {
      this.toastNotificationService.error('Error', 'Unable to encrypt your data');
    } else {

      this.toastNotificationService.info('Success', 'Successfully encrypted your data');

      const navigationExtras = {
        state: {
          accountAddress: accountAddress,
          issuer: issuerPayload,
          rawDataHash: this.web3WalletService.hashDataKeccak256(this.payload),
          encryptedData: encryptedData,
          dataSource: this.payload,
          referrer: this.referrer,
          config: this.config
        }
      };

      this.router.navigate(['popup/store'], navigationExtras);
    }
  }

  //TODO: Place in common library
  getDomainFromURL(url: string): string {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.origin;
    } catch (error) {
      console.error("Error parsing URL:", error);
      throw error;
    }
  }
}
