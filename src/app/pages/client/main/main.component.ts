import { AfterContentInit, AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavMenuComponent } from '../../../components/nav-menu/nav-menu.component';
import { NavHeaderComponent } from '../../../components/nav-header/nav-header.component';
import { BreadcrumbService } from '../../../services/breadcrumb.service';
import { Web3WalletService } from '../../../services/web3-wallet.service';
import { Subscription } from 'rxjs';
import { EncryptedCredentialComponent } from '../../../components/table/encrypted-credential/encrypted-credential.component';

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


  constructor(private web3WalletService: Web3WalletService, private breadcrumbService: BreadcrumbService) {
    this.walletSubscription = this.web3WalletService.connectedToWallet$.subscribe(walletConnected => {
      console.log('Wallet connected:', walletConnected);

      if (walletConnected) {
        this.credentials = [
          { 'name': 'Google Profile', 'type': 'Google Oauth', 'dateadded': new Date(), 'datevaliduntil': null, 'status': 0, 'isDecrypting': false },
          { 'name': 'Drivers License', 'type': 'EUDIW', 'dateadded': new Date(), 'datevaliduntil': new Date().setMonth(6), 'status': 0, 'isDecrypting': false }
        ]

        this.credentials.forEach((c) => {
          c.isDecrypting = true;
          setTimeout(() => c.status = 1, (Math.random() * 1000) + 2000)
        });
      }
    });
  }

  ngOnInit() {
    //https://angular.io/errors/NG0100
    Promise.resolve().then(() =>
      this.breadcrumbService.setBreadcrumbs(['Your credentials', 'Add Credentials'])
    );
  }

  getWeb3WalletService(): Web3WalletService {
    return this.web3WalletService;
  }
}
