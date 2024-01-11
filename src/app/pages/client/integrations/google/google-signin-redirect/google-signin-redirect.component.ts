import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleSigninProcedureComponent } from '../shared/google-signin-procedure/google-signin-procedure.component';
import { Router } from '@angular/router';
import { NavMenuService } from '../../../../../services/nav-menu.service';
import { GoogleOauthService } from '../../../../../services/google-oauth.service';
import { WideModalComponent } from '../../../../../components/wide-modal/wide-modal.component';

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

  constructor(private router: Router, private navMenuService: NavMenuService, private googleOauthService: GoogleOauthService) {

  }

  ngOnInit() {
    this.navMenuService.setPageDetails('Signed in with Google', ['Your credentials', 'Add credentials', 'Google sign-in']);
    this.googleOauthService.handleRedirect().then((response) => {
      this.profile = response.profile;
    }).catch((err) => console.error(err));
  }

  toggleProfileDetailModal(){
    this.showProfileDetailModal = !this.showProfileDetailModal;
  }

  closeModal(){
    this.showProfileDetailModal = false;
  }

  encryptData() {
    //TODO: !!!
    alert('TODO: mocked for now...');
    const navigationExtras = {
      state: {
        encryptedData: 'MockedEncryptedGoogleProfileData'
      }
    };
    this.router.navigate(['credentials/add/google/store'], navigationExtras);
  }

}
