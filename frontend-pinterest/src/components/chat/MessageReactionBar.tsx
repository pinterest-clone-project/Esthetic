import { useState, type MouseEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { IReactionGroup } from "@/types/chat/IReactionGroup.ts";
import { FloatingEmoji } from "@/components/chat/FloatingEmoji.tsx";

interface MessageReactionBarProps {
    reactions: IReactionGroup[];
    currentUserEmoji: string | null;
    onToggle: (emoji: string) => void;
    isOwn: boolean;
}

export const MessageReactionBar = ({ reactions, currentUserEmoji, onToggle, isOwn }: MessageReactionBarProps) => {
    const [floating, setFloating] = useState<{ emoji: string; x: number; y: number } | null>(null);

    if (reactions.length === 0) return null;

    const handleClick = (emoji: string, e: MouseEvent<HTMLButtonElement>) => {
        if (currentUserEmoji !== emoji) {
            const rect = e.currentTarget.getBoundingClientRect();
            setFloating({ emoji, x: rect.left + rect.width / 2 - 12, y: rect.top - 12 });
        }
        onToggle(emoji);
    };

    return (
        <>
            <div className={`flex flex-wrap gap-1 mt-1 ${isOwn ? "justify-end" : "justify-start"}`}>
                <AnimatePresence initial={false}>
                    {reactions.map(({ emoji, count }) => (
                        <motion.button
                            key={emoji}
                            layout
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                            onClick={(e) => handleClick(emoji, e)}
                            className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-xs border transition-colors ${
                                currentUserEmoji === emoji
                                    ? "bg-[#1DB954]/20 border-[#1DB954] text-black dark:text-white"
                                    : "bg-white dark:bg-[#1e1e1e] border-[#e5e5e5] dark:border-[#333] text-black dark:text-white hover:bg-[#f5f5f5] dark:hover:bg-[#2a2a2a]"
                            }`}
                        >
                            <span>{emoji}</span>
                            <motion.span
                                key={count}
                                initial={{ y: -6, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.2 }}
                                className="text-[10px] text-[#666] dark:text-[#aaa]"
                            >
                                {count}
                            </motion.span>
                        </motion.button>
                    ))}
                </AnimatePresence>
            </div>

            {floating && (
                <FloatingEmoji
                    emoji={floating.emoji}
                    x={floating.x}
                    y={floating.y}
                    onDone={() => setFloating(null)}
                />
            )}
        </>
    );
};
