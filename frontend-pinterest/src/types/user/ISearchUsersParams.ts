export interface ISearchUsersParams {
    search?: string;
    isPrivate?: boolean;
    isBlocked?: boolean;
    sortBy?: UserSortBy;
    sortDirection?: SortDirection;
    page?: number;
    pageSize?: number;
}