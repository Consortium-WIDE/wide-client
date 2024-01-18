import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { OauthService } from '../../../../../../services/oauth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NavMenuService } from '../../../../../../services/nav-menu.service';
import { OauthProcedureUiComponent } from '../oauth-procedure-ui/oauth-procedure-ui.component';

@Component({
  selector: 'app-oauth-signin',
  standalone: true,
  imports: [CommonModule, OauthSigninComponent, OauthProcedureUiComponent],
  templateUrl: './oauth-signin.component.html',
  styleUrl: './oauth-signin.component.scss'
})
export class OauthSigninComponent {
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
