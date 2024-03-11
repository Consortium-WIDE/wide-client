import { Component, OnInit } from '@angular/core';
import { NavMenuService } from '../../../../../services/nav-menu.service';
import { Router } from '@angular/router';
import { ToastNotificationService } from '../../../../../services/toast-notification.service';
import { CommonModule } from '@angular/common';
import { WideModalComponent } from '../../../../../components/wide-modal/wide-modal.component';
import { WideStorageService } from '../../../../../services/wide-storage.service';
import { PoapDataComponent } from '../poap-data/poap-data.component';
import { PoapDetailComponent } from '../component/poap-detail/poap-detail.component';
import { WideInputComponent } from '../../../../../components/wide-input/wide-input.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-poap-store',
  standalone: true,
  imports: [CommonModule, WideModalComponent, FormsModule, PoapDetailComponent, WideInputComponent],
  templateUrl: './poap-store.component.html',
  styleUrl: './poap-store.component.scss'
})
export class PoapStoreComponent implements OnInit {
  uploading: boolean = false;
  showDataDetailModal: boolean = false;
  data: any | null = null;
  poap: any = null;
  provider: string = '';
  customLabel: string = '';

  constructor(private navMenuService: NavMenuService, private router: Router, private toastNotificationService: ToastNotificationService, private wideStorageService: WideStorageService) {}

  ngOnInit():void {
    this.navMenuService.setPageDetails(`Claim POAP`, ['Your credentials', 'Add credentials', `Claim POAP`]);

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
    //TODO: Consider avoiding duplicate code here with different claims
    this.data = {
      accountAddress: state.accountAddress,
      issuer: state.issuer,
      dataHash: state.rawDataHash,
      encryptedData: state.encryptedData
    }

    this.poap = state.poap;
    this.provider = state.provider;
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
}
