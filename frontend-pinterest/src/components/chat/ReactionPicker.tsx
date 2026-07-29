import { useState, useRef, useEffect } from "react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

const QUICK_REACTIONS = ["👍", "❤️", "😂", "😮", "😢", "😡"];

interface ReactionPickerProps {
    onSelect: (emoji: string) => void;
    onClose: () => void;
    isOwn: boolean;
}

export const ReactionPicker = ({ onSelect, onClose, isOwn }: ReactionPickerProps) => {
    const [showFull, setShowFull] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) onClose();
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [onClose]);

    return (
        <div
            ref={ref}
            className={`absolute z-50 bottom-full mb-1 ${isOwn ? "right-0" : "left-0"}`}
        >
            {!showFull ? (
                <div className="flex items-center gap-1 bg-white dark:bg-[#1e1e1e] border border-[#e5e5e5] dark:border-[#333] rounded-full px-2 py-1 shadow-lg">
                    {QUICK_REACTIONS.map((emoji) => (
                        <button
                            key={emoji}
                            onClick={() => { onSelect(emoji); onClose(); }}
                            className="text-lg hover:scale-125 transition-transform leading-none"
                        >
                            {emoji}
                        </button>
                    ))}
                    <button
                        onClick={() => setShowFull(true)}
                        className="text-[#888] hover:text-black dark:hover:text-white text-sm px-1 transition-colors"
                    >
                        +
                    </button>
                </div>
            ) : (
                <div className="shadow-xl rounded-xl overflow-hidden">
                    <Picker
                        data={data}
                        onEmojiSelect={(e: { native: string }) => { onSelect(e.native); onClose(); }}
                        theme="auto"
                        previewPosition="none"
                        skinTonePosition="none"
                    />
                </div>
            )}
        </div>
    );
};
