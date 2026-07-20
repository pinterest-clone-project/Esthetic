import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { getCommentConnection, subscribeToPin, unsubscribeFromPin } from "@/utils/commentHub.ts";
import type { IComment } from "@/types/comment/IComment.ts";
import { commentService } from "@/services/commentService.ts";
import { selectIsAuth } from "@/store/selectors/authSelectors.ts";

interface UseCommentRealtimeProps {
    pinId: string;
    enabled?: boolean;
}

export const useCommentRealtime = ({ pinId, enabled = true }: UseCommentRealtimeProps) => {
    const dispatch = useAppDispatch();
    const isAuth = useAppSelector(selectIsAuth);

    useEffect(() => {
        if (!isAuth || !enabled) return;

        let active = true;
        let handlers: {
            created: (comment: IComment) => void;
            updated: (comment: IComment) => void;
            deleted: (commentId: string) => void;
        } | null = null;

        const setup = async () => {
            const connection = getCommentConnection();

            const handleCommentCreated = (comment: IComment) => {
                dispatch(
                    commentService.util.updateQueryData("getComments", pinId, (draft) => {
                        // If it's a reply, add it to the parent's replies
                        if (comment.parentCommentId) {
                            const parent = draft.find(c => c.id === comment.parentCommentId);
                            if (parent) {
                                if (!parent.replies) parent.replies = [];
                                if (!parent.replies.some(r => r.id === comment.id)) {
                                    parent.replies.push(comment);
                                }
                            }
                        } else {
                            // It's a top-level comment
                            if (!draft.some(c => c.id === comment.id)) {
                                draft.unshift(comment);
                            }
                        }
                    })
                );
            };

            const handleCommentUpdated = (comment: IComment) => {
                dispatch(
                    commentService.util.updateQueryData("getComments", pinId, (draft) => {
                        // Update top-level comment
                        const topLevelIndex = draft.findIndex(c => c.id === comment.id);
                        if (topLevelIndex !== -1) {
                            draft[topLevelIndex] = comment;
                        } else {
                            // Update in replies
                            for (const parent of draft) {
                                if (parent.replies) {
                                    const replyIndex = parent.replies.findIndex(r => r.id === comment.id);
                                    if (replyIndex !== -1) {
                                        parent.replies[replyIndex] = comment;
                                        break;
                                    }
                                }
                            }
                        }
                    })
                );
            };

            const handleCommentDeleted = (commentId: string) => {
                dispatch(
                    commentService.util.updateQueryData("getComments", pinId, (draft) => {
                        // Remove top-level comment
                        const topLevelIndex = draft.findIndex(c => c.id === commentId);
                        if (topLevelIndex !== -1) {
                            draft.splice(topLevelIndex, 1);
                        } else {
                            // Remove from replies
                            for (const parent of draft) {
                                if (parent.replies) {
                                    const replyIndex = parent.replies.findIndex(r => r.id === commentId);
                                    if (replyIndex !== -1) {
                                        parent.replies.splice(replyIndex, 1);
                                        break;
                                    }
                                }
                            }
                        }
                    })
                );
            };

            handlers = {
                created: handleCommentCreated,
                updated: handleCommentUpdated,
                deleted: handleCommentDeleted,
            };
            connection.on("CommentCreated", handleCommentCreated);
            connection.on("CommentUpdated", handleCommentUpdated);
            connection.on("CommentDeleted", handleCommentDeleted);

            await subscribeToPin(pinId);
            if (!active) {
                connection.off("CommentCreated", handleCommentCreated);
                connection.off("CommentUpdated", handleCommentUpdated);
                connection.off("CommentDeleted", handleCommentDeleted);
            }
        };

        setup();

        return () => {
            active = false;
            const conn = getCommentConnection();
            if (handlers) {
                conn.off("CommentCreated", handlers.created);
                conn.off("CommentUpdated", handlers.updated);
                conn.off("CommentDeleted", handlers.deleted);
            }
            void unsubscribeFromPin(pinId);
        };
    }, [isAuth, pinId, enabled, dispatch]);
};
