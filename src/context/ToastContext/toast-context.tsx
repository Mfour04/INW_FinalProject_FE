import { createContext, useContext } from "react";

export type ToastVariant = "info" | "success" | "warning" | "error";

export type ToastInput = 
  | string
  | { message: string; variant?: ToastVariant; duration?: number };

type ToastContextValue = {
  onOpen: (input: ToastInput) => void;
  onClose: (id: number) => void;
};

export const ToastContext = createContext<ToastContextValue | null>(null);
export const useToast = () => useContext(ToastContext);
