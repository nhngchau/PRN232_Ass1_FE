"use client";

import { ReactNode } from "react";
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
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm transition-opacity">
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-auto rounded-2xl bg-surface p-6 shadow-2xl md:p-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-theme-text">{title}</h2>
          <button 
            type="button" 
            onClick={onClose}
            className="rounded-full p-2 text-theme-muted transition-colors hover:bg-slate-100 hover:text-theme-text"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
