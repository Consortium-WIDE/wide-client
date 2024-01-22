import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { BaseOAuthProvider } from '../providers/oauth/BaseOAuthProvider';
import { GoogleOAuthProvider } from '../providers/oauth/GoogleOAuthProvider';
import { MicrosoftOAuthProvider } from '../providers/oauth/MicrosoftOAuthProvider';
import { OAUTH_PROVIDER_TOKEN } from '../providers/oauth/injectionToken/oauth-provider.token';

@Injectable({
  providedIn: 'root'
})
export class OauthService {
  private oauthProvider: BaseOAuthProvider;

  constructor(private router: Router, private http: HttpClient, @Inject(OAUTH_PROVIDER_TOKEN) oauthProvider: string) {
    switch (oauthProvider) {
      case 'google':
        this.oauthProvider = new GoogleOAuthProvider(this.http);
        break;
      case 'microsoft':
        this.oauthProvider = new MicrosoftOAuthProvider(this.http);
        break;
      default:
        throw new Error('Unsupported OAuth provider');
    }
  }

  public GetName(): string {
    if (!this.oauthProvider) {
      throw new Error('OAuth provider is not set');
    }
    return this.oauthProvider.getName();
  }

  public initiateAuthFlow(): void {
    if (!this.oauthProvider) {
      throw new Error('OAuth provider is not set');
    }
    this.oauthProvider.initiateAuthFlow();
  }

  public async handleRedirect(): Promise<{ data: any }> {
    if (!this.oauthProvider) {
      throw new Error('OAuth provider is not set');
    }
    return await this.oauthProvider.handleRedirect();
  }

  public getData(): any {
    if (!this.oauthProvider) {
      throw new Error('OAuth provider is not set');
    }

    return this.oauthProvider.getRawData();
  }

  public getWideTransformedData(config: any): any {
    if (!this.oauthProvider) {
      throw new Error('OAuth provider is not set');
    }
    return this.oauthProvider.getWideTransformedData(config);
  }

}
