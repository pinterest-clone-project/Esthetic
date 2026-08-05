import type { SortDirection } from "@/types/SortDirection.ts";
import type { PinSortBy } from "@/types/pin/PinSortBy.ts";

export interface ISearchPinsParams {
    search?: string;
    categoryId?: string;
    tagIds?: string[];
    sortBy?: PinSortBy;
    sortDirection?: SortDirection;
    page?: number;
    pageSize?: number;
    onlyDeletedByAdmin?: boolean;
}
