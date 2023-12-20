import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavMenuService } from '../../../../../services/nav-menu.service';
import { GoogleSigninProcedureComponent } from '../shared/google-signin-procedure/google-signin-procedure.component';
import { GoogleOauthService } from '../../../../../services/google-oauth.service';

@Component({
  selector: 'app-google-signin',
  standalone: true,
  imports: [CommonModule, GoogleSigninProcedureComponent],
  templateUrl: './google-signin.component.html',
  styleUrl: './google-signin.component.scss'
})
export class GoogleSigninComponent implements OnInit {

  constructor(private router: Router, private navMenuService: NavMenuService, private googleOauthService: GoogleOauthService) {

  }

  ngOnInit() {
    this.navMenuService.setPageDetails('Sign in with Google', ['Your credentials', 'Add credentials', 'Google sign-in'])
  }

  startGoogleAuthProcess() {
    this.googleOauthService.initiateAuthFlow();
  }
}
