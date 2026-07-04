export interface IReportResponse {
    id: string;
    reporterId: string;
    reportedUserId: string | null;
    reportedPinId: string | null;
    reason: string;
    status: string;
    createdAt: string;
}