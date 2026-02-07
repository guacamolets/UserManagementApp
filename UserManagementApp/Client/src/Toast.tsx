import "./Toast.css";

export type ToastType = "success" | "error";

export function Toast({ message, type }: { message: string; type: ToastType }) {
    return (
        <div className={`toast ${type}`}>
            {message}
        </div>
    );
}
