import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Web3WalletService } from '../../../services/web3-wallet.service';
import { WideModalComponent } from '../../../components/wide-modal/wide-modal.component';
import { WideDataObjectComponent } from '../../../components/wide-data/wide-data-object/wide-data-object.component';
import { ToastNotificationService } from '../../../services/toast-notification.service';
import { HttpResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { WideStorageService } from '../../../services/wide-storage.service';
import { Router } from '@angular/router';
import { CredentialHelperService } from '../../../services/credential-helper.service';
import { IconService } from '../../../services/icon.service';

@Component({
  selector: 'app-presentation-multi-select',
  standalone: true,
  imports: [CommonModule, WideModalComponent, WideDataObjectComponent],
  templateUrl: './presentation-multi-select.component.html',
  styleUrl: './presentation-multi-select.component.scss'
})

export class PresentationMultiSelectComponent implements OnInit {
  domainOrigin: string = '';
  presentationConfig: any = null;
  credentialList: any[] = [];
  pageLoaded: boolean = false;
  isProcessing: boolean = false;
  showCredentialModal: boolean = false;
  selectedCredential: any = undefined;
  account: string | null = null;
  credentialDetailLookup: any = {};

  constructor(private web3WalletService: Web3WalletService, private router: Router, private wideStorageService: WideStorageService, private toastNotificationService: ToastNotificationService, private credentialHelperService: CredentialHelperService, private iconService: IconService) { }

  async ngOnInit(): Promise<void> {
    const historyState = history.state;

    this.domainOrigin = historyState.domainOrigin;
    this.presentationConfig = historyState.presentationConfig;
    this.credentialList = historyState.credentialList;

    //TODO: Redirect and error if domain origin is not found;

    if (this.web3WalletService.isConnectedToWallet()) {
      this.account = await this.web3WalletService.getAccount();
    }

    this.pageLoaded = true;
  }

  //TODO: Put in shared library (pipe)
  getFaviconUrl(url: string): string {
    return this.iconService.getIconFor(url);
  }

  async credentialClick(credentialIssuer: any): Promise<void> {
    const credentialData = await this.getCredentialsForIssuer(credentialIssuer.wideInternalId);

    this.selectedCredential = {
      issuer: credentialIssuer,
      data: credentialData
    }

    // Suppressing feature due to feedback, and calling present directly
    // this.showCredentialModal = true;

    await this.present(this.selectedCredential);
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

  async decryptAll(issuer: any): Promise<void> {
    const issuerCredentialData = await this.getCredentialsForIssuer(issuer.wideInternalId);

    if (!issuerCredentialData) {
      this.toastNotificationService.error('Cannot decrypt', 'Unable to find any credentials for this issuer');
      return;
    }

    issuerCredentialData.credentials.forEach((cred: any) => {
      cred.isDecrypting = true;
      cred.status = 1;
    });

    if (!issuer.decryptedData) {
      issuer.decryptedData = await this.credentialHelperService.decryptCredential(issuerCredentialData.payload);
    }

    issuerCredentialData.credentials.forEach((cred: any) => {
      cred.decryptedValue = issuer.decryptedData[cred.name];
      cred.isDecrypting = false;
      cred.status = 2;
    });

    this.toastNotificationService.info('Successful Decryption', 'Successfully decrypted all credentials');
  }

  async getCredentialsForIssuer(issuerInternalId: string): Promise<any | null> {
    if (!this.account) {
      this.toastNotificationService.error('Unable to retrieve credential', 'Please make sure your wallet is connected first');
      return;
    }

    if (!this.credentialDetailLookup[issuerInternalId]) {
      this.credentialDetailLookup[issuerInternalId] = await this.credentialHelperService.getCredentialsForIssuer(this.account, issuerInternalId);
    }

    return this.credentialDetailLookup[issuerInternalId];
  }

  //This should be improved, it's a bit of a quick and dirty job to fit presentation-request functionality here.
  async present(selection: any): Promise<void> {
    //0. Decrypt Data if it's not yet been decrypted.
    //If it is this wont do anything.
    await this.decryptAll(selection.issuer);

    //1. Fetch and decrypt payload
    const credentialIssuer = selection.issuer;
    const encryptedCredential = await this.getCredentialsForIssuer(selection.issuer.wideInternalId);
    const decryptedCredential = selection.issuer.decryptedData;

    //2. Process request
    const processedCredential = await this.credentialHelperService.processCredential(credentialIssuer, encryptedCredential, decryptedCredential, this.presentationConfig);

    //3. Navigate to Review screen
    this.router.navigateByUrl('present/confirm', { state: { processedCredential: processedCredential, presentationConfig: this.presentationConfig, domainOrigin: this.domainOrigin } });
  }

  //TODO: Add as pipe
  getValueType(decryptedValue: any): string {
    if (Array.isArray(decryptedValue)) {
      return 'array';
    } else if (typeof decryptedValue === 'object' && decryptedValue !== null) {
      return 'object';
    } else {
      return 'other';
    }
  }
}
