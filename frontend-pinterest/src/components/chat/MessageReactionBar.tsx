import type { IReactionGroup } from "@/types/chat/IReactionGroup.ts";

interface MessageReactionBarProps {
    reactions: IReactionGroup[];
    currentUserEmoji: string | null;
    onToggle: (emoji: string) => void;
    isOwn: boolean;
}

export const MessageReactionBar = ({ reactions, currentUserEmoji, onToggle, isOwn }: MessageReactionBarProps) => {
    if (reactions.length === 0) return null;

    return (
        <div className={`flex flex-wrap gap-1 mt-1 ${isOwn ? "justify-end" : "justify-start"}`}>
            {reactions.map(({ emoji, count }) => (
                <button
                    key={emoji}
                    onClick={() => onToggle(emoji)}
                    className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-xs border transition-colors ${
                        currentUserEmoji === emoji
                            ? "bg-[#1DB954]/20 border-[#1DB954] text-black dark:text-white"
                            : "bg-white dark:bg-[#1e1e1e] border-[#e5e5e5] dark:border-[#333] text-black dark:text-white hover:bg-[#f5f5f5] dark:hover:bg-[#2a2a2a]"
                    }`}
                >
                    <span>{emoji}</span>
                    <span className="text-[10px] text-[#666] dark:text-[#aaa]">{count}</span>
                </button>
            ))}
        </div>
    );
};
