import { api } from "./api.ts";

export const likeService = api.injectEndpoints({
    endpoints: (builder) => ({
        like: builder.mutation<void, string>({
            query: (pinId) => ({
                url: `Likes/like/${pinId}`,
                method: 'PUT',
            }),
            invalidatesTags: ["AllPins"],
        }),
        unlike: builder.mutation<void, string>({
            query: (pinId) => ({
                url: `Likes/unlike/${pinId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ["AllPins"],
        }),
    }),
});

export const {
    useLikeMutation,
    useUnlikeMutation,
} = likeService;

