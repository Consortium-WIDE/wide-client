import { AfterContentInit, AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavMenuComponent } from '../../../components/nav-menu/nav-menu.component';
import { NavHeaderComponent } from '../../../components/nav-header/nav-header.component';
import { NavMenuService } from '../../../services/nav-menu.service';
import { Web3WalletService } from '../../../services/web3-wallet.service';
import { Subscription, catchError, throwError } from 'rxjs';
import { EncryptedCredentialComponent } from '../../../components/table/encrypted-credential/encrypted-credential.component';
import { Router } from '@angular/router';
import { WideStorageService } from '../../../services/wide-storage.service';
import { HttpResponse } from '@angular/common/http';
import { ToastNotificationService } from '../../../services/toast-notification.service';
import { WideModalComponent } from '../../../components/wide-modal/wide-modal.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, NavMenuComponent, NavHeaderComponent, EncryptedCredentialComponent, WideModalComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent implements OnInit {
  private walletSubscription: Subscription;
  private account: string | null = null;

  showIssuerDetailsModal: boolean = false;
  issuerDetailsModalData: any = null;

  //TODO: Strongly type, include in presentation components etc...
  issuedCredentials: any[] = [];
  credentialDetailLookup: any = { };

  constructor(private web3WalletService: Web3WalletService, private wideStorageService: WideStorageService, private toastNotificationService: ToastNotificationService, private navMenuService: NavMenuService, private router: Router) {
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

  ngOnInit() {
    this.navMenuService.setPageDetails('Home', ['Your credentials']);

    this.web3WalletService.metaMaskCheckStatus$.subscribe(status => {
      // React to the check status
    });
  }

  async refreshAccountCredentials(account: string): Promise<void> {
    await this.wideStorageService.getUserIssuedCredentials(account).subscribe({
      next: (response: HttpResponse<any>) => {
        console.log('response', response);
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

  getWeb3WalletService(): Web3WalletService {
    return this.web3WalletService;
  }

  goTo(uri: string): void {
    this.router.navigate([uri]);
  }

  expand(row: any) {
    if (!this.account){
      this.toastNotificationService.info('Unable to retrieve credential', 'Please make sure your wallet is connected first');
      return;
    }

    if (row.expanded === undefined) {
      if (!this.credentialDetailLookup[row.wideInternalId]){
        this.wideStorageService.getEncryptedCredentials(this.account, row.wideInternalId).subscribe({
          next: (response: HttpResponse<any>) => {
            //TODO: Define credential type for strong typing
            this.credentialDetailLookup[row.wideInternalId] = response.body;
    
            if (response.status == 204) {
              this.toastNotificationService.info('Loading credentials', `No credentials found for ${this.account} with key ${row.wideInternalId}`);
            }
          },
          error: (res) => {
            this.toastNotificationService.error(res.statusText, `Failed to load credentials (${res.status})`);
            console.error('Failed to load credentials', res);
          }
        });;
      }
      row.expanded = true;
    } else {
      row.expanded = !row.expanded;
    }
  }

  async decryptProperty(cred: any) {
    console.info('decrypting property', cred);
    cred.isDecrypting = true;

    cred.status = 1;
    const response: any = await this.web3WalletService.decryptData(cred.val);
    const decryptedData: any = JSON.parse(response);

    if (decryptedData && decryptedData.hasOwnProperty(cred.name)){
      cred.decryptedValue = decryptedData[cred.name];
      cred.status = 2;
      this.toastNotificationService.info('Decryption Complete', `Successfully decrypted data for ${cred.name}`)
    } else {
      cred.status = 0;
      this.toastNotificationService.error('Failed Decrypting', `Unable to retrieve value from decrypted data for ${cred.name}`);
      console.error('Unable to retrieve value from decrypted data. Returned value: ', decryptedData);
    }
  }

  async decryptCred(cred: any) {

    //TODO: Continue here
    console.info('decrypting credential', cred);

    cred.isDecrypting = true;
    cred.status = 1;
    cred.props.forEach((prop: any) => {
      prop.isDecrypting = true;
      prop.status = 1;
    });

    await this.web3WalletService.signMessage('User will not be asked to sign message, but decrypt. This is just to simulate the flow');

    cred.status = 2;
    cred.props.forEach((prop: any) => {
      prop.status = 2;
    });

    console.info('decrypted successfully', cred);
  }

  credHasDecryptPending(cred: any) {
    if (cred.props && cred.props.length > 0) {
      return cred.props.some((p: any) => p.status != 2);
    }

    return false;
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
    console.log(issuer);

    this.issuerDetailsModalData = issuer;
    this.showIssuerDetailsModal = true;
  }

}
