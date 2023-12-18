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
          this.accounts = accounts;
          this.refreshMessageToSign();
          this.showSignMessageModal = true;
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

  private refreshMessageToSign() {
    //TODO: Get from server
    this.messageToSign = `WIDE Message + SIWE tags: Lorem ipsum dolor sit amet consectetur. Nisi erat vel orci quis turpis malesuada. Bibendum pharetra tristique nisi odio. In amet senectus aenean scelerisque vivamus placerat eget ullamcorper quis. Ullamcorper vulputate morbi vel quam ut interdum. In eu mollis sit ullamcorper mattis.
    <br/><br/>
    Address: ${this.accounts?.join(',')}<br/>
    Timestamp: XX/XX/XX XX:XX:XX<br/>
    Nonce: abc123<br/>
    domain: client.wid3.xyz<br/>`
  }

}
