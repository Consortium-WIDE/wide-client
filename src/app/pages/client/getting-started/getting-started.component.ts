import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Web3WalletService as Web3WalletService } from '../../../services/web3-wallet.service';
import { Router } from '@angular/router';
import { ToastNotificationService } from '../../../services/toast-notification.service';

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

  constructor(private web3WalletService: Web3WalletService, private toastNotificationService: ToastNotificationService, private router: Router) {

  }

  async connect() {
    if (this.web3WalletService.isMetaMaskInstalled()) {
      await this.web3WalletService.getEthAddresses().then((accounts) => {
        if (accounts != null && accounts.length > 0) {
          this.accounts = accounts;
          this.web3WalletService.getSiweSignUpMessage(accounts[0]).subscribe({
            next: (siweMessage) => {
              this.messageToSign = siweMessage.message.statement;
              this.showSignMessageModal = true;
            },
            error: (err) => console.error(err)
          });
        }
      }).catch((err) => console.error(err))
    } else {
      this.toastNotificationService.showToast('Cannot find Metamask', 'Metamask wallet is required to use WIDE', 'warning', 5000);
    }
  }

  async signTerms() {
    await this.web3WalletService.signTermsOfService().then((response) => {
      if (response) {
        this.router.navigate(['/']);
      }
    }).catch((err) => console.error(err))
      .finally(() => {
        this.showSignMessageModal = false;
      });
  }

}
