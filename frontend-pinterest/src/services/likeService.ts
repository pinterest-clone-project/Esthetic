import { api } from "./api.ts";

export const likeService = api.injectEndpoints({
    endpoints: (builder) => ({
        like: builder.mutation<void, string>({
            query: (pinId) => ({
                url: `Likes/like/${pinId}`,
                method: 'PUT',
            }),
        }),
        unlike: builder.mutation<void, string>({
            query: (pinId) => ({
                url: `Likes/unlike/${pinId}`,
                method: 'DELETE',
            }),
        }),
    }),
});

export const {
    useLikeMutation,
    useUnlikeMutation,
} = likeService;

