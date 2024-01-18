export interface IOAuthProvider {
    initiateAuthFlow(authUrl: string): void;
    handleRedirect(): Promise<{ email: string, profile: any }>;
}