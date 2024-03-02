import { Component } from '@angular/core';
import { OauthService } from '../../../../../../services/oauth.service';
import { ActivatedRoute, Router } from '@angular/router';
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
  showProfileDetailModal: boolean = false;
  profile: any = null;
  oauthName!: string;
  showProfileDetailModalRawData = false;

  constructor(private router: Router, private route: ActivatedRoute, private oauthService: OauthService, private httpClient: HttpClient, private navMenuService: NavMenuService, private web3WalletService: Web3WalletService, private toastNotificationService: ToastNotificationService) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const oauthServiceType = params['source'];
      this.oauthService.setProviderType(oauthServiceType);
      this.oauthName = this.oauthService.GetName();

      this.navMenuService.setPageDetails(`Signed in with ${this.oauthName}`, ['Your credentials', 'Add credentials', `${this.oauthName} sign-in`]);
      this.oauthService.handleRedirect().then((response) => {
        this.profile = response;
        this.showProfileDetailModal = true;
      }).catch((err) => console.error(err));
    });
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

    const issuerPayload = this.oauthService.getWideTransformedData({ accountAddress: accountAddress });

    const encryptedData = await this.web3WalletService.encryptPayload(this.oauthService.getData());

    if (!encryptedData) {
      console.log('Unable to encrypt');
      this.toastNotificationService.error('Error', 'Unable to encrypt your data');
    } else {

      this.toastNotificationService.info('Success', 'Successfully encrypted your data');

      const navigationExtras = {
        state: {
          accountAddress: accountAddress,
          issuer: issuerPayload,
          rawDataHash: this.web3WalletService.hashDataKeccak256(this.profile),
          encryptedData: encryptedData
        }
      };

      this.router.navigate(['credentials/oauth/store'], navigationExtras);
    }
  }

  getWeb3WalletService(): Web3WalletService {
    return this.web3WalletService;
  }
}
