import type { UserSortBy } from "@/types/user/UserSortBy.ts";
import type { SortDirection } from "@/types/SortDirection.ts";
import {ReportStatus} from "@/types/report/ReportStatus.ts";

export type StatusFilter = "all" | "active" | "blocked";

export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100] as const;
export const DEFAULT_PAGE_SIZE = 10;

export const SORT_OPTIONS: { value: `${UserSortBy}:${SortDirection}`; label: string }[] = [
    { value: "CreatedAt:Desc", label: "Дата реєстрації (нові спочатку)" },
    { value: "CreatedAt:Asc", label: "Дата реєстрації (старі спочатку)" },
    { value: "UserName:Asc", label: "Ім'я (А → Я)" },
    { value: "UserName:Desc", label: "Ім'я (Я → А)" },
];


export const REPORT_STATUS_ORDER: ReportStatus[] = [
    ReportStatus.Pending,
    ReportStatus.Reviewed,
    ReportStatus.Resolved,
    ReportStatus.Dismissed,
];

export const REPORT_STATUS_LABELS: Record<ReportStatus, string> = {
    [ReportStatus.Pending]: "Очікує",
    [ReportStatus.Reviewed]: "Розглянуто",
    [ReportStatus.Resolved]: "Вирішено",
    [ReportStatus.Dismissed]: "Відхилено",
};

export const REPORT_STATUS_STYLES: Record<ReportStatus, string> = {
    [ReportStatus.Pending]: "bg-red-500/10 text-red-400",
    [ReportStatus.Reviewed]: "bg-yellow-500/10 text-yellow-400",
    [ReportStatus.Resolved]: "bg-green-500/10 text-green-400",
    [ReportStatus.Dismissed]: "bg-white/8 text-white/40",
};
