import { useEffect, useMemo, useRef, useState } from "react";
import { ToastContext } from "./toast-context";
import "./toast.css";

export type ToastProps = {
  message: string;
  onClose: () => void;
};

type ToastProviderProps = {
  children: React.ReactElement;
};

type ToastType = {
  message: string;
  id: number;
};

const useTimeOut = (callbackFunction: () => void) => {
  const savedCallback = useRef(callbackFunction);
  const hasRun = useRef(false);

  useEffect(() => {
    savedCallback.current = callbackFunction;
  }, [callbackFunction]);

  useEffect(() => {
    const functionId = setTimeout(() => savedCallback.current(), 3000);
    hasRun.current = true;
    return () => clearTimeout(functionId);
  }, []);
};

export const Toast = ({ message, onClose }: ToastProps) => {
  useTimeOut(() => {
    onClose();
  });
  return (
    <div className="min-h-14 bg-white text-left flex items-start content-start text-black rounded-md px-4 py-2 w-72 shadow-lg relative animate-slideIn">
      <div className="flex-1 pr-6">
        {/* <p className="text-lg font-bold">Title</p> */}
        <p className="line-clamp-3 text-sm break-words">{message}</p>
      </div>
      <button
        className="absolute top-2 cursor-pointer text-xl right-2 text-[#ff6740] hover:text-orange-400 transition flex-shrink-0"
        onClick={onClose}
      >
        &times;
      </button>

      <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-200">
        <div className="h-full bg-[#ff6740] animate-toast-progress" />
      </div>
    </div>
  );
};

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<ToastType[]>([]);

  const openToast = (message: string) => {
    const newToast = {
      id: Date.now(),
      message: message,
    };
    setToasts((previousToasts) => [...previousToasts, newToast]);
  };

  const closeToast = (id: number) => {
    setToasts((previousToasts) =>
      previousToasts.filter((toast) => toast.id !== id)
    );
  };

  const contextValue = useMemo(
    () => ({
      onOpen: openToast,
      onClose: closeToast,
    }),
    []
  );
  return (
    <>
      <ToastContext.Provider value={contextValue}>
        {children}
        <div className="fixed top-10 right-10 flex flex-col gap-3 z-50">
          {toasts &&
            toasts.map((toast) => (
              <Toast
                key={toast.id}
                message={toast.message}
                onClose={() => closeToast(toast.id)}
              />
            ))}
        </div>
      </ToastContext.Provider>
    </>
  );
};
