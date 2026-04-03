export interface IApiError {
    status: number;
    title: string;
    detail?: string;
    errors?: Record<string, string[]>;
}