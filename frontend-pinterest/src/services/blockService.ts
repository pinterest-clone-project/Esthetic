import { api } from "./api.ts";
import type { IBlockedUser } from "@/types/userblock/IBlockedUser.ts";

export const blockService = api.injectEndpoints({
    endpoints: (builder) => ({
        defaultIsBlocked: builder.query<boolean, string>({
            query: (blockedId) => `UserBlock/isBlocked/${blockedId}`,
            providesTags: ["BlockStatus"],
        }),
        defaultBlockUser: builder.mutation<void, string>({
            query: (blockedId) => ({
                url: `UserBlock/block/${blockedId}`,
                method: 'PUT',
            }),

            invalidatesTags: ["BlockStatus"],
        }),
        defaultUnblockUser: builder.mutation<void, string>({
            query: (blockedId) => ({
                url: `UserBlock/unblock/${blockedId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ["BlockStatus"],
        }),
        getBlockedUsers: builder.query<IBlockedUser[], void>({
            query: () => `UserBlock/blocked`,
            providesTags: ['BlockStatus'],
        }),
    }),
});

export const {
    useDefaultIsBlockedQuery,
    useDefaultBlockUserMutation,
    useDefaultUnblockUserMutation,
    useGetBlockedUsersQuery,
} = blockService;
