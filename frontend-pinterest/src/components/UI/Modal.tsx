/*
import React from "react";

interface ModalProps {
    children: React.ReactNode;
}

const Modal = ({ children }: ModalProps) => {
    return (
        <div className="flex items-start justify-center w-full h-full pt-8 pb-8">
            <div className="bg-white rounded-2xl shadow-2xl w-[440px] max-h-full overflow-y-auto p-8">
                {children}
            </div>
        </div>
    );
};

export default Modal;
*/


import React, { useEffect } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    closeOnOverlay?: boolean;
    width?: number;
    height?: number;
    borderRadius?: number;
}

const Modal = ({
                   isOpen,
                   onClose,
                   children,
                   closeOnOverlay = true,
                   width = 450,
                   height = 675,
                   borderRadius = 20,
               }: ModalProps) => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    useEffect(() => {
        if (isOpen) document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);

    if (!isOpen) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
            onClick={closeOnOverlay ? onClose : undefined}
        >
            <div
                style={{ width, height, borderRadius }}
                className="bg-white shadow-2xl overflow-y-auto p-8"
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>,
        document.body
    );
};

export default Modal;
