import { api } from "./api.ts";

export const blockService = api.injectEndpoints({
    endpoints: (builder) => ({
        isBlocked: builder.query<boolean, string>({
            query: (blockedId) => `UserBlock/isBlocked/${blockedId}`,
            providesTags: (_res, _err, id) => [{ type: 'BlockStatus', id }],
        }),
        blockUser: builder.mutation<void, string>({
            query: (blockedId) => ({
                url: `UserBlock/block/${String(blockedId)}`,
                method: 'PUT',
                body: null,
            }),
            invalidatesTags: (_res, _err, id) => [{ type: 'BlockStatus', id }],
        }),
        unblockUser: builder.mutation<void, string>({
            query: (blockedId) => ({
                url: `UserBlock/unblock/${blockedId}`,
                method: 'DELETE',
                body: null,
            }),
            invalidatesTags: (_res, _err, id) => [{ type: 'BlockStatus', id }],
        }),
    }),
});

export const {
    useIsBlockedQuery,
    useBlockUserMutation,
    useUnblockUserMutation,
} = blockService;
