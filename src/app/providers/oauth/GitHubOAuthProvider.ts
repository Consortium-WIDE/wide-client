import { HttpClient } from "@angular/common/http";
import { BaseOAuthProvider } from "./BaseOAuthProvider"; // Adjust the import path as needed
import { Router } from "@angular/router";
import { environment } from "../../../environments/environment";

export class GitHubOAuthProvider extends BaseOAuthProvider {
    constructor(http: HttpClient) {
        super(http);
    }

    // Override to handle GitHub specific OAuth flow
    public initiateAuthFlow(): void {
        const clientId = environment.githubOAuth.clientId; // Replace with your actual client ID
        const redirectUri = encodeURIComponent(environment.githubOAuth.redirectUri); // Replace with your actual redirect URI
        const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user`;
        super.redirectToOAuthProvider(authUrl);
    }

    // Override to handle the redirect and exchange code for token
    protected async OAuthCallback(accessToken: string): Promise<{ email: string, profile: any }> {
        // Here, exchange the code for an access token
        // For simplicity, assuming `accessToken` is already obtained
        const userInfo = await this.fetchGitHubUserInfo(accessToken);
        return userInfo;
    }

    private async fetchGitHubUserInfo(accessToken: string): Promise<{ email: string, profile: any }> {
        const headers = {
            'Authorization': `token ${accessToken}`
        };

        try {
            const userInfoResponse = await this.http.get<any>('https://api.github.com/user', { headers }).toPromise();
            // Email might be null if it's not publicly available
            // Additional request may be needed to fetch email
            return { email: userInfoResponse.email, profile: userInfoResponse };
        } catch (error) {
            console.error('Error fetching GitHub user info:', error);
            throw error;
        }
    }

    // // Override this if GitHub uses a different method to extract the token
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
