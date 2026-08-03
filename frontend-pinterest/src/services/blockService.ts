import { api } from "./api.ts";

export const blockService = api.injectEndpoints({
    endpoints: (builder) => ({
        defaultIsBlocked: builder.query<boolean, string>({
            query: (blockedId) => `UserBlock/isBlocked/${blockedId}`,
            providesTags: ["BlockStatus"],
            // providesTags: (_res, _err, id) => [{ type: 'BlockStatus', id }],
        }),
        defaultBlockUser: builder.mutation<void, string>({
            // query: (blockedId) => ({
            //     url: `UserBlock/block/${String(blockedId)}`,
            //     method: 'PUT',
            // }),

            query: (blockedId) => {
                console.log(blockedId);

                return {
                    url: `UserBlock/block/${String(blockedId)}`,
                    method: 'PUT',
                };
            },
            invalidatesTags: ["BlockStatus"],
            // invalidatesTags: (_res, _err, id) => [{ type: 'BlockStatus', id }],
        }),
        defaultUnblockUser: builder.mutation<void, string>({
            query: (blockedId) => ({
                url: `UserBlock/unblock/${blockedId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ["BlockStatus"],
            // invalidatesTags: (_res, _err, id) => [{ type: 'BlockStatus', id }],
        }),
    }),
});

export const {
    useDefaultIsBlockedQuery,
    useDefaultBlockUserMutation,
    useDefaultUnblockUserMutation,
} = blockService;
