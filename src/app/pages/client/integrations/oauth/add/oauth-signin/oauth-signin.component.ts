import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { OauthService } from '../../../../../../services/oauth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NavMenuService } from '../../../../../../services/nav-menu.service';
import { OauthProcedureUiComponent } from '../oauth-procedure-ui/oauth-procedure-ui.component';
import { MsalWrapperService } from '../../../../../../services/msal-wrapper.service';

@Component({
  selector: 'app-oauth-signin',
  standalone: true,
  imports: [CommonModule, OauthSigninComponent, OauthProcedureUiComponent],
  templateUrl: './oauth-signin.component.html',
  styleUrl: './oauth-signin.component.scss'
})
export class OauthSigninComponent {
  oauthName!: string;

  constructor(private router: Router, private route: ActivatedRoute, private navMenuService: NavMenuService, private oauthService: OauthService) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const oauthServiceType = params['type'];
      this.oauthService.setProviderType(oauthServiceType);
      this.oauthName = this.oauthService.GetName();
      
      this.navMenuService.setPageDetails(`Sign in with ${this.oauthName}`, ['Your credentials', 'Add credentials', `${this.oauthName} sign-in`])
    });
  }

  startOAuthProcess() {
    this.oauthService.initiateAuthFlow();
  }
}
