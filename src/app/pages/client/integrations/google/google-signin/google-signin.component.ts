import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavMenuService } from '../../../../../services/nav-menu.service';
import { GoogleSigninProcedureComponent } from '../shared/google-signin-procedure/google-signin-procedure.component';
import { OauthService } from '../../../../../services/oauth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-google-signin',
  standalone: true,
  imports: [CommonModule, GoogleSigninProcedureComponent],
  templateUrl: './google-signin.component.html',
  styleUrl: './google-signin.component.scss'
})
export class GoogleSigninComponent implements OnInit {
  private oauthService!: OauthService;

  constructor(private router: Router, private httpClient: HttpClient, private navMenuService: NavMenuService) {
    this.oauthService = new OauthService(this.router, this.httpClient, 'google');
  }

  ngOnInit() {
    this.navMenuService.setPageDetails('Sign in with Google', ['Your credentials', 'Add credentials', 'Google sign-in'])
  }

  startGoogleAuthProcess() {
    this.oauthService.initiateAuthFlow();
  }
}
