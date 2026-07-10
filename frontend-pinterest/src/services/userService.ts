import {api} from "@/services/api.ts";
import type {IPagedResult} from "@/types/IPagedResult.ts";
import type {IUser} from "@/types/user/IUser.ts"; import type {ISearchUsersParams} from "@/types/user/ISearchUsersParams.ts"; import type {IAdminBlockUserRequest} from "@/types/admin/IAdminIBlockUserRequest.ts";
import type {IUserFollowStats} from "@/types/user/IUserFollowStats.ts";
export const userService = api.injectEndpoints({
    endpoints: (builder) => ({
        searchUsers: builder.query<IPagedResult<IUser>, ISearchUsersParams>({
            query: ({ search, isPrivate, isBlocked, sortBy, sortDirection, page = 1, pageSize = 10 }) => ({
                url: 'Users/search',
                method: 'GET',
                params: { search, isPrivate, isBlocked, sortBy, sortDirection, page, pageSize },
            }),
            providesTags: ['AllUsers'],
        }),
        getById: builder.query<IUser, string>({
            query: (id) => ({
                url: `Users/getById/${id}`,
                method: 'GET',
            }),
            providesTags: ['AllUsers'],
        }),
        blockUser: builder.mutation<IUser, IAdminBlockUserRequest>({
            query: ({ id, ...data }) => ({
                url: `Users/block/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['AllUsers'],
        }),
        unblockUser: builder.mutation<IUser, string>({
            query: (id) => ({
                url: `Users/unblock/${id}`,
                method: 'PUT',
            }),
            invalidatesTags: ['AllUsers'],
        }),
        getFollowStats: builder.query<IUserFollowStats, string>({
            query: (id) => ({ url: `Users/${id}/follow-stats`, method: 'GET' }),
            providesTags: (_res, _err, id) => [{ type: 'FollowStats', id }],
        }),
    }),
});

export const {
    useSearchUsersQuery,
    useGetByIdQuery,
    useBlockUserMutation,
    useUnblockUserMutation,
    useGetFollowStatsQuery,
} = userService;
