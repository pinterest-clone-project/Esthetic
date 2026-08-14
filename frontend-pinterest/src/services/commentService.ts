import { api } from "./api.ts";
import { serialize } from "object-to-formdata";
import type { ICreateComment } from "../types/comment/ICreateComment.ts";
import type { IComment } from "../types/comment/IComment.ts";
import type { IReactionGroup } from "@/types/chat/IReactionGroup";

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
        updateComment: builder.mutation<IComment, { id: string; text: string; pinId: string }>({
            query: ({ id, text }) => ({
                url: 'Comments/update',
                method: 'PUT',
                body: serialize({ commentId: id, text }),
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

        toggleCommentReaction: builder.mutation<IReactionGroup[], { commentId: string; emoji: string; pinId: string }>({
            query: ({ commentId, emoji }) => ({
                url: `Comments/${commentId}/reactions`,
                method: 'POST',
                body: { emoji },
            }),
            async onQueryStarted({ commentId, emoji, pinId }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    commentService.util.updateQueryData("getComments", pinId, (draft) => {
                        const updateComment = (comments: IComment[]) => {
                            for (const c of comments) {
                                if (c.id === commentId) {
                                    const existing = c.reactions.find(r => r.emoji === emoji);
                                    if (c.myReaction === emoji) {
                                        // remove
                                        c.reactions = c.reactions
                                            .map(r => r.emoji === emoji ? { ...r, count: r.count - 1 } : r)
                                            .filter(r => r.count > 0);
                                        c.myReaction = null;
                                    } else {
                                        // remove old reaction if any
                                        if (c.myReaction) {
                                            c.reactions = c.reactions
                                                .map(r => r.emoji === c.myReaction ? { ...r, count: r.count - 1 } : r)
                                                .filter(r => r.count > 0);
                                        }
                                        // add new
                                        if (existing) {
                                            c.reactions = c.reactions.map(r => r.emoji === emoji ? { ...r, count: r.count + 1 } : r);
                                        } else {
                                            c.reactions = [...c.reactions, { emoji, count: 1 }];
                                        }
                                        c.myReaction = emoji;
                                    }
                                    return;
                                }
                                if (c.replies) updateComment(c.replies);
                            }
                        };
                        updateComment(draft);
                    })
                );
                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },
        }),
    }),
});

export const {
    useCreateCommentMutation,
    useUpdateCommentMutation,
    useDeleteCommentMutation,
    useGetCommentsQuery,
    useToggleCommentReactionMutation,
} = commentService;
