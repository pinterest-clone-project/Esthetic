import type { UserSortBy } from "@/types/user/UserSortBy.ts";
import type { SortDirection } from "@/types/SortDirection.ts";

export type StatusFilter = "all" | "active" | "blocked";

export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100] as const;
export const DEFAULT_PAGE_SIZE = 10;

export const SORT_OPTIONS: { value: `${UserSortBy}:${SortDirection}`; label: string }[] = [
    { value: "CreatedAt:Desc", label: "Дата реєстрації (нові спочатку)" },
    { value: "CreatedAt:Asc", label: "Дата реєстрації (старі спочатку)" },
    { value: "UserName:Asc", label: "Ім'я (А → Я)" },
    { value: "UserName:Desc", label: "Ім'я (Я → А)" },
];