import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { IOAuthProvider } from "../IOAuthProvider";

export abstract class BaseOAuthProvider implements IOAuthProvider {
    constructor(protected http: HttpClient) { }

    abstract initiateAuthFlow(): void;

    protected redirectToOAuthProvider(authUrl: string): void {
        window.location.href = authUrl;
    }

    public async handleRedirect(): Promise<{ email: string, profile: any }> {
        const fragment = new URLSearchParams(window.location.hash.slice(1));
        const accessToken = fragment.get('access_token') || this.extractTokenFromCallback();
    
        if (accessToken) {
          return await this.OAuthCallback(accessToken);
        }
    
        throw new Error('Failed to retrieve access token');
      }

      protected abstract OAuthCallback(accessToken: string): Promise<{ email: string, profile: any }>;

      protected extractTokenFromCallback(): string | null {
        // This method can be overridden if the token is not in the URL fragment
        return null;
      }

      abstract getRawData(): any;

      abstract getWideTransformedData(config: any): any;
}