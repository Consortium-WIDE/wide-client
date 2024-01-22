// msal.service.ts
import { Injectable } from '@angular/core';
import { PublicClientApplication, IPublicClientApplication } from '@azure/msal-browser';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MsalWrapperService {
  private msalInstance: IPublicClientApplication;
  private initializationPromise: Promise<void>;
  private _msalResponse: any;

  constructor() {
    this.msalInstance = new PublicClientApplication(environment.microsoftOAuth.msalConfig);
    this.initializationPromise = this.msalInstance.initialize().catch(err => {
      console.error('Failed to initialize MSAL', err);
      throw err;
    });
  }

  async waitForInitialization(): Promise<void> {
    await this.initializationPromise;
  }

  get instance(): IPublicClientApplication {
    return this.msalInstance;
  }

  set msalResponse(response: any) {
    this._msalResponse = response;
  }

  get msalResponse(): any {
    return this._msalResponse;
  }
}
