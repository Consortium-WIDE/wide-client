import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleSigninProcedureComponent } from '../shared/google-signin-procedure/google-signin-procedure.component';
import { Router } from '@angular/router';
import { NavMenuService } from '../../../../../services/nav-menu.service';
import { WideModalComponent } from '../../../../../components/wide-modal/wide-modal.component';
import { Web3WalletService } from '../../../../../services/web3-wallet.service';
import { WideStorageService } from '../../../../../services/wide-storage.service';
import { ToastNotificationService } from '../../../../../services/toast-notification.service';
import { OauthService } from '../../../../../services/oauth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-google-signin-redirect',
  standalone: true,
  imports: [CommonModule, GoogleSigninProcedureComponent, WideModalComponent],
  templateUrl: './google-signin-redirect.component.html',
  styleUrl: './google-signin-redirect.component.scss'
})
export class GoogleSigninRedirectComponent implements OnInit {
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
