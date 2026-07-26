import { motion } from 'framer-motion';
import { toastVariants } from '@/lib/motion';

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
    return (
        <motion.div
            layout
            className={`flex items-center gap-3 min-w-[280px] max-w-[360px] px-4 py-3 rounded-lg
        bg-[#1E1E1E] text-white shadow-lg ${variantStyles[variant]}`}
            variants={toastVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
        >
            <span className="font-semibold text-[var(--color-btn-primary)]">{variantIcon[variant]}</span>
            <p className="text-sm flex-1">{message}</p>
            <button onClick={onClose} className="text-[var(--color-text-muted)] hover:text-white">
                ✕
            </button>
        </motion.div>
    );
};
