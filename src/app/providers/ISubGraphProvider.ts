export interface ISubGraphProvider {
    getName(): string;
    handleRedirect(): Promise<{ data: any }>;
}