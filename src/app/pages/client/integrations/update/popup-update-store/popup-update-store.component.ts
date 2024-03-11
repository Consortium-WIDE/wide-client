import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastNotificationService } from '../../../../../services/toast-notification.service';
import { WideStorageService } from '../../../../../services/wide-storage.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-popup-update-store',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './popup-update-store.component.html',
  styleUrl: './popup-update-store.component.scss'
})
export class PopupUpdateStoreComponent implements OnInit {
  showEncryptedData: boolean = false;
  uploading: boolean = false;
  provider: string = '';
  data: any = {};
  dataSource: any = {};
  referrer: string = '';

  constructor(private router: Router, private toastNotificationService: ToastNotificationService, private wideStorageService: WideStorageService) { }

  ngOnInit(): void {
    this.provider = 'Provider Placeholder';

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

    this.dataSource = state.dataSource;
    this.referrer = state.referrer;
  }

  uploadData(): void {
    this.uploading = true;
    
    this.wideStorageService.updateUserCredentials(this.data.accountAddress, this.data.issuer, this.data.dataHash, this.data.encryptedData).subscribe(
      response => {
        const data = response.data;
        this.toastNotificationService.info('Success', 'Your encrypted data has been updated successfully');
  
        // Ensure the opener exists and is not closed
        if (window.opener && !window.opener.closed) {
          // Send the data to the opener window before closing
          window.opener.postMessage({ status: 'closed', data: data }, this.referrer);
        }
        
        // Close the window
        window.close();
      },
      error => {
        this.toastNotificationService.error('Error', 'Failed to update your encrypted data');
        console.error(error);
      }
    );
  }

  getEncryptedCredentialNames(credentials: any[]): string {
    return credentials.map( (c: any) => c.name).join(', ');
  }
}
