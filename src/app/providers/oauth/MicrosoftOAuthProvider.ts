import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BaseOAuthProvider } from "./BaseOAuthProvider"; // Adjust the import path as needed
import { environment } from "../../../environments/environment";

export class MicrosoftOAuthProvider extends BaseOAuthProvider {
    private rawData: any = {};

    constructor(http: HttpClient) {
        super(http);
    }

    override getName(): string {
        return 'Microsoft';
    }

    // Override to handle Microsoft specific OAuth flow
    public override async initiateAuthFlow(): Promise<void> {
        const codeVerifier = this.generateCodeVerifier(); // Generate a code verifier
        const codeChallenge = await this.generateCodeChallenge(codeVerifier); // Generate a code challenge

        console.log('this.codeVerifier', codeVerifier);
        console.log('codeChallenge', codeChallenge);

        localStorage.setItem('codeVerifier', codeVerifier);

        console.log()
        const clientId = environment.microsoftOAuth.clientId; // Replace with your actual client ID
        const redirectUri = encodeURIComponent(environment.microsoftOAuth.redirectUri); // Replace with your actual redirect URI
        const authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=User.Read openid email profile offline_access&code_challenge=${codeChallenge}&code_challenge_method=S256`;

        super.redirectToOAuthProvider(authUrl);
    }

    override async handleRedirect(): Promise<{ data: any; }> {
        const queryParams = new URLSearchParams(window.location.search);
        const code = queryParams.get('code');

        const codeVerifier = localStorage.getItem('codeVerifier');
        localStorage.removeItem('codeVerifier');

        if (code) {
            return await this.exchangeCodeForToken(code, codeVerifier ?? '');
        }

        throw new Error('Failed to retrieve authorization code');
    }
    
    private async exchangeCodeForToken(code: string, codeVerifier: string): Promise<{ data: any }> {
        const tokenUrl = 'https://login.microsoftonline.com/common/oauth2/v2.0/token';
        const clientId = environment.microsoftOAuth.clientId;
        const redirectUri = encodeURIComponent(environment.microsoftOAuth.redirectUri);

        const payload = `client_id=${clientId}&redirect_uri=${redirectUri}&scope=${encodeURIComponent('User.Read openid email profile offline_access')}&code=${code}&code_verifier=${codeVerifier}&grant_type=authorization_code`;

        try {
            const response = await this.http.post<any>(tokenUrl, payload, { headers: new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'}) })
            .toPromise();

            const accessToken = response.access_token;
            return this.fetchMicrosoftUserInfo(accessToken);
        } catch (error) {
            console.error('Error exchanging code for token:', error);
            throw error;
        }
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
