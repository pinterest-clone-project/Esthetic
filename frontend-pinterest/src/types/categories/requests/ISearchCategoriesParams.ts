import type { SortDirection } from "@/types/SortDirection.ts";
import type {CategorySortBy} from "@/types/categories/CategorySortBy.ts";

export interface ISearchCategoriesParams {
    search?: string;
    sortBy?: CategorySortBy;
    sortDirection?: SortDirection;
    page: number;
    pageSize: number;
}