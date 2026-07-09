import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { getCommentConnection, startCommentConnection, joinPinGroup, leavePinGroup } from "@/utils/commentHub.ts";
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

        const setup = async () => {
            await startCommentConnection();
            if (!active) return;

            const connection = getCommentConnection();

            // Join the pin-specific group
            await joinPinGroup(pinId);

            connection.on("CommentCreated", (comment: IComment) => {
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
            });

            connection.on("CommentUpdated", (comment: IComment) => {
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
            });

            connection.on("CommentDeleted", (commentId: string) => {
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
            });
        };

        setup();

        return () => {
            active = false;
            const conn = getCommentConnection();
            conn.off("CommentCreated");
            conn.off("CommentUpdated");
            conn.off("CommentDeleted");
            leavePinGroup(pinId);
        };
    }, [isAuth, pinId, enabled, dispatch]);
};
