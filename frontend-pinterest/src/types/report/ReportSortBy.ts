export const ReportSortBy = {
    CreatedAt: "CreatedAt",
    ReportsCount: "ReportsCount",
} as const;

export type ReportSortBy = typeof ReportSortBy[keyof typeof ReportSortBy];