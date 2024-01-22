export interface IOAuthProvider {
    initiateAuthFlow(authUrl: string): void;
    handleRedirect(): Promise<{ data: any }>;
}