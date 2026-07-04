import { api } from "./api.ts";
import { serialize } from "object-to-formdata";
import type { ICreateComment } from "../types/comment/ICreateComment.ts";
import type { IComment } from "../types/comment/IComment.ts";

export const commentService = api.injectEndpoints({
    endpoints: (builder) => ({
        createComment: builder.mutation<IComment, ICreateComment>({
            query: (data) => ({
                url: 'Comments/create',
                method: 'POST',
                body: serialize(data),
            }),
            invalidatesTags: (_res, _err, arg) => [{ type: 'Comments', id: arg.pinId }],
        }),
        deleteComment: builder.mutation<void, { id: string; pinId: string }>({
            query: ({ id }) => ({
                url: `Comments/delete/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (_res, _err, arg) => [{ type: 'Comments', id: arg.pinId }],
        }),
        getComments: builder.query<IComment[], string>({
            query: (pinId) => ({
                url: `Comments/getComments/${pinId}`,
                method: 'GET',
            }),
            providesTags: (_res, _err, pinId) => [{ type: 'Comments', id: pinId }],
        }),
    }),
});

export const {
    useCreateCommentMutation,
    useDeleteCommentMutation,
    useGetCommentsQuery,
} = commentService;
