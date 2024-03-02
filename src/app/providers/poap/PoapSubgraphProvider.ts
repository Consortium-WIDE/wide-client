import { HttpClient } from "@angular/common/http";
import { BaseOAuthProvider } from "../oauth/BaseOAuthProvider";
import { ISubGraphProvider } from "../ISubGraphProvider";

export class PoapSubgraphProvider implements ISubGraphProvider {

    constructor(protected http: HttpClient) { }

    getName(): string {
        return 'POAP';
    }
    
    // override initiateAuthFlow(): void {
    //     throw new Error("Method not implemented.");
    // }

    handleRedirect(): Promise<{ data: any; }> {
        throw new Error("Method not implemented.");
    }

    // protected override OAuthCallback(accessToken: string): Promise<{ data: any; }> {
    //     throw new Error("Method not implemented.");
    // }
    // override getRawData() {
    //     throw new Error("Method not implemented.");
    // }
    // override getWideTransformedData(config: any) {
    //     throw new Error("Method not implemented.");
    // }

}