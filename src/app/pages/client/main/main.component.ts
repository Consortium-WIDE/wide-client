import { AfterContentInit, AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavMenuComponent } from '../../../components/nav-menu/nav-menu.component';
import { NavHeaderComponent } from '../../../components/nav-header/nav-header.component';
import { NavMenuService } from '../../../services/nav-menu.service';
import { Web3WalletService } from '../../../services/web3-wallet.service';
import { Subscription, catchError, firstValueFrom, throwError } from 'rxjs';
import { EncryptedCredentialComponent } from '../../../components/table/encrypted-credential/encrypted-credential.component';
import { Router } from '@angular/router';
import { WideStorageService } from '../../../services/wide-storage.service';
import { HttpResponse } from '@angular/common/http';
import { ToastNotificationService } from '../../../services/toast-notification.service';
import { WideModalComponent } from '../../../components/wide-modal/wide-modal.component';
import { ButtonConfig, MultiButtonComponent } from '../../../components/multi-button/multi-button.component';
import { consumerPollProducersForChange } from '@angular/core/primitives/signals';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, NavMenuComponent, NavHeaderComponent, EncryptedCredentialComponent, WideModalComponent, MultiButtonComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent implements OnInit {
  private walletSubscription!: Subscription;
  private account: string | null = null;

  showIssuerDetailsModal: boolean = false;
  issuerDetailsModalData: any = null;

  showCredentialPreviewModal: boolean = false;
  credentialPreviewData: any = null;

  //TODO: Strongly type, include in presentation components etc...
  issuedCredentials: any[] = [];
  credentialDetailLookup: any = {};

  constructor(private web3WalletService: Web3WalletService, private wideStorageService: WideStorageService, private toastNotificationService: ToastNotificationService, private navMenuService: NavMenuService, private router: Router) {
    this.subscribeToWalletConnection();
  }

  ngOnInit() {
    this.navMenuService.setPageDetails('Home', ['Your credentials']);

    this.web3WalletService.metaMaskCheckStatus$.subscribe(status => {
      // React to the check status
    });

    this.subscribeToWalletConnection();
  }

  async refreshAccountCredentials(account: string): Promise<void> {
    await this.wideStorageService.getUserIssuedCredentials(account).subscribe({
      next: (response: HttpResponse<any>) => {
        this.issuedCredentials = response.body;

        if (response.status == 204) {
          this.toastNotificationService.info('Loading credentials', `No credentials found for ${account}`);
        }
      },
      error: (res) => {
        this.toastNotificationService.error(res.statusText, `Failed to load credentials (${res.status})`);
        console.error('Failed to load credentials', res);
      }
    });
  }

  private subscribeToWalletConnection() {
    this.walletSubscription = this.web3WalletService.connectedToWallet$.subscribe(walletConnected => {
      if (walletConnected) {
        this.web3WalletService.getAccount()
          .then((account: any) => {
            this.account = account;
            this.refreshAccountCredentials(account);
          }).catch((error: any) => {
            console.error(error);
          });
      }
    });
  }

  getWeb3WalletService(): Web3WalletService {
    return this.web3WalletService;
  }

  goTo(uri: string): void {
    this.router.navigate([uri]);
  }

  async expand(row: any) {
    if (!this.account) {
      this.toastNotificationService.info('Unable to retrieve credential', 'Please make sure your wallet is connected first');
      return;
    }

    if (row.expanded === undefined) {
      //We call this to lazy load if not available
      const credentials = await this.getCredentialsForIssuer(row.wideInternalId)
      if (credentials) {
        row.expanded = true;
      }
    } else {
      row.expanded = !row.expanded;
    }
  }

  async decryptProperty(cred: any) {
    cred.isDecrypting = true;
    cred.status = 1;

    const response: any = await this.web3WalletService.decryptData(cred.val);
    const decryptedData: any = JSON.parse(response);

    if (decryptedData && decryptedData.hasOwnProperty(cred.name)) {
      cred.decryptedValue = decryptedData[cred.name];
      cred.status = 2;
      this.toastNotificationService.info('Decryption Complete', `Successfully decrypted data for ${cred.name}`)
    } else {
      cred.status = 0;
      this.toastNotificationService.error('Failed Decrypting', `Unable to retrieve value from decrypted data for ${cred.name}`);
      console.error('Unable to retrieve value from decrypted data. Returned value: ', decryptedData);
    }

    cred.isDecrypting = false;
  }

  async decryptCredential(issuer: any) {
    const issuerCredentialData = await this.getCredentialsForIssuer(issuer.wideInternalId);

    if (!issuerCredentialData) {
      this.toastNotificationService.error('Cannot decrypt', 'Unable to find any credentials for this issuer');
      return;
    }

    issuerCredentialData.credentials.forEach((cred: any) => {
      cred.isDecrypting = true;
      cred.status = 1;
    });

    const response: any = await this.web3WalletService.decryptData(issuerCredentialData.payload);
    const decryptedData: any = JSON.parse(response);

    issuerCredentialData.credentials.forEach((cred: any) => {
      cred.decryptedValue = decryptedData[cred.name];
      cred.isDecrypting = false;
      cred.status = 2;
    });

    this.toastNotificationService.info('Successful Decryption', 'Successfully decrypted all credentials');
  }

  issuerHasDecryptPending(issuer: any) {
    if (!this.credentialDetailLookup[issuer.wideInternalId]) {
      return true;
    }

    const credentials = this.credentialDetailLookup[issuer.wideInternalId].credentials;

    if (credentials && credentials.length > 0) {
      return credentials.some((c: any) => c.status != 2);
    }

    return false;
  }

  async getCredentialsForIssuer(issuerInternalId: string): Promise<any | null> {
    if (!this.credentialDetailLookup[issuerInternalId] && this.account) {
      try {
        const response: HttpResponse<any> = await firstValueFrom(
          this.wideStorageService.getEncryptedCredentials(this.account, issuerInternalId)
        );

        this.credentialDetailLookup[issuerInternalId] = response.body;

        if (response.status === 204) {
          this.toastNotificationService.info('Loading credentials', `No credentials found for ${this.account} with key ${issuerInternalId}`);
        }

        return this.credentialDetailLookup[issuerInternalId];
      } catch (error: any) {
        this.toastNotificationService.error(error.statusText, `Failed to load credentials (${error.status})`);
        console.error('Failed to load credentials', error);
        return null;
      }
    } else {
      return this.credentialDetailLookup[issuerInternalId];
    }
  }

  async issuerActionClick(action: string, issuer: any) {
    switch (action) {
      case 'decrypt':
        await this.decryptCredential(issuer);
        break;
      case 'preview-cred':
        await this.showWideCredentialPreviewModal(issuer);
        break;
      case 'download':
        alert('Do we need this? just a sample for now...');
        break;
    }
  }

  getFaviconUrl(url: string): string {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'http://' + url;
    }

    // Construct and return the favicon URL
    const urlObj = new URL(url);
    return `${urlObj.origin}/favicon.ico`;
  }

  showIssuerModal(issuer: any): any {
    this.issuerDetailsModalData = issuer;
    this.showIssuerDetailsModal = true;
  }

  async showWideCredentialPreviewModal(issuer: any) {
    const credentialDetails = this.credentialDetailLookup[issuer.wideInternalId];

    if (!credentialDetails) {
      this.toastNotificationService.error('Internal Error', 'An internal error has occurred');
    }

    this.credentialPreviewData = await this.generateWideCredentialPreview(issuer, credentialDetails);
    this.showCredentialPreviewModal = true;
  }

  async generateWideCredentialPreview(issuer: any, credentialsContainer: any): Promise<any> {
    const serverPubKey = await this.web3WalletService.getServerPublicKey();

    let vc = {
      "id": "http://wid3.xyz",
      "type": ["WIDECredential"],
      "issuer": serverPubKey,
      "issuanceDate": new Date().toISOString(),
      "credentialSubject": {
        "id": issuer.credentialSubject.id,
        "dataTypes": {
          "type": "credentialSources",
          "name": "Original Credential Sources",
          "value": [issuer.type]
        },
        "issuerDomains": [
          {
            "id": issuer.id,
            "name": issuer.issuer,
            "label": issuer.label,
            "type": issuer.type,
            "data": {
              "payloadKeccak256CipherText": this.web3WalletService.hashTextKeccak256(credentialsContainer.payload.ciphertext),
              "credentials": [] as any[]
            }
          }
        ]
      }
    }

    await credentialsContainer.credentials.forEach((c: any) => {
      if (c.decryptedValue) {
        vc.credentialSubject.issuerDomains[0].data.credentials.push({
          "name": c.name,
          "value": c.decryptedValue,
          "type": "plainText"
        });
      } else {
        vc.credentialSubject.issuerDomains[0].data.credentials.push({
          "name": c.name,
          "value": this.web3WalletService.hashDataKeccak256(c.val.ciphertext),
          "type": "proof"
        });
      }
    });

    return vc;
  }

  getActionMenuButtons(issuer: any): ButtonConfig[] {
    let buttonConfig: ButtonConfig[] = [];

    if (this.issuerHasDecryptPending(issuer)) {
      buttonConfig.push({ label: 'Decrypt', action: 'decrypt' });
    }

    buttonConfig.push({ label: 'Preview Credential', action: 'preview-cred' });
    buttonConfig.push({ label: 'Download', action: 'download' });

    return buttonConfig;
  }

}
