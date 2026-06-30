import {api} from "@/services/api.ts";
import type {IPagedResult} from "@/types/IPagedResult.ts";
import type {IUser} from "@/types/user/IUser.ts";
import type {ISearchUsersParams} from "@/types/user/ISearchUsersParams.ts";
import type {IAdminBlockUserRequest} from "@/types/admin/IAdminIBlockUserRequest.ts";

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
    }),
});

export const {
    useSearchUsersQuery,
    useBlockUserMutation,
    useUnblockUserMutation,
} = userService;
