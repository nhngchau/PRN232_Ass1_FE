"use client";

import { ReactNode, useEffect } from "react";
import { XIcon } from "./Icons";

export function Modal({
  title,
  open,
  onClose,
  children
}: {
  title: string;
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/35 p-4 backdrop-blur-xs transition-opacity animate-in fade-in duration-150">
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
      />
      <div className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-xl border border-theme-border bg-white p-5 sm:p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between border-b border-theme-border/70 pb-3">
          <h2 className="text-lg font-bold tracking-tight text-theme-text">{title}</h2>
          <button 
            type="button" 
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-lg p-1.5 text-theme-muted transition-colors hover:bg-slate-100 hover:text-theme-text focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <XIcon className="h-5 w-5 shrink-0" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
