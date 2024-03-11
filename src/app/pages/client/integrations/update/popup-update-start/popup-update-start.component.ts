import { Component, OnInit } from '@angular/core';
import { Web3WalletService } from '../../../../../services/web3-wallet.service';
import { HistoryService } from '../../../../../services/history.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-popup-update-start',
  standalone: true,
  imports: [],
  templateUrl: './popup-update-start.component.html',
  styleUrl: './popup-update-start.component.scss'
})
export class PopupUpdateStartComponent implements OnInit {
  showMetaMaskWalletMessage: boolean = false;
  showHistoryKeyMessage: boolean = false;
  accounts: string[] | null = [];
  referrer: string = '';

  constructor(private web3WalletService: Web3WalletService, private historyService: HistoryService, private router: Router) { }

  ngOnInit(): void {
    this.referrer = document.referrer;
  }

  async connectWallet() {
    if (!this.web3WalletService.isMetaMaskInstalled()) {
      this.showMetaMaskWalletMessage = true;
    } else {
      await this.web3WalletService.connect().then(async (connected) => {
        if (connected) {
          await this.web3WalletService.getEthAddresses().then((accounts) => {
            if (accounts && accounts?.length > 0) {
              this.accounts = accounts;

              this.historyService.hasHistoryKey().subscribe({
                next: (response) => {
                  if (response.hasKey) {
                    this.router.navigateByUrl('update/review', { state: { referrer: this.referrer } });
                  } else {
                    this.showHistoryKeyMessage = true;
                  }
                }
              });
            } else {
              this.showMetaMaskWalletMessage = true;
            }
          })
            .catch((err) => {
              console.error(err);
            })
        } else {
          console.error('Failed to connect to Metamask');
          this.showMetaMaskWalletMessage = true;
        }
      });

    }
  }
}
