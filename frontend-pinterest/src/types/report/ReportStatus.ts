export const ReportStatus = {
    Pending: 0,
    Reviewed: 1,
    Resolved: 2,
    Dismissed: 3,
} as const;

export type ReportStatus = typeof ReportStatus[keyof typeof ReportStatus];