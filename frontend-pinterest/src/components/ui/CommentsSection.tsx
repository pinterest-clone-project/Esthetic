import { useState } from "react";
import { useGetCommentsQuery, useCreateCommentMutation, useDeleteCommentMutation } from "../../services/commentService.ts";
import { useGetMeQuery } from "../../services/accountService.ts";
import { APP_ENV } from "@/constants/env";

interface CommentsSectionProps {
    pinId: string;
}

const CommentsSection = ({ pinId }: CommentsSectionProps) => {
    const { data: comments, isLoading } = useGetCommentsQuery(pinId);
    const [createComment, { isLoading: isSubmitting }] = useCreateCommentMutation();
    const [deleteComment] = useDeleteCommentMutation();
    const { data: me } = useGetMeQuery();

    const [text, setText] = useState("");

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

    const handleDelete = async (id: string) => {
        await deleteComment({ id, pinId });
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
                {comments?.map(comment => {
                    const isOwn = me?.id === comment.userId;
                    return (
                        <div key={comment.id} className="flex gap-2.5 items-start group">
                            {/* Avatar */}
                            <div className="w-7 h-7 rounded-full bg-white/10 shrink-0 overflow-hidden mt-0.5">
                                {comment.userImage ? (
                                    <img
                                        src={`${APP_ENV.IMAGES_100_URL}${comment.userImage}`}
                                        alt={comment.username}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400 font-medium bg-white/5">
                                        {comment.username?.[0]?.toUpperCase() ?? "?"}
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-black dark:text-white text-xs font-medium">
                                        {comment.username ?? "User"}
                                    </span>
                                    <span className="text-gray-500 text-[10px]">
                                        {new Date(comment.createdAt).toLocaleDateString("en-GB", {
                                            day: "numeric", month: "short"
                                        })}
                                    </span>
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 text-xs leading-relaxed mt-0.5 break-words">
                                    {comment.text}
                                </p>
                            </div>

                            {/* Delete — own comments only */}
                            {isOwn && (
                                <button
                                    onClick={() => handleDelete(comment.id)}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-500
                                        hover:text-red-400 text-[10px] shrink-0 mt-0.5 px-1"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CommentsSection;
