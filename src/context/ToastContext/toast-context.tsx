import { createContext, useContext } from "react";

type ToastContextValue = {
    onOpen: (message: string) => void;
    onClose: (id: number) => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);

export const useToast = () => useContext(ToastContext);