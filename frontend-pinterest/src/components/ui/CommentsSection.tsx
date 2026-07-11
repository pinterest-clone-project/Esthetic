import { useState } from "react";
import { useGetCommentsQuery, useCreateCommentMutation, useUpdateCommentMutation, useDeleteCommentMutation } from "../../services/commentService.ts";
import { useGetMeQuery } from "../../services/accountService.ts";
import { useCommentRealtime } from "../../hooks/useCommentRealtime.ts";
import { APP_ENV } from "@/constants/env";
import {useNavigate} from "react-router";

interface CommentsSectionProps {
    pinId: string;
}

const CommentsSection = ({ pinId }: CommentsSectionProps) => {
    const { data: comments, isLoading } = useGetCommentsQuery(pinId);
    const [createComment, { isLoading: isSubmitting }] = useCreateCommentMutation();
    const [updateComment, { isLoading: isUpdating }] = useUpdateCommentMutation();
    const [deleteComment] = useDeleteCommentMutation();
    const { data: me } = useGetMeQuery();

    const navigate = useNavigate();

    useCommentRealtime({ pinId });

    const [text, setText] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editText, setEditText] = useState("");
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyText, setReplyText] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim()) return;
        try {
            await createComment({ pinId, text: text.trim() }).unwrap();
            setText("");
        } catch (err) {
            console.error(err);
        }
    };

    const handleReply = async (e: React.FormEvent, parentCommentId: string) => {
        e.preventDefault();
        if (!replyText.trim()) return;
        try {
            await createComment({ pinId, text: replyText.trim(), parentCommentId }).unwrap();
            setReplyText("");
            setReplyingTo(null);
        } catch (err) {
            console.error(err);
        }
    };

    const handleEdit = async (e: React.FormEvent, commentId: string) => {
        e.preventDefault();
        if (!editText.trim()) return;
        try {
            await updateComment({ id: commentId, text: editText.trim(), pinId }).unwrap();
            setEditingId(null);
            setEditText("");
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id: string) => {
        await deleteComment({ id, pinId });
    };

    const startEdit = (comment: any) => {
        setEditingId(comment.id);
        setEditText(comment.text);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditText("");
    };

    const startReply = (commentId: string) => {
        setReplyingTo(commentId);
        setReplyText("");
    };

    const cancelReply = () => {
        setReplyingTo(null);
        setReplyText("");
    };

    const renderComment = (comment: any, isReply = false) => {
        const isOwn = me?.id === comment.userId;
        const isEditing = editingId === comment.id;
        const isReplying = replyingTo === comment.id;

        return (
            <div key={comment.id} className={`flex gap-2.5 items-start group ${isReply ? 'ml-9 mt-2' : ''}`}>
                {/* Avatar */}
                <div onClick={() => navigate(`/user/${comment.userId}`)} className="w-7 h-7 rounded-full bg-white/10 shrink-0 overflow-hidden mt-0.5 hover:pointer">
                    {comment.userImage ? (
                        <img
                            src={`${APP_ENV.IMAGES_100_URL}${comment.userImage}`}
                            alt={comment.username}
                            className="w-full h-full object-cover cursor-pointer"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400 font-medium bg-white/5">
                            {comment.username?.[0]?.toUpperCase() ?? "?"}
                        </div>
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                        <button onClick={() => navigate(`/user/${comment.userId}`)} className="text-black dark:text-white text-xs font-medium">
                            {comment.username ?? "User"}
                        </button>
                        <span className="text-gray-500 text-[10px]">
                            {new Date(comment.createdAt).toLocaleDateString("en-GB", {
                                day: "numeric", month: "short"
                            })}
                        </span>
                    </div>

                    {isEditing ? (
                        <form onSubmit={(e) => handleEdit(e, comment.id)} className="mt-1">
                            <input
                                type="text"
                                value={editText}
                                onChange={e => setEditText(e.target.value)}
                                maxLength={500}
                                className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10
                                    rounded-lg px-2 py-1 text-black dark:text-white text-xs
                                    placeholder:text-gray-400 outline-none focus:border-[#4ade80] transition-colors"
                                autoFocus
                            />
                            <div className="flex gap-2 mt-1">
                                <button
                                    type="submit"
                                    disabled={isUpdating || !editText.trim()}
                                    className="bg-[#4ade80] hover:bg-[#22c55e] disabled:opacity-40 disabled:cursor-not-allowed
                                        text-black text-[10px] font-semibold px-2 py-0.5 rounded transition-colors"
                                >
                                    {isUpdating ? "..." : "Save"}
                                </button>
                                <button
                                    type="button"
                                    onClick={cancelEdit}
                                    className="text-gray-500 hover:text-gray-700 text-[10px] px-2 py-0.5"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        <p className="text-gray-600 dark:text-gray-300 text-xs leading-relaxed mt-0.5 break-words">
                            {comment.text}
                        </p>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!isReply && (
                            <button
                                onClick={() => startReply(comment.id)}
                                className="text-gray-500 hover:text-[#4ade80] text-[10px]"
                            >
                                Reply
                            </button>
                        )}
                        {isOwn && !isEditing && (
                            <>
                                <button
                                    onClick={() => startEdit(comment)}
                                    className="text-gray-500 hover:text-blue-400 text-[10px]"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(comment.id)}
                                    className="text-gray-500 hover:text-red-400 text-[10px]"
                                >
                                    Delete
                                </button>
                            </>
                        )}
                    </div>

                    {/* Reply Input */}
                    {isReplying && me && (
                        <form onSubmit={(e) => handleReply(e, comment.id)} className="mt-2 flex gap-2 items-start">
                            <div className="w-5 h-5 rounded-full bg-white/10 shrink-0 overflow-hidden">
                                {me.image ? (
                                    <img
                                        src={`${APP_ENV.IMAGES_100_URL}${me.image}`}
                                        alt={me.username}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[8px] text-gray-400 font-medium">
                                        {me.username?.[0]?.toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <input
                                    type="text"
                                    value={replyText}
                                    onChange={e => setReplyText(e.target.value)}
                                    placeholder={`Reply to ${comment.username}...`}
                                    maxLength={500}
                                    className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10
                                        rounded-lg px-2 py-1 text-black dark:text-white text-xs
                                        placeholder:text-gray-400 outline-none focus:border-[#4ade80] transition-colors"
                                    autoFocus
                                />
                                <div className="flex gap-2 mt-1">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || !replyText.trim()}
                                        className="bg-[#4ade80] hover:bg-[#22c55e] disabled:opacity-40 disabled:cursor-not-allowed
                                            text-black text-[10px] font-semibold px-2 py-0.5 rounded transition-colors"
                                    >
                                        {isSubmitting ? "..." : "Reply"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={cancelReply}
                                        className="text-gray-500 hover:text-gray-700 text-[10px] px-2 py-0.5"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}

                    {/* Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                        <div className="flex flex-col gap-2 mt-2">
                            {comment.replies.map((reply: any) => renderComment(reply, true))}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col gap-4">
            <h3 className="text-black dark:text-white text-sm font-semibold">
                Comments {comments?.length ? `(${comments.length})` : ""}
            </h3>

            {/* Input */}
            {me ? (
                <form onSubmit={handleSubmit} className="flex gap-2 items-start">
                    {/* Avatar */}
                    <div className="w-7 h-7 rounded-full bg-white/10 shrink-0 overflow-hidden mt-0.5">
                        {me.image ? (
                            <img
                                src={`${APP_ENV.IMAGES_100_URL}${me.image}`}
                                alt={me.username}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400 font-medium">
                                {me.username?.[0]?.toUpperCase()}
                            </div>
                        )}
                    </div>

                    <div className="flex-1 flex gap-2">
                        <input
                            type="text"
                            value={text}
                            onChange={e => setText(e.target.value)}
                            placeholder="Add a comment..."
                            maxLength={500}
                            className="flex-1 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10
                                rounded-xl px-3 h-8 text-black dark:text-white text-xs
                                placeholder:text-gray-400 outline-none focus:border-[#4ade80] transition-colors"
                        />
                        <button
                            type="submit"
                            disabled={isSubmitting || !text.trim()}
                            className="bg-[#4ade80] hover:bg-[#22c55e] disabled:opacity-40 disabled:cursor-not-allowed
                                text-black text-xs font-semibold px-3 h-8 rounded-xl transition-colors shrink-0"
                        >
                            {isSubmitting ? "..." : "Post"}
                        </button>
                    </div>
                </form>
            ) : (
                <p className="text-gray-500 text-xs">Sign in to comment.</p>
            )}

            {/* List */}
            {isLoading && (
                <div className="flex justify-center py-4">
                    <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-[#4ade80] animate-spin" />
                </div>
            )}

            {!isLoading && !comments?.length && (
                <p className="text-gray-500 text-xs text-center py-4">No comments yet. Be the first!</p>
            )}

            <div className="flex flex-col gap-4">
                {comments?.map(comment => renderComment(comment))}
            </div>
        </div>
    );
};

export default CommentsSection;
