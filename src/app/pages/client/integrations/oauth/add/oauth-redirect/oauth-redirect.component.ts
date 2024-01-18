import { Component } from '@angular/core';
import { OauthService } from '../../../../../../services/oauth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NavMenuService } from '../../../../../../services/nav-menu.service';
import { Web3WalletService } from '../../../../../../services/web3-wallet.service';
import { ToastNotificationService } from '../../../../../../services/toast-notification.service';
import { OauthProcedureUiComponent } from '../oauth-procedure-ui/oauth-procedure-ui.component';
import { WideModalComponent } from '../../../../../../components/wide-modal/wide-modal.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-oauth-redirect',
  standalone: true,
  imports: [CommonModule, OauthProcedureUiComponent, WideModalComponent],
  templateUrl: './oauth-redirect.component.html',
  styleUrl: './oauth-redirect.component.scss'
})
export class OauthRedirectComponent {
  private oauthService!: OauthService;
  showProfileDetailModal: boolean = false;
  profile: any = null;

  constructor(private router: Router, private httpClient: HttpClient, private navMenuService: NavMenuService, private web3WalletService: Web3WalletService, private toastNotificationService: ToastNotificationService) {
    this.oauthService = new OauthService(this.router, this.httpClient, 'google');
  }

  ngOnInit() {
    this.navMenuService.setPageDetails('Signed in with Google', ['Your credentials', 'Add credentials', 'Google sign-in']);
    this.oauthService.handleRedirect().then((response) => {
      this.profile = response.profile;
    }).catch((err) => console.error(err));
  }

  toggleProfileDetailModal() {
    this.showProfileDetailModal = !this.showProfileDetailModal;
  }

  closeModal() {
    this.showProfileDetailModal = false;
  }

  async encryptData() {
    const accountAddress = await this.web3WalletService.getAccount();

    if (!accountAddress) {
      this.toastNotificationService.error('Error', 'Cannot find wallet address');
      return;
    }

    const issuerPayload = this.oauthService.getWideTransformedData({accountAddress: accountAddress});
    const encryptedData = await this.web3WalletService.encryptPayload(this.oauthService.getData());

    this.toastNotificationService.info('Success', 'Successfully encrypted your data');

    const navigationExtras = {
      state: {
        accountAddress: accountAddress,
        issuer: issuerPayload,
        rawDataHash: this.web3WalletService.hashDataKeccak256(this.profile),
        encryptedData: encryptedData
      }
    };

    console.log('profile', JSON.stringify(this.profile));
    console.log('profile Hash', this.web3WalletService.hashDataKeccak256(this.profile));

    this.router.navigate(['credentials/add/google/store'], navigationExtras);
  }

  getWeb3WalletService(): Web3WalletService {
    return this.web3WalletService;
  }
}
