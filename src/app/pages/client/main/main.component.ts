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

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, NavMenuComponent, NavHeaderComponent, EncryptedCredentialComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent implements OnInit {
  private walletSubscription: Subscription;
  private account: string | null = null;

  //TODO: Strongly type
  credentials: any[] = [];


  constructor(private web3WalletService: Web3WalletService, private wideStorageService: WideStorageService, private toastNotificationService: ToastNotificationService, private navMenuService: NavMenuService, private router: Router) {
    this.walletSubscription = this.web3WalletService.connectedToWallet$.subscribe(walletConnected => {
      if (walletConnected) {
        this.web3WalletService.getAccount()
          .then((account: any) => {
            this.account = account;

            this.refreshAccountCredentials(account);
            //TODO: For reference while implementing, remove when ready
            // this.credentials = [
            //   {
            //     'name': 'Google Profile', 'type': 'Google Oauth', 'dateadded': new Date(), 'datevaliduntil': null, 'status': 0, 'isDecrypting': false,
            //     'props': [
            //       { 'name': 'Profile ID', 'value': 'abc123', 'status': 0, 'isDecrypting': false },
            //       { 'name': 'Name', 'value': 'John', 'status': 0, 'isDecrypting': false },
            //       { 'name': 'Surname', 'value': 'Doe', 'status': 0, 'isDecrypting': false },
            //       { 'name': 'Email', 'value': 'john.doe@donotmessage.com', 'status': 0, 'isDecrypting': false },
            //     ]
            //   },
            //   {
            //     'name': 'Drivers License', 'type': 'EUDIW', 'dateadded': new Date(), 'datevaliduntil': new Date().setMonth(6), 'status': 0, 'isDecrypting': false,
            //     'props': [
            //       { 'name': 'Name', 'value': 'John', 'status': 0, 'isDecrypting': false },
            //       { 'name': 'Surname', 'value': 'Doe', 'status': 0, 'isDecrypting': false },
            //       { 'name': 'Address', 'value': '1, Road Street, Brussels, Belgium', 'status': 0, 'isDecrypting': false },
            //       { 'name': 'Valid From', 'value': '5-May-2015', 'status': 0, 'isDecrypting': false },
            //       { 'name': 'Valid To', 'value': '5-May-2025', 'status': 0, 'isDecrypting': false },
            //       { 'name': 'Issued By', 'value': 'Belgium Road Authority', 'status': 0, 'isDecrypting': false },
            //     ]
            //   }
            // ]
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
    await this.wideStorageService.getUserCredentials(account).subscribe({
      next: (response: HttpResponse<any>) => {
        this.credentials = response.body;

        if (response.status == 204) {
          this.toastNotificationService.info('Loading credentials', `No credentials found for ${account}`);
        }
      },
      error: (res) => {
        this.toastNotificationService.error(`Failed to load credentials (${res.status})`, res.error ?? res.statusText, 5000000);
        console.log('response-error', res.error ?? res.statusText);
      }
    });
  }

  getWeb3WalletService(): Web3WalletService {
    return this.web3WalletService;
  }

  goTo(uri: string): void {
    this.router.navigate([uri]);
  }

  //TODO: Define credential type for strong typing
  expand(cred: any) {
    if (cred.expanded === undefined) {
      cred.expanded = true;
    } else {
      cred.expanded = !cred.expanded;
    }
  }

  async decryptProperty(cred: any, prop: any) {
    console.info('decrypting property', prop);
    prop.isDecrypting = true;

    prop.status = 1;
    await this.web3WalletService.signMessage('User will not be asked to sign message, but decrypt. This is just to simulate the flow');

    prop.status = 2;

    console.info('decrypted successfully', prop);
  }

  async decryptCred(cred: any) {
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
}
