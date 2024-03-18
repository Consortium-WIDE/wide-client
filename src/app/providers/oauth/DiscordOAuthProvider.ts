import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BaseOAuthProvider } from "./BaseOAuthProvider"; // Adjust the path as needed
import { ActivatedRoute, Router } from "@angular/router";
import { environment } from "../../../environments/environment";
import { generateNonce } from "siwe";
import { firstValueFrom } from "rxjs";

export class DiscordOAuthProvider extends BaseOAuthProvider {
    private rawData: any = {};

    constructor(http: HttpClient, private activatedRoute: ActivatedRoute) {
        super(http); // Call the base class constructor
    }

    override getName(): string {
        return 'Discord';
    }

    public override initiateAuthFlow(): void {
        const clientId = environment.discordOAuth.clientId; // Replace with your actual client ID
        const redirectUri = encodeURIComponent(environment.discordOAuth.redirectUri); // Replace with your actual redirect URI
        const state = generateNonce();
        
        const authUrl = `https://discord.com/oauth2/authorize?response_type=token&client_id=${clientId}&state=${state}&redirect_uri=${redirectUri}&prompt=consent&scope=identify+email+connections+guilds+guilds.members.read`;

        super.redirectToOAuthProvider(authUrl);
    }

    override async handleRedirect(): Promise<{ data: any; }> {
        const fragment = new URLSearchParams(window.location.hash.slice(1));
        const accessToken = fragment.get('access_token') || this.extractTokenFromCallback();
        
        //TODO: Verify State
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
            const userInfo = await this.http.get<any>('https://discord.com/api/users/@me', { headers }).toPromise();
            const guildInfo = await this.http.get<any>('https://discord.com/api/users/@me/guilds', { headers }).toPromise();
            //const guildUserInfo = await this.http.get<any>('https://discord.com/api/users/@me/guilds/{guild.id}/member')

            const processedChannelInfo = guildInfo.map((gi: any) => ({ id: gi.id, name: gi.name, owner: gi.owner }));

            userInfo.channels = processedChannelInfo;
            
            this.rawData = userInfo;
            return userInfo;
        } catch (error: any) { // If you know the error structure, replace 'any' with a more specific type
            console.error('Error fetching Discord user info:', error);
            throw error;
        }
    }

    public override getRawData() {
        return this.rawData;
    }

    public override getWideTransformedData(config: any) {
        const profile = this.rawData;

        const issuerPayload: any = {
            "label": `${(profile.hd ?? "")} Discord Profile`.trim(),
            "id": `${environment.wideDomain}/schemas/oauth/discord`,
            "type": (profile.hd ? [profile.hd] : []).concat(["Discord", "OAuth"]),
            "issuer": profile.hd ?? "https://discord.com",
            "issuanceDate": new Date().toISOString(),
            "credentialSubject": {
                "id": config.accountAddress,
                "socialProfile": {
                    "type": "OAuth",
                    "name": "Discord"
                }
            }
        }

        return issuerPayload;
    }
}