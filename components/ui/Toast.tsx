"use client";

import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { XIcon } from "@/components/ui/Icons";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastMessage {
  id: string;
  type: ToastType;
  text: string;
}

interface ToastContextValue {
  addToast: (type: ToastType, text: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((type: ToastType, text: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, text }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none w-full max-w-sm px-4 sm:px-0">
        {toasts.map((toast) => {
          let tone = "";
          let Icon = null;
          if (toast.type === "success") {
            tone = "border-emerald-200 bg-emerald-50 text-emerald-800 shadow-emerald-500/10";
            Icon = (
              <svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            );
          } else if (toast.type === "error") {
            tone = "border-rose-200 bg-rose-50 text-rose-800 shadow-rose-500/10";
            Icon = (
              <svg className="h-5 w-5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            );
          } else if (toast.type === "warning") {
            tone = "border-amber-200 bg-amber-50 text-amber-800 shadow-amber-500/10";
            Icon = (
              <svg className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            );
          } else {
            tone = "border-blue-200 bg-blue-50 text-blue-800 shadow-blue-500/10";
            Icon = (
              <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            );
          }

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto relative flex w-full items-start gap-3 rounded-2xl p-4 shadow-xl border animate-in slide-in-from-top-4 fade-in duration-300 ${tone}`}
            >
              <div className="mt-0.5 shrink-0">{Icon}</div>
              <div className="flex-1 text-sm font-medium leading-relaxed">{toast.text}</div>
              <button
                onClick={() => removeToast(toast.id)}
                className="shrink-0 rounded-lg p-1 opacity-60 hover:bg-black/5 hover:opacity-100 transition-all focus:outline-none focus:ring-2 focus:ring-black/10"
              >
                <XIcon className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context.addToast;
}
