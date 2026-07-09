import type {TagSortBy} from "@/types/tag/TagSortBy.ts";
import type {SortDirection} from "@/types/SortDirection.ts";

export interface ISearchTagsParams {
    search?: string;
    sortBy?: TagSortBy;
    sortDirection?: SortDirection;
    page: number;
    pageSize: number;
}