import { createContext } from 'react';
import type { ToastVariant } from './Toast';

export interface ToastContextValue {
    showToast: (message: string, variant?: ToastVariant) => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);