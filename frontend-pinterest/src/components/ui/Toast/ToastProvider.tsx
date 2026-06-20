import { useCallback, useState, type ReactNode } from 'react';
import { Toast, type ToastVariant } from './Toast';
import { ToastContext } from './ToastContext';

interface ToastItem {
    id: string;
    message: string;
    variant: ToastVariant;
}

export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const showToast = useCallback((message: string, variant: ToastVariant = 'success') => {
        const id = crypto.randomUUID();
        setToasts((prev) => [...prev, { id, message, variant }]);
        setTimeout(() => removeToast(id), 3500);
    }, [removeToast]);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
                {toasts.map((toast) => (
                    <Toast key={toast.id} message={toast.message} variant={toast.variant} onClose={() => removeToast(toast.id)} />
                ))}
            </div>
        </ToastContext.Provider>
    );
};