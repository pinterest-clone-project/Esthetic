import { useEffect, useState } from 'react';

export type ToastVariant = 'success' | 'error' | 'info';

interface ToastProps {
    message: string;
    variant: ToastVariant;
    onClose: () => void;
}

const variantStyles: Record<ToastVariant, string> = {
    success: 'border-l-4 border-[var(--color-btn-primary)]',
    error: 'border-l-4 border-red-500',
    info: 'border-l-4 border-[var(--color-btn-secondary)]',
};

const variantIcon: Record<ToastVariant, string> = {
    success: '✓',
    error: '✕',
    info: 'i',
};

export const Toast = ({ message, variant, onClose }: ToastProps) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isLeaving, setIsLeaving] = useState(false);

    useEffect(() => {
        const showTimer = setTimeout(() => setIsVisible(true), 10);
        const leaveTimer = setTimeout(() => setIsLeaving(true), 3000);
        return () => {
            clearTimeout(showTimer);
            clearTimeout(leaveTimer);
        };
    }, []);

    const animationClass = !isVisible
        ? 'opacity-0 translate-y-2 scale-95'
        : isLeaving
            ? 'opacity-0 translate-x-2'
            : 'opacity-100 translate-y-0 translate-x-0 scale-100';

    return (
        <div
            className={`flex items-center gap-3 min-w-[280px] max-w-[360px] px-4 py-3 rounded-lg
        bg-[#1E1E1E] text-white shadow-lg ${variantStyles[variant]}
        transition-all duration-300 ease-out ${animationClass}`}
            onTransitionEnd={() => isLeaving && onClose()}
        >
            <span className="font-semibold text-[var(--color-btn-primary)]">{variantIcon[variant]}</span>
            <p className="text-sm flex-1">{message}</p>
            <button onClick={() => setIsLeaving(true)} className="text-[var(--color-text-muted)] hover:text-white">
                ✕
            </button>
        </div>
    );
};