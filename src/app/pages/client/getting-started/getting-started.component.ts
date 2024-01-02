import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Web3WalletService as Web3WalletService } from '../../../services/web3-wallet.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-getting-started',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './getting-started.component.html',
  styleUrl: './getting-started.component.scss'
})
export class GettingStartedComponent {
  accounts: string[] | null = null;
  showSignMessageModal: boolean = false;
  messageToSign: string = '';

  constructor(private web3WalletService: Web3WalletService, private router: Router) {

  }

  async connect() {
    await this.web3WalletService.connect().then(async (connected) => {
      if (connected) {
        console.info('Connected to Metamask');

        await this.web3WalletService.getEthAddresses().then((accounts) => {
          if (accounts != null && accounts.length > 0) {
            this.accounts = accounts;
            this.refreshMessageToSign(accounts[0]);
            this.showSignMessageModal = true;
          }
        })
          .catch((err) => console.error(err))
      } else {
        console.error('Failed to connect to Metamask');
      }
    });
  }

  async signTerms() {
    this.web3WalletService.signMessage(this.messageToSign)
      .then((signedMessage) => {
        //TODO: Send signed message to server to: 1. verify, and 2. register against the address
        alert(signedMessage);

        this.router.navigate(['/']);

      })
      .catch((err) => console.error(err))
      .finally(() => {
        this.showSignMessageModal = false;
      });
  }

  private refreshMessageToSign(ethereumAddress: string) {
    //TODO: Bit of a jerry rigged solution, consider a more elegant implementation.
    this.web3WalletService.getSiweMessage(ethereumAddress).subscribe({
      next: (msgToSign) => {
        this.messageToSign = msgToSign.prepareMessage();
      },
      error: (err) => console.error(err),
      complete: () => console.info('getSiweMessage complete')
    });
  }

}
