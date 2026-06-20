import { useContext } from 'react';
import { ToastContext } from './ToastContext';

export const useToast = () => {
    const ctx = useContext(ToastContext);
    if (!ctx) {
        throw new Error('useToast має використовуватись всередині ToastProvider');
    }
    return ctx;
};