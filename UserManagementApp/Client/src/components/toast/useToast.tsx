import { useState } from "react";
import { Toast, ToastType } from "./Toast";

export function useToast() {
    const [toast, setToast] = useState<{
        message: string;
        type: ToastType;
    } | null>(null);

    function showToast(message: string, type: ToastType = "success") {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    }

    const ToastElement = toast
        ? <Toast message={toast.message} type={toast.type} />
        : null;

    return { showToast, ToastElement };
}
