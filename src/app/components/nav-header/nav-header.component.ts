import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Web3WalletService } from '../../services/web3-wallet.service';
import { siEthereum } from 'simple-icons';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-nav-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nav-header.component.html',
  styleUrl: './nav-header.component.scss'
})
export class NavHeaderComponent {
  @Input() title: string | null = null;
  @Input() breadcrumbs: string[] | null = null;

  isConnected: boolean = false;

  ethereumIcon = siEthereum

  accounts: string[] | null = [];

  constructor(private web3WalletService: Web3WalletService, private sanitizer: DomSanitizer) { }

  //TODO: handle edgecase when isConnected is true and accounts is null or empty: prompt user to connect an account
  ngOnInit(): void {
    if (this.web3WalletService.isConnectedToWallet()) {
      this.isConnected = true;

      this.web3WalletService.getEthAddresses().then((addresses) => {
        if (addresses) {
          this.accounts = addresses;
        }
      }).catch((err) => console.error(err));
    } else {
      //TODO: Connect Flow!
    }
  }

  //TODO: Connect Wallet, check if already signed message. Check secure session/cookie, possibly ask to sign another message
  async connectWallet() {
    await this.web3WalletService.connect().then(async (connected) => {
      if (connected) {
        console.info('Connected to Metamask');

        await this.web3WalletService.getEthAddresses().then((accounts) => {
          if (accounts) {
            this.accounts = accounts;
            this.isConnected = true;
          } else {
            this.isConnected = false;
          }
        })
          .catch((err) => {
            this.isConnected = false;
            console.error(err);
          })
      } else {
        console.error('Failed to connect to Metamask');
      }
    });
  }

  abridgeEthereumAddress(address: string): string {
    return this.web3WalletService.abridgeEthereumAddress(address, 6, 4);
  }

  get ethereumIconSVG() {
    return this.sanitizer.bypassSecurityTrustHtml(this.ethereumIcon.svg);
  }
}
