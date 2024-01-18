import { HttpClient } from "@angular/common/http";
import { BaseOAuthProvider } from "./BaseOAuthProvider"; // Adjust the import path as needed
import { environment } from "../../../environments/environment";

export class MicrosoftOAuthProvider extends BaseOAuthProvider {
    constructor(http: HttpClient) {
        super(http);
    }

    // Override to handle Microsoft specific OAuth flow
    public initiateAuthFlow(): void {
        const clientId = environment.githubOAuth.clientId; // Replace with your actual client ID
        const redirectUri = encodeURIComponent(environment.githubOAuth.redirectUri); // Replace with your actual redirect URI
        const authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=user.read`;

        super.redirectToOAuthProvider(authUrl);
    }

    // Override to handle the redirect and exchange code for token
    protected async OAuthCallback(accessToken: string): Promise<{ email: string, profile: any }> {
        // Here, exchange the code for an access token
        // For simplicity, assuming `accessToken` is already obtained
        const userInfo = await this.fetchMicrosoftUserInfo(accessToken);
        return userInfo;
    }

    private async fetchMicrosoftUserInfo(accessToken: string): Promise<{ email: string, profile: any }> {
        const headers = {
            'Authorization': `Bearer ${accessToken}`
        };

        try {
            const userInfoResponse = await this.http.get<any>('https://graph.microsoft.com/v1.0/me', { headers }).toPromise();
            return { email: userInfoResponse.mail || userInfoResponse.userPrincipalName, profile: userInfoResponse };
        } catch (error) {
            console.error('Error fetching Microsoft user info:', error);
            throw error;
        }
    }

    // // Override this if Microsoft uses a different method to extract the token
    // protected extractTokenFromCallback(): string | null {
    //     // Implement the logic to extract the access token
    //     return super.extractTokenFromCallback();
    // }

    public override getRawData() {
        return {};
    }

    public override getWideTransformedData(config: any) {
        return {};
    }
}
