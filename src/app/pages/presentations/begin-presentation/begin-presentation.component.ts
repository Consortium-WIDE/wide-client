import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Web3WalletService } from '../../../services/web3-wallet.service';
import { WideModalComponent } from '../../../components/wide-modal/wide-modal.component';
import { map } from 'rxjs';
import { CredentialPresentationService } from '../../../services/credential-presentation.service';
import { CommonModule } from '@angular/common';

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

  accounts: string[] | null = [];

  constructor(private web3WalletService: Web3WalletService, private credentialPresentationService: CredentialPresentationService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.domainOrigin = params['domain'];

      this.credentialPresentationService.getDomainConfig(this.domainOrigin).subscribe({
        next: (config) => {
          this.presentationConfig = config;
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
              this.router.navigateByUrl('present/request', { state: { domainOrigin: this.domainOrigin, presentationConfig: this.presentationConfig } });
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
