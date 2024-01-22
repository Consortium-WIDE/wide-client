import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BaseOAuthProvider } from "./BaseOAuthProvider"; // Adjust the import path as needed
import { environment } from "../../../environments/environment";
import { IPublicClientApplication, PopupRequest } from "@azure/msal-browser";
import { Inject, Injectable } from "@angular/core";
import { MSAL_INSTANCE } from "@azure/msal-angular";
import { MsalWrapperService } from "../../services/msal-wrapper.service";
import { Router } from "@angular/router";

@Injectable()
export class MicrosoftOAuthProvider extends BaseOAuthProvider {
    private rawData: any = {};
    private msalResponse: any;

    constructor(http: HttpClient, private router: Router, private msalWrapperService: MsalWrapperService) {
        super(http);
    }

    override getName(): string {
        return 'Microsoft';
    }

    // Override to handle Microsoft specific OAuth flow
    public override async initiateAuthFlow(): Promise<void> {
        await this.msalWrapperService.waitForInitialization();
        const msalInstance = this.msalWrapperService.instance;

        const loginRequest: PopupRequest = {
            scopes: ["openid", "profile", "User.Read"],
        };
        
        msalInstance.loginPopup(loginRequest)
            .then(response => {
                
                this.msalWrapperService.msalResponse = response;
                //This goes to handleRedirect. Since MSAL loads in a popup `this.msalResponse` remains filled.
                const url = new URL(environment.microsoftOAuth.msalConfig.auth.redirectUri);
                const relativeUri = url.pathname + url.search;
                this.router.navigateByUrl(relativeUri);
            })
            .catch(error => {
                console.error(error);
            });
    }

    override async handleRedirect(): Promise<{ data: any; }> {
        const response = this.msalWrapperService.msalResponse;

        if (response && response.accessToken) {
            return await this.OAuthCallback(response.accessToken);
        }

        this.router.navigateByUrl('credentials/add');
        
        throw new Error('Failed to retrieve access token');
    }
    
    // Override to handle the redirect and exchange code for token
    protected async OAuthCallback(accessToken: string): Promise<{ data: any }> {
        // Here, exchange the code for an access token
        // For simplicity, assuming `accessToken` is already obtained
        const userInfo = await this.fetchMicrosoftUserInfo(accessToken);
        this.rawData = userInfo;

        return userInfo;
    }

    private async fetchMicrosoftUserInfo(accessToken: string): Promise<{ data: any }> {
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${accessToken}`
        });

        try {
            const userInfo = await this.http.get<any>('https://graph.microsoft.com/v1.0/me', { headers }).toPromise();
            this.rawData = userInfo;
            return userInfo;
        } catch (error) {
            console.error('Error fetching Microsoft user info:', error);
            throw error;
        }
    }

    public override getRawData() {
        return this.rawData;
    }

    public override getWideTransformedData(config: any) {
        const profile = this.rawData;

        const issuerPayload: any = {
            "label": 'Microsoft Profile',
            "id": "http://www.microsoft.com/",
            "type": ["Microsoft", "OAuth"],
            "issuer": "http://www.microsoft.com/",
            "issuanceDate": new Date().toISOString(),
            "credentialSubject": {
                "id": config.accountAddress,
                "socialProfile": {
                    "type": "OAuth",
                    "name": "Microsoft"
                }
            }
        }

        return issuerPayload;
    }
}
