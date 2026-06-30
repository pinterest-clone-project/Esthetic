import type {UserSortBy} from "@/types/user/UserSortBy.ts";
import type {SortDirection} from "@/types/SortDirection.ts";

export interface ISearchUsersParams {
    search?: string;
    isPrivate?: boolean;
    isBlocked?: boolean;
    sortBy?: UserSortBy;
    sortDirection?: SortDirection;
    page?: number;
    pageSize?: number;
}