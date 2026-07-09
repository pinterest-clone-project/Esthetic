import type {ReportStatus} from "@/types/report/ReportStatus.ts";
import type {ReportSortBy} from "@/types/report/ReportSortBy.ts";
import type {SortDirection} from "@/types/SortDirection.ts";

export interface IGetAllReportsParams {
    status?: ReportStatus;
    sortBy: ReportSortBy;
    sortDirection: SortDirection;
    page: number;
    pageSize: number;
}