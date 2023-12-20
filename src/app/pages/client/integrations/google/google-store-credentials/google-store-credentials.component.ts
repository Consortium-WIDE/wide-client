import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NavMenuService } from '../../../../../services/nav-menu.service';
import { GoogleSigninProcedureComponent } from '../shared/google-signin-procedure/google-signin-procedure.component';
import { WideModalComponent } from '../../../../../components/wide-modal/wide-modal.component';

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
  encryptedPayload: string | null = null;
  uploading: boolean = false;

  constructor(private router: Router, private route: ActivatedRoute, private navMenuService: NavMenuService) { }

  ngOnInit() {
    this.navMenuService.setPageDetails('Sign in with Google', ['Your credentials', 'Add credentials', 'Google sign-in']);

    if (this.router.getCurrentNavigation()) {
      // If coming directly via router.navigate()
      const state = this.router.getCurrentNavigation()?.extras.state as any;
      const data = state?.encryptedData;

      this.encryptedPayload = data;
    } else {
      // If page is refreshed or navigated via URL
      const state = history.state;
      const data = state?.encryptedData;

      this.encryptedPayload = data;
    }
  }

  uploadData() {
    this.uploading = true;
    alert('TODO: mock upload...');
    setTimeout(() => {
      this.uploading = false;
      this.activeStep = 6;
    }, 3000);
  }

  toggleDataDetailModal() {
    this.showDataDetailModal = !this.showDataDetailModal;
  }

  closeModal() {
    this.showDataDetailModal = false;
  }
}
