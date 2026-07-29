import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

const QUICK_REACTIONS = ["👍", "❤️", "😂", "😮", "😢", "😡"];

interface ReactionPickerProps {
    anchorEl: HTMLElement | null;
    onSelect: (emoji: string) => void;
    onClose: () => void;
    isOwn: boolean;
}

export const ReactionPicker = ({ anchorEl, onSelect, onClose, isOwn }: ReactionPickerProps) => {
    const [showFull, setShowFull] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const rect = anchorEl?.getBoundingClientRect();

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (
                ref.current && !ref.current.contains(e.target as Node) &&
                e.target !== anchorEl
            ) onClose();
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [onClose, anchorEl]);

    if (!rect) return null;

    const pickerHeight = showFull ? 450 : 52;
    const spaceAbove = rect.top;
    const spaceBelow = window.innerHeight - rect.bottom;
    const placeAbove = spaceAbove >= pickerHeight || spaceAbove >= spaceBelow;

    // Горизонтально: для своїх повідомлень — від правого краю кнопки,
    // але не ближче 8px від краю екрана
    const horizontalStyle: React.CSSProperties = isOwn
        ? { right: Math.max(8, window.innerWidth - rect.right) }
        : { left: Math.min(rect.left, window.innerWidth - 280) }; // 280 — мін. ширина picker

    const style: React.CSSProperties = {
        position: "fixed",
        zIndex: 9999,
        ...horizontalStyle,
        ...(placeAbove
            ? { bottom: window.innerHeight - rect.top + 8, maxHeight: spaceAbove - 8 }
            : { top: rect.bottom + 8, maxHeight: spaceBelow - 8 }),
        overflowY: "auto",
    };

    return createPortal(
        <div ref={ref} style={style}>

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
        </div>,
        document.body
    );
};
