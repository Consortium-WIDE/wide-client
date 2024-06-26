import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Web3WalletService as Web3WalletService } from '../../../services/web3-wallet.service';
import { Router } from '@angular/router';
import { ToastNotificationService } from '../../../services/toast-notification.service';
import { HistoryService } from '../../../services/history.service';
import { firstValueFrom } from 'rxjs';
import { ProgressBarComponent } from '../../../components/progress-bar/progress-bar.component';

@Component({
  selector: 'app-getting-started',
  standalone: true,
  imports: [CommonModule, ProgressBarComponent],
  templateUrl: './getting-started.component.html',
  styleUrl: './getting-started.component.scss'
})
export class GettingStartedComponent {
  accounts: string[] | null = null;
  showSignMessageModal: boolean = false;
  messageToSign: string = '';
  statusPct: number = 0;

  constructor(private web3WalletService: Web3WalletService, private toastNotificationService: ToastNotificationService, private router: Router, private historyService: HistoryService) {

  }

  async connect() {
    if (this.web3WalletService.isMetaMaskInstalled()) {
      await this.web3WalletService.connect().then(async (connected) => {
        if (connected) {
          this.historyService.hasHistoryKey().subscribe({
            next: async (response) => {
              if (response.hasKey) {
                this.router.navigateByUrl('/');
              } else {
                await this.setupHistoryKey();
              }
            }
          });
        } else {
          //Connect will be false if the user has not yet signed the TOS.
          await this.web3WalletService.getEthAddresses().then((accounts) => {
            if (accounts != null && accounts.length > 0) {
              this.accounts = accounts;
              //TODO: Check if user has signed TOS
              this.web3WalletService.getSiweSignUpMessage(accounts[0]).subscribe({
                next: (siweMessage) => {
                  this.messageToSign = siweMessage.message.statement;
                  this.showSignMessageModal = true;
                },
                error: (err) => console.error(err)
              });
            }
          }).catch((err) => console.error(err));
        }
      });
    } else {
      this.toastNotificationService.showToast('Cannot find Metamask', 'Metamask wallet is required to use WIDE', 'warning', 5000);
    }
  }

  async signTerms() {
    await this.web3WalletService.signTermsOfService().then(async (response) => {
      if (response) {
        this.statusPct = 50;
        await this.setupHistoryKey();
        this.statusPct = 100;
      } else {
        this.statusPct = 0;
      }
    }).catch((err) => console.error(err))
      .finally(() => {
        this.showSignMessageModal = false;
      });
  }

  async setupHistoryKey() {
    //1. Get Message to sign
    const messageRes = await firstValueFrom(this.historyService.getHistoryMessage());
    const message = messageRes.message;

    //2. Sign Message
    const signature = await this.web3WalletService.signMessage(message);

    if (!signature) {
      this.toastNotificationService.error('History Key', 'Unable to sign message');
      return;
    }

    //3. Set Key
    const response = await firstValueFrom(this.historyService.setHistoryKey(signature));

    if (response.success) {
      this.toastNotificationService.info('History Key', response.message);
      this.router.navigate(['/']);
    } else {
      this.toastNotificationService.error('History Key', response.message);
    }
  }

}
