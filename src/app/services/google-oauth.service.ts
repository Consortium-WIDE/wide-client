import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GoogleOauthService {
  constructor(private router: Router, private http: HttpClient) { }

  public initiateAuthFlow() {
    const authUrl = `${environment.googleOAuth.oAuthUri}?response_type=token&client_id=${environment.googleOAuth.clientId}&redirect_uri=${encodeURIComponent(environment.googleOAuth.redirectUri)}&prompt=select_account&scope=email profile openid`;

    // Redirect to auth URL
    window.location.href = authUrl;
  }

  public async handleRedirect(): Promise<{ email: string, profile: any }> {
    const fragment = new URLSearchParams(window.location.hash.slice(1)); // Extract the fragment
    const accessToken = fragment.get('access_token');

    if (accessToken) {
      return await this.getUserInfo(accessToken);
    }

    throw new Error('Failed to decode Google access token');
  }

  public async getUserInfo(accessToken: string): Promise<{ email: string, profile: any }> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`
    });

    try {
      const userInfo = await this.http.get<any>('https://www.googleapis.com/oauth2/v3/userinfo', { headers }).toPromise();
      return {
        email: userInfo.email,
        profile: userInfo
      };
    } catch (error) {
      console.error('Error fetching user info:', error);
      throw error;
    }
  }
}
