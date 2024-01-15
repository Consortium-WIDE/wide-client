import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Web3WalletService } from '../../../services/web3-wallet.service';
import { WideModalComponent } from '../../../components/wide-modal/wide-modal.component';

@Component({
  selector: 'app-begin-presentation',
  standalone: true,
  imports: [RouterLink, WideModalComponent],
  templateUrl: './begin-presentation.component.html',
  styleUrl: './begin-presentation.component.scss'
})
export class BeginPresentationComponent {

  showMetaMaskWalletModal = false;
  showMetaMaskConnectModal = false;
  showGettingStartedModal = false;

  accounts: string[] | null = [];

  constructor(private web3WalletService: Web3WalletService, private router: Router) { }

  async connectWallet() {
    if (!this.web3WalletService.isMetaMaskInstalled()) {

      this.showMetaMaskWalletModal = true;

    } else {
      await this.web3WalletService.connect().then(async (connected) => {
        if (connected) {
          await this.web3WalletService.getEthAddresses().then((accounts) => {
            if (accounts && accounts?.length > 0) {
              this.accounts = accounts;
              this.router.navigateByUrl('presentation/request');
            } else {
              this.showMetaMaskConnectModal = true;
            }
          })
            .catch((err) => {
              console.error(err);
            })
        } else {
          console.error('Failed to connect to Metamask');
          this.showMetaMaskConnectModal = true;
        }
      });

    }
  }

  returnToRequestor() {
    window.location.href = "https://google.com"
  }
}
