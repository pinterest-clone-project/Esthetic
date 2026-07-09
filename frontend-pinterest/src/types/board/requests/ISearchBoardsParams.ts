import type { SortDirection } from "@/types/SortDirection.ts";
import type { BoardSortBy } from "@/types/board/BoardSortBy.ts";

export interface ISearchBoardsParams {
    search?: string;
    sortBy?: BoardSortBy;
    sortDirection?: SortDirection;
    page?: number;
    pageSize?: number;
    includeArchived?: boolean;
}
