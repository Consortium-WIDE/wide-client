import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Web3WalletService } from '../../services/web3-wallet.service';
import { siEthereum } from 'simple-icons';
import { DomSanitizer } from '@angular/platform-browser';
import { WideModalComponent } from '../wide-modal/wide-modal.component';

@Component({
  selector: 'app-nav-header',
  standalone: true,
  imports: [CommonModule, WideModalComponent],
  templateUrl: './nav-header.component.html',
  styleUrl: './nav-header.component.scss'
})
export class NavHeaderComponent {
  @Input() title: string | null = null;
  @Input() breadcrumbs: string[] | null = null;

  showMetaMaskWalletModal = false;
  showMetaMaskConnectModal = false;

  isConnected: boolean = false;

  ethereumIcon = siEthereum

  accounts: string[] | null = [];

  constructor(private web3WalletService: Web3WalletService, private sanitizer: DomSanitizer) { }

  //TODO: handle edgecase when isConnected is true and accounts is null or empty: prompt user to connect an account
  ngOnInit(): void {
    if (this.web3WalletService.isMetaMaskInstalled()) {
      this.connectWallet();
    }
  }

  //TODO: Connect Wallet, check if already signed message. Check secure session/cookie, possibly ask to sign another message
  async connectWallet() {
    if (!this.web3WalletService.isMetaMaskInstalled()) {

      this.showMetaMaskWalletModal = true;

    } else {
      await this.web3WalletService.connect().then(async (connected) => {
        if (connected) {
          console.info('Connected to Metamask');

          await this.web3WalletService.getEthAddresses().then((accounts) => {
            if (accounts && accounts?.length > 0) {
              this.accounts = accounts;
              this.isConnected = true;
            } else {
              this.showMetaMaskConnectModal = true;
              this.isConnected = false;
            }
          })
            .catch((err) => {
              this.isConnected = false;
              console.error(err);
            })
        } else {
          console.error('Failed to connect to Metamask');
          this.showMetaMaskConnectModal = true;
        }
      });

    }
  }

  abridgeEthereumAddress(address: string): string {
    return this.web3WalletService.abridgeEthereumAddress(address, 6, 4);
  }

  get ethereumIconSVG() {
    return this.sanitizer.bypassSecurityTrustHtml(this.ethereumIcon.svg);
  }

  closeMetaMaskWalletModal() {
    this.showMetaMaskWalletModal = false;
  }

  closeMetaMaskConnectModal() {
    this.showMetaMaskConnectModal = false;
  }
}
