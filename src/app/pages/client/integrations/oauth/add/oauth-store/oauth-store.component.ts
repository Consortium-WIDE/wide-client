import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { OauthProcedureUiComponent } from '../oauth-procedure-ui/oauth-procedure-ui.component';
import { WideModalComponent } from '../../../../../../components/wide-modal/wide-modal.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { WideStorageService } from '../../../../../../services/wide-storage.service';
import { NavMenuService } from '../../../../../../services/nav-menu.service';
import { ToastNotificationService } from '../../../../../../services/toast-notification.service';
import { OauthService } from '../../../../../../services/oauth.service';
import { WideInputComponent } from '../../../../../../components/wide-input/wide-input.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-oauth-store',
  standalone: true,
  imports: [CommonModule, OauthProcedureUiComponent, WideModalComponent, FormsModule, WideInputComponent, RouterLink],
  templateUrl: './oauth-store.component.html',
  styleUrl: './oauth-store.component.scss'
})
export class OauthStoreComponent {
  showDataDetailModal: boolean = false;
  activeStep: number = 5;
  uploading: boolean = false;
  data: any | null = null;
  oauthName!: string;

  constructor(private router: Router, private route: ActivatedRoute, private wideStorageService: WideStorageService, private navMenuService: NavMenuService, private toastNotificationService: ToastNotificationService, private oauthService: OauthService) { }

  ngOnInit() {
    this.oauthName = this.oauthService.GetName();
    this.navMenuService.setPageDetails(`Sign in with ${this.oauthName}`, ['Your credentials', 'Add credentials', `${this.oauthName} sign-in`])

    let state = null;

    if (this.router.getCurrentNavigation()) {
      // If coming directly via router.navigate()
      state = this.router.getCurrentNavigation()?.extras.state as any;
    } else {
      // If page is refreshed or navigated via URL
      state = history.state;
    }

    if (!state) {
      this.toastNotificationService.error('Catastrophic Error', 'Unable to retrieve state');
    }

    //This is a quick and dirty way to get rid of unnecessary additional properties that may be injected by the router for UI
    this.data = {
      accountAddress: state.accountAddress,
      issuer: state.issuer,
      dataHash: state.rawDataHash,
      encryptedData: state.encryptedData
    }
  }

  uploadData() {
    this.uploading = true;

    if (!this.data.accountAddress) {
      this.toastNotificationService.error('Error', 'Unable to retrieve Account Address');
    }

    if (!this.data.issuer) {
      this.toastNotificationService.error('Error', 'Unable to retrieve Issuer Payload');
    }

    if (!this.data.dataHash) {
      this.toastNotificationService.error('Error', 'Unable to retrieve Raw Data Hash');
    }

    if (!this.data.encryptedData) {
      this.toastNotificationService.error('Error', 'Unable to retrieve Encrypted Data');
    }

    this.wideStorageService.storeUserCredentials(this.data.accountAddress, this.data.issuer, this.data.dataHash, this.data.encryptedData).subscribe(
      response => {
        this.toastNotificationService.info('Success', 'Your encrypted data has been stored successfully')
        this.router.navigate(['/']);
      },
      error => {
        this.toastNotificationService.error('Error', 'Failed to store your encrypted data');
        console.error(error);
        this.router.navigate(['/']);
      }
    );
  }

  toggleDataDetailModal() {
    this.showDataDetailModal = !this.showDataDetailModal;
  }

  closeModal() {
    this.showDataDetailModal = false;
  }
}
