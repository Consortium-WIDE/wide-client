import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HistoryService } from '../../../services/history.service';
import { firstValueFrom } from 'rxjs';
import { Web3WalletService } from '../../../services/web3-wallet.service';
import { ToastNotificationService } from '../../../services/toast-notification.service';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss'
})
export class HistoryComponent implements OnInit {
  historyRecords: any[] = [];
  hasKey: boolean = false;

  constructor(private historyService: HistoryService, private web3WalletService: Web3WalletService, private toastNotificationService: ToastNotificationService) {
    this.subscribeToWalletConnection();
  }

  async ngOnInit(): Promise<void> {
    await this.subscribeToWalletConnection();
  }

  private async subscribeToWalletConnection() {
    await this.web3WalletService.connectedToWallet$.subscribe(async (walletConnected) => {
      if (walletConnected) {
        this.refreshHistory();
      }
    });
  }

  private async refreshHistory() {
    const res = await firstValueFrom(this.historyService.getHistory());
    this.historyRecords = res.data;
    this.hasKey = res.hasKey;
  }

  async setupHistoryKey(): Promise<void> {
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
      this.hasKey = true;
      this.toastNotificationService.info('History Key', response.message);
    } else {
      this.toastNotificationService.error('History Key', response.message);
    }
  }

  getRpIcon(data: any): string {
    if (data.iconUri) {
      return data.iconUri;
    }

    return `${data.domain}/favicon.ico`;
  }
}
