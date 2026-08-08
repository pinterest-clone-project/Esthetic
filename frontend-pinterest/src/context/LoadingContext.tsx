import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

interface LoadingContextType {
    isLoading: boolean;
    startLoading: () => void;
    stopLoading: () => void;
    withLoading: <T>(fn: () => Promise<T>) => Promise<T>;
}

const LoadingContext = createContext<LoadingContextType | null>(null);

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
    const [count, setCount] = useState(0);

    const startLoading = useCallback(() => setCount(c => c + 1), []);
    const stopLoading = useCallback(() => setCount(c => Math.max(0, c - 1)), []);

    const withLoading = useCallback(async <T,>(fn: () => Promise<T>): Promise<T> => {
        startLoading();
        try {
            return await fn();
        } finally {
            stopLoading();
        }
    }, [startLoading, stopLoading]);

    return (
        <LoadingContext.Provider value={{ isLoading: count > 0, startLoading, stopLoading, withLoading }}>
            {children}
        </LoadingContext.Provider>
    );
};

export const useLoading = () => {
    const ctx = useContext(LoadingContext);
    if (!ctx) throw new Error("useLoading must be used within LoadingProvider");
    return ctx;
};
