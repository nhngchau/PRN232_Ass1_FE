"use client";

import { ReactNode, useEffect } from "react";
import { SecondaryButton, Button } from "./Buttons";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: ReactNode;
  isDeleting?: boolean;
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  isDeleting = false,
}: ConfirmDialogProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open && !isDeleting) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, onClose, isDeleting]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div 
        className="fixed inset-0 bg-slate-900/35 backdrop-blur-xs transition-opacity" 
        onClick={() => !isDeleting && onClose()} 
      />
      <div 
        className="relative w-full max-w-md transform rounded-xl bg-white p-5 sm:p-6 text-left align-middle shadow-xl transition-all border border-theme-border flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="flex gap-3.5 items-start">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600 border border-rose-100">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-bold text-theme-text sm:text-lg" id="modal-title">
              {title}
            </h3>
            <div className="mt-1.5 text-xs sm:text-sm text-theme-muted leading-relaxed">
              {description}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2.5 pt-3 border-t border-theme-border/60">
          <SecondaryButton
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="!py-1.5 !px-3.5"
          >
            Cancel
          </SecondaryButton>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="inline-flex items-center justify-center rounded-xl bg-rose-600 px-3.5 py-1.5 text-sm font-medium text-white shadow-xs transition-all hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500/30 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
