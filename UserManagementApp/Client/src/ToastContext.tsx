import { createContext, useContext } from "react";

type ToastContextType = {
    showToast: (message: string, type?: "success" | "error") => void;
};

export const ToastContext = createContext<ToastContextType | null>(null);

export function useToastContext() {
    const ctx = useContext(ToastContext);
    if (!ctx) {
        throw new Error("useToastContext must be used inside ToastProvider");
    }
    return ctx;
}
