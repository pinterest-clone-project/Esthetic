import { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";

interface FloatingEmojiProps {
    emoji: string;
    x: number;
    y: number;
    onDone: () => void;
}

export const FloatingEmoji = ({ emoji, x, y, onDone }: FloatingEmojiProps) => {
    useEffect(() => {
        const timer = setTimeout(onDone, 700);
        return () => clearTimeout(timer);
    }, [onDone]);

    return createPortal(
        <motion.div
            initial={{ opacity: 1, scale: 1, x, y }}
            animate={{ opacity: 0, scale: 1.6, x, y: y - 80 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{ position: "fixed", top: 0, left: 0, pointerEvents: "none", zIndex: 99999, fontSize: 24 }}
        >
            {emoji}
        </motion.div>,
        document.body
    );
};
