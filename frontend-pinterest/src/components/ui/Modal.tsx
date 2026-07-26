import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { CloseIcon } from "@/components/ui/Icons.tsx";
import { fadeIn, scaleIn, slideFromLeft } from "@/lib/motion";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    closeOnOverlay?: boolean;
    width?: number;
    height?: number | "auto";
    borderRadius?: number;
    variant?: "centered" | "sidebar";
    title?: string;
    disableInnerScroll?: boolean;
}

const Modal = ({
                   isOpen,
                   onClose,
                   children,
                   closeOnOverlay = true,
                   width = 450,
                   height = 675,
                   borderRadius = 20,
                   variant = "centered",
                   title,
                   disableInnerScroll = false,
               }: ModalProps) => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    useEffect(() => {
        if (!isOpen) return;
        const scrollY = window.scrollY;
        document.body.style.position = "fixed";
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = "100%";
        return () => {
            document.body.style.position = "";
            document.body.style.top = "";
            document.body.style.width = "";
            window.scrollTo(0, scrollY);
        };
    }, [isOpen]);

    if (variant === "sidebar") {
        return createPortal(
            <AnimatePresence>
                {isOpen && (
                    <>
                        {closeOnOverlay && (
                            <motion.div
                                className="fixed inset-0 z-40"
                                variants={fadeIn}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                onClick={onClose}
                            />
                        )}
                        <motion.div
                            style={{
                                width,
                                left: `calc((100vw - 1505px) / 2 + 64px)`,
                                top: 0,
                                borderTopRightRadius: borderRadius,
                                borderBottomRightRadius: borderRadius,
                                borderTopLeftRadius: 0,
                                borderBottomLeftRadius: 0,
                            }}
                            className="fixed bottom-0 z-50 bg-white dark:bg-[#1a1a1a] shadow-2xl flex flex-col"
                            variants={slideFromLeft}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {title && (
                                <div className="flex items-center justify-between px-3 py-4 border-b border-[#a1a1a1] dark:border-[#2a2a2a] shrink-0">
                                    <h2 className="text-black dark:text-white font-semibold text-sm tracking-[-0.5px]">
                                        {title}
                                    </h2>
                                    <button
                                        onClick={onClose}
                                        className="w-7 h-7 flex items-center justify-center rounded-full bg-[#A1A1A1] dark:bg-[#a2a2a2] hover:bg-[#3a3a3a] transition-colors cursor-pointer"
                                    >
                                        <CloseIcon className="text-white" />
                                    </button>
                                </div>
                            )}

                            <div className={`flex-1 min-h-0 px-0 py-2 flex flex-col ${disableInnerScroll ? "overflow-hidden" : "overflow-y-auto"}`}>
                                {children}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>,
            document.body
        );
    }

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/60"
                    variants={fadeIn}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    onClick={closeOnOverlay ? onClose : undefined}
                >
                    <motion.div
                        style={{
                            maxWidth: width,
                            height: height === "auto" ? undefined : height,
                            maxHeight: "90vh",
                            borderRadius,
                        }}
                        className="w-full mx-4 bg-black dark:bg-white shadow-2xl p-8 overflow-y-auto overscroll-contain"
                        variants={scaleIn}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {children}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
};

export default Modal;