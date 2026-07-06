import type {IReportResponse} from "@/types/report/responses/IReportResponse.ts";

export interface IPinReportGroup {
    pinId: string;
    pinImage?: string | null;
    pinCreatorId: string;
    pinCreatorUserName?: string | null;
    reportsCount: number;
    latestReportAt: string;
    reports: IReportResponse[];
}