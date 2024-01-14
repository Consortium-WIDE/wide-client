import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleSigninProcedureComponent } from '../shared/google-signin-procedure/google-signin-procedure.component';
import { Router } from '@angular/router';
import { NavMenuService } from '../../../../../services/nav-menu.service';
import { GoogleOauthService } from '../../../../../services/google-oauth.service';
import { WideModalComponent } from '../../../../../components/wide-modal/wide-modal.component';
import { DataProcessingService } from '../../../../../data-processing.service';
import { Web3WalletService } from '../../../../../services/web3-wallet.service';
import { WideStorageService } from '../../../../../services/wide-storage.service';
import { ToastNotificationService } from '../../../../../services/toast-notification.service';

@Component({
  selector: 'app-google-signin-redirect',
  standalone: true,
  imports: [CommonModule, GoogleSigninProcedureComponent, WideModalComponent],
  templateUrl: './google-signin-redirect.component.html',
  styleUrl: './google-signin-redirect.component.scss'
})
export class GoogleSigninRedirectComponent implements OnInit {
  showProfileDetailModal: boolean = false;
  profile: any = null;

  constructor(private router: Router, private navMenuService: NavMenuService, private googleOauthService: GoogleOauthService, private wideStorageService: WideStorageService, private web3WalletService: Web3WalletService, private toastNotificationService: ToastNotificationService) {

  }

  ngOnInit() {
    this.navMenuService.setPageDetails('Signed in with Google', ['Your credentials', 'Add credentials', 'Google sign-in']);
    this.googleOauthService.handleRedirect().then((response) => {
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

    const issuerPayload: any = {
      "label": `${(this.profile.hd ?? "")} Google Profile`.trim(),
      "id": "http://google.com/",
      "type": ["WIDECredential", "GoogleOAuth"],
      "issuer": this.profile.hd ?? "http://www.google.com",
      "issuanceDate": new Date().toISOString(),
      "credentialSubject": {
        "id": accountAddress,
        "socialProfile": {
          "type": "OAuth",
          "name": "Google"
        }
      }
    }

    const encryptedData = await this.web3WalletService.encryptPayload(this.profile);

    this.toastNotificationService.info('Success', 'Successfully encrypted your data');

    const navigationExtras = {
      state: {
        accountAddress: accountAddress,
        issuer: issuerPayload,
        encryptedData: encryptedData
      }
    };

    this.router.navigate(['credentials/add/google/store'], navigationExtras);
  }
}
