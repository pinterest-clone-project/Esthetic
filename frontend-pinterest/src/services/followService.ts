import { api } from "@/services/api.ts";
import type { IFollowRequest } from "@/types/follow/IFollowRequest.ts";

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
        sendFollowRequest: builder.mutation<void, string>({
            query: (targetId) => ({ url: `Follow/request/${targetId}`, method: 'POST' }),
            invalidatesTags: (_res, _err, id) => [{ type: 'FollowStats', id }],
        }),
        cancelFollowRequest: builder.mutation<void, string>({
            query: (targetId) => ({ url: `Follow/cancel/${targetId}`, method: 'DELETE' }),
            invalidatesTags: (_res, _err, id) => [{ type: 'FollowStats', id }],
        }),
        acceptFollowRequest: builder.mutation<void, string>({
            query: (requesterId) => ({ url: `Follow/accept/${requesterId}`, method: 'PUT' }),
            invalidatesTags: ['FollowRequests'],
        }),
        declineFollowRequest: builder.mutation<void, string>({
            query: (requesterId) => ({ url: `Follow/decline/${requesterId}`, method: 'DELETE' }),
            invalidatesTags: ['FollowRequests'],
        }),
        getFollowRequests: builder.query<IFollowRequest[], void>({
            query: () => ({ url: 'Follow/requests', method: 'GET' }),
            providesTags: ['FollowRequests'],
        }),
    }),
});

export const {
    useFollowMutation,
    useUnfollowMutation,
    useSendFollowRequestMutation,
    useCancelFollowRequestMutation,
    useAcceptFollowRequestMutation,
    useDeclineFollowRequestMutation,
    useGetFollowRequestsQuery,
} = followService;
