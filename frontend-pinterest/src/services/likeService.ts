import { api } from "./api.ts";
import type {ICategory} from "@/types/categories/ICategory.ts";

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

