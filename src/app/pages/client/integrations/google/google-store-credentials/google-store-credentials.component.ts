import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NavMenuService } from '../../../../../services/nav-menu.service';
import { GoogleSigninProcedureComponent } from '../shared/google-signin-procedure/google-signin-procedure.component';
import { WideModalComponent } from '../../../../../components/wide-modal/wide-modal.component';
import { WideStorageService } from '../../../../../services/wide-storage.service';
import { ToastNotificationService } from '../../../../../services/toast-notification.service';

@Component({
  selector: 'app-google-store-credentials',
  standalone: true,
  imports: [CommonModule, GoogleSigninProcedureComponent, WideModalComponent, RouterLink],
  templateUrl: './google-store-credentials.component.html',
  styleUrl: './google-store-credentials.component.scss'
})
export class GoogleStoreCredentialsComponent implements OnInit {
  showDataDetailModal: boolean = false;
  activeStep: number = 5;
  uploading: boolean = false;
  data: any | null = null;

  constructor(private router: Router, private route: ActivatedRoute, private wideStorageService: WideStorageService, private navMenuService: NavMenuService, private toastNotificationService: ToastNotificationService) { }

  ngOnInit() {
    this.navMenuService.setPageDetails('Sign in with Google', ['Your credentials', 'Add credentials', 'Google sign-in']);

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
      encryptedData: state.encryptedData
    }
  }

  async uploadData() {
    this.uploading = true;

    if (!this.data.accountAddress){
      this.toastNotificationService.error('Error', 'Unable to retrieve Account Address');
    }

    if (!this.data.issuer){
      this.toastNotificationService.error('Error', 'Unable to retrieve Issuer Payload');
    }

    if (!this.data.encryptedData){
      this.toastNotificationService.error('Error', 'Unable to retrieve Encrypted Data');
    }

    await this.wideStorageService.storeUserCredentials(this.data.accountAddress, this.data.issuer, this.data.encryptedData).subscribe(
      response => {
        this.toastNotificationService.info('Success', 'Your encrypted data has been stored successfully')
      },
      error => {
        this.toastNotificationService.error('Error', 'Failed to store your encrypted data');
        console.error(error);
      }
    );

    this.router.navigate(['/']);
  }

  toggleDataDetailModal() {
    this.showDataDetailModal = !this.showDataDetailModal;
  }

  closeModal() {
    this.showDataDetailModal = false;
  }
}
