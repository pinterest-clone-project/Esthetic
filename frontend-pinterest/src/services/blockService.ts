import { api } from "./api.ts";

export const blockService = api.injectEndpoints({
    endpoints: (builder) => ({
        blockUser: builder.mutation<void, string>({
            query: (blockedId) => ({
                url: `UserBlock/block/${blockedId}`,
                method: 'PUT',
            }),
        }),
        unblockUser: builder.mutation<void, string>({
            query: (blockedId) => ({
                url: `UserBlock/unblock/${blockedId}`,
                method: 'DELETE',
            }),
        }),
    }),
});

export const {
    useBlockUserMutation,
    useUnblockUserMutation,
} = blockService;
