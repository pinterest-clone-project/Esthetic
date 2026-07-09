import type {ReportStatus} from "@/types/report/ReportStatus.ts";

export interface IReportResponse {
    id: string;
    reporterId: string;
    reporterUserName?: string | null;
    reportedUserId?: string | null;
    reportedPinId?: string | null;
    reason: string;
    status: ReportStatus;
    createdAt: string;
}