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
    this.navMenuService.setPageDetails('Home', ['Your credentials']);
  }

  getWeb3WalletService(): Web3WalletService {
    return this.web3WalletService;
  }

  goTo(uri: string): void {
    this.router.navigate([uri]);
  }
}
