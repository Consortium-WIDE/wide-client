import { AfterContentInit, AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavMenuComponent } from '../../../components/nav-menu/nav-menu.component';
import { NavHeaderComponent } from '../../../components/nav-header/nav-header.component';
import { NavMenuService } from '../../../services/nav-menu.service';
import { Web3WalletService } from '../../../services/web3-wallet.service';
import { Subscription } from 'rxjs';
import { EncryptedCredentialComponent } from '../../../components/table/encrypted-credential/encrypted-credential.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, NavMenuComponent, NavHeaderComponent, EncryptedCredentialComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent implements OnInit {
  private walletSubscription: Subscription;

  //TODO: Strongly type
  credentials: any[] = [];


  constructor(private web3WalletService: Web3WalletService, private navMenuService: NavMenuService, private router: Router) {
    this.walletSubscription = this.web3WalletService.connectedToWallet$.subscribe(walletConnected => {
      if (walletConnected) {
        this.credentials = [
          {
            'name': 'Google Profile', 'type': 'Google Oauth', 'dateadded': new Date(), 'datevaliduntil': null, 'status': 0, 'isDecrypting': false,
            'props': [
              { 'name': 'Profile ID', 'value': 'abc123', 'status': 0, 'isDecrypting': false },
              { 'name': 'Name', 'value': 'John', 'status': 0, 'isDecrypting': false },
              { 'name': 'Surname', 'value': 'Doe', 'status': 0, 'isDecrypting': false },
              { 'name': 'Email', 'value': 'john.doe@donotmessage.com', 'status': 0, 'isDecrypting': false },
            ]
          },
          {
            'name': 'Drivers License', 'type': 'EUDIW', 'dateadded': new Date(), 'datevaliduntil': new Date().setMonth(6), 'status': 0, 'isDecrypting': false,
            'props': [
              { 'name': 'Name', 'value': 'John', 'status': 0, 'isDecrypting': false },
              { 'name': 'Surname', 'value': 'Doe', 'status': 0, 'isDecrypting': false },
              { 'name': 'Address', 'value': '1, Road Street, Brussels, Belgium', 'status': 0, 'isDecrypting': false },
              { 'name': 'Valid From', 'value': '5-May-2015', 'status': 0, 'isDecrypting': false },
              { 'name': 'Valid To', 'value': '5-May-2025', 'status': 0, 'isDecrypting': false },
              { 'name': 'Issued By', 'value': 'Belgium Road Authority', 'status': 0, 'isDecrypting': false },
            ]
          }
        ]

        // this.credentials.forEach((c) => {
        //   c.isDecrypting = true;
        //   setTimeout(() => c.status = 1, (Math.random() * 1000) + 2000)
        // });
      }
    });
  }

  ngOnInit() {
    this.navMenuService.setPageDetails('Home', ['Your credentials']);
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
      return cred.props.some( (p: any) => p.status != 2);
    }

    return false;
  }
}
