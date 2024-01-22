import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { IOAuthProvider } from "../IOAuthProvider";

export abstract class BaseOAuthProvider implements IOAuthProvider {
  constructor(protected http: HttpClient) { }

  abstract getName(): string;

  abstract initiateAuthFlow(): void;

  protected redirectToOAuthProvider(authUrl: string): void {
    window.location.href = authUrl;
  }

  abstract handleRedirect(): Promise<{ data: any }>;

  protected abstract OAuthCallback(accessToken: string): Promise<{ data: any }>;

  protected extractTokenFromCallback(): string | null {
    // This method can be overridden if the token is not in the URL fragment
    return null;
  }

  abstract getRawData(): any;

  abstract getWideTransformedData(config: any): any;

  // Helper function to generate a random string
  protected generateRandomString(length: number): string {
    const possibleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';
    for (let i = 0; i < length; i++) {
      const randomPoz = Math.floor(Math.random() * possibleChars.length);
      randomString += possibleChars.substring(randomPoz, randomPoz + 1);
    }
    return randomString;
  }

  // Function to generate a code verifier
  protected generateCodeVerifier(): string {
    return this.generateRandomString(128); // Length should be between 43 and 128 characters
  }

  // Function to generate a code challenge from the verifier
  protected async generateCodeChallenge(codeVerifier: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  }
}