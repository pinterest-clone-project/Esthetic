import { api } from "./api.ts";

export const blockService = api.injectEndpoints({
    endpoints: (builder) => ({
        defaultIsBlocked: builder.query<boolean, string>({
            query: (blockedId) => `UserBlock/isBlocked/${blockedId}`,
            providesTags: (_res, _err, id) => [{ type: 'BlockStatus', id }],
        }),
        defaultBlockUser: builder.mutation<void, string>({
            query: (blockedId) => ({
                url: `UserBlock/block/${blockedId}`,
                method: 'PUT',
            }),

            invalidatesTags: (_res, _err, id) => [{ type: 'BlockStatus', id }],
        }),
        defaultUnblockUser: builder.mutation<void, string>({
            query: (blockedId) => ({
                url: `UserBlock/unblock/${blockedId}`,
                method: 'DELETE',
            }),
            invalidatesTags: (_res, _err, id) => [{ type: 'BlockStatus', id }],
        }),
    }),
});

export const {
    useDefaultIsBlockedQuery,
    useDefaultBlockUserMutation,
    useDefaultUnblockUserMutation,
} = blockService;
