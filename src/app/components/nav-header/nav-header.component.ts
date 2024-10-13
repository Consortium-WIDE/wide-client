import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Web3WalletService } from '../../services/web3-wallet.service';
import { siEthereum } from 'simple-icons';
import { DomSanitizer } from '@angular/platform-browser';
import { WideModalComponent } from '../wide-modal/wide-modal.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-header',
  standalone: true,
  imports: [CommonModule, WideModalComponent],
  templateUrl: './nav-header.component.html',
  styleUrl: './nav-header.component.scss'
})
export class NavHeaderComponent implements OnInit {
  @Input() title: string | null = null;
  @Input() breadcrumbs: string[] | null = null;

  showMetaMaskWalletModal = false;
  showMetaMaskConnectModal = false;

  metaMaskCheckPending = true;

  isConnected: boolean = false;

  ethereumIcon = siEthereum

  accounts: string[] | null = [];

  constructor(private web3WalletService: Web3WalletService, private router: Router, private sanitizer: DomSanitizer) {
    this.subscribeToWalletConnection();
  }

  async ngOnInit(): Promise<void> {
    setTimeout(async () => {
      if (this.web3WalletService.isMetaMaskInstalled()) {
        const isMetaMaskUnlocked = await this.web3WalletService.isMetaMaskUnlocked();
        this.metaMaskCheckPending = false;
        if (isMetaMaskUnlocked) {
          await this.connectWallet();
        }
      } else {
        this.showMetaMaskWalletModal = true;
        this.metaMaskCheckPending = false;
      }
    }, 1500);
    this.subscribeToWalletConnection();
  }

  private subscribeToWalletConnection() {
    this.web3WalletService.connectedToWallet$.subscribe(walletConnected => {
      this.isConnected = walletConnected;
    });
  }

  goBack() {
    window.history.back();
  }

  showBackButton(): boolean {
    return this.router.url !== '/';
  }

  //TODO: Connect Wallet, check if already signed message. Check secure session/cookie, possibly ask to sign another message
  async connectWallet() {
    if (!this.web3WalletService.isMetaMaskInstalled()) {
      this.showMetaMaskWalletModal = true;
    } else {
      await this.web3WalletService.connect().then(async (connected) => {
        if (connected) {
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
