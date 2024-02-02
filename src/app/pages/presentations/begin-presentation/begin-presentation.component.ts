import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Web3WalletService } from '../../../services/web3-wallet.service';
import { WideModalComponent } from '../../../components/wide-modal/wide-modal.component';
import { firstValueFrom, map } from 'rxjs';
import { CredentialPresentationService } from '../../../services/credential-presentation.service';
import { CommonModule } from '@angular/common';
import { HistoryService } from '../../../services/history.service';
import { ToastNotificationService } from '../../../services/toast-notification.service';

@Component({
  selector: 'app-begin-presentation',
  standalone: true,
  imports: [CommonModule, RouterLink, WideModalComponent],
  templateUrl: './begin-presentation.component.html',
  styleUrl: './begin-presentation.component.scss'
})
export class BeginPresentationComponent implements OnInit {
  domainOrigin: string = '';
  presentationConfig: any = null;
  pageLoaded: boolean = false;

  showMetaMaskWalletModal = false;
  showMetaMaskConnectModal = false;
  showGettingStartedModal = false;
  showSetHistoryKeyModal = false;

  accounts: string[] | null = [];

  constructor(private web3WalletService: Web3WalletService, private credentialPresentationService: CredentialPresentationService, private router: Router, private activatedRoute: ActivatedRoute, private historyService: HistoryService, private toastNotificationService: ToastNotificationService) { }

  async ngOnInit(): Promise<void> {
    this.activatedRoute.queryParams.subscribe(async (params) => {
      this.domainOrigin = params['domain'];

      this.credentialPresentationService.getDomainConfig(this.domainOrigin).subscribe({
        next: (config) => {
          this.presentationConfig = config;
          console.log(this.presentationConfig);
          this.pageLoaded = true;
        },
        error: (err) => console.error(err),
      });
    });
  }

  async connectWallet() {
    if (!this.web3WalletService.isMetaMaskInstalled()) {
      this.showMetaMaskWalletModal = true;
    } else {
      await this.web3WalletService.connect().then(async (connected) => {
        if (connected) {
          await this.web3WalletService.getEthAddresses().then((accounts) => {
            if (accounts && accounts?.length > 0) {
              this.accounts = accounts;

              this.historyService.hasHistoryKey().subscribe({
                next: (response) => {
                  if (response.hasKey) {
                    this.router.navigateByUrl('present/request', { state: { domainOrigin: this.domainOrigin, presentationConfig: this.presentationConfig } });
                  } else {
                    this.showSetHistoryKeyModal = true;
                  }
                }
              });
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
      this.showSetHistoryKeyModal = false;
      this.router.navigateByUrl('present/request', { state: { domainOrigin: this.domainOrigin, presentationConfig: this.presentationConfig } });
    } else {
      this.toastNotificationService.error('History Key', response.message);
    }
  }

  returnToRequestor() {
    window.location.href = "https://google.com"
  }
}
