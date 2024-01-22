import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BaseOAuthProvider } from "./BaseOAuthProvider"; // Adjust the path as needed
import { Router } from "@angular/router";
import { environment } from "../../../environments/environment";

export class GoogleOAuthProvider extends BaseOAuthProvider {
    private rawData: any = {};

    constructor(http: HttpClient) {
        super(http); // Call the base class constructor
    }

    override getName(): string {
        return 'Google';
    }

    public override initiateAuthFlow(): void {
        const clientId = environment.googleOAuth.clientId; // Replace with your actual client ID
        const redirectUri = encodeURIComponent(environment.googleOAuth.redirectUri); // Replace with your actual redirect URI
        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=token&client_id=${clientId}&redirect_uri=${redirectUri}&prompt=select_account&scope=email profile openid`;

        super.redirectToOAuthProvider(authUrl);
    }
    
    override async handleRedirect(): Promise<{ data: any; }> {
        const fragment = new URLSearchParams(window.location.hash.slice(1));
        const accessToken = fragment.get('access_token') || this.extractTokenFromCallback();

        if (accessToken) {
            return await this.OAuthCallback(accessToken);
        }

        throw new Error('Failed to retrieve access token');
    }

    async OAuthCallback(accessToken: string): Promise<{ data: any }> {
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${accessToken}`
        });

        try {
            const userInfo = await this.http.get<any>('https://www.googleapis.com/oauth2/v3/userinfo', { headers }).toPromise();
            this.rawData = userInfo;
            return userInfo;
        } catch (error: any) { // If you know the error structure, replace 'any' with a more specific type
            console.error('Error fetching Google user info:', error);
            throw error;
        }
    }

    public override getRawData() {
        return this.rawData;
    }

    public override getWideTransformedData(config: any) {
        const profile = this.rawData;

        const issuerPayload: any = {
            "label": `${(profile.hd ?? "")} Google Profile`.trim(),
            "id": "http://google.com/",
            "type": ["Google", "OAuth"],
            "issuer": profile.hd ?? "http://www.google.com",
            "issuanceDate": new Date().toISOString(),
            "credentialSubject": {
                "id": config.accountAddress,
                "socialProfile": {
                    "type": "OAuth",
                    "name": "Google"
                }
            }
        }

        return issuerPayload;
    }
}