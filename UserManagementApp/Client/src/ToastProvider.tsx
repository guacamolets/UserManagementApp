import { ReactNode } from "react";
import { useToast } from "./useToast";
import { ToastContext } from "./ToastContext";

export function ToastProvider({ children }: { children: ReactNode }) {
    const { showToast, ToastElement } = useToast();

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {ToastElement}
        </ToastContext.Provider>
    );
}
