import {api} from "@/services/api.ts";
export const followService = api.injectEndpoints({
    endpoints: (builder) => ({
        follow: builder.mutation<void, string>({
            query: (id) => ({ url: `Follow/follow/${id}`, method: 'PUT' }),
            invalidatesTags: (_res, _err, id) => [{ type: 'FollowStats', id }],
        }),
        unfollow: builder.mutation<void, string>({
            query: (id) => ({ url: `Follow/unfollow/${id}`, method: 'DELETE' }),
            invalidatesTags: (_res, _err, id) => [{ type: 'FollowStats', id }],
        }),
    }),
});

export const {
    useFollowMutation,
    useUnfollowMutation,
} = followService;
