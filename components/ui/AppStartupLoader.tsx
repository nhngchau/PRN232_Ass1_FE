"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";

// Module-level guard: ensures the startup loader plays only once on initial session hydration,
// never replaying on in-app route navigations.
let hasStartupFinishedGlobally = false;

export function AppStartupLoader() {
  const { isInitialized } = useAuth();
  const [isExiting, setIsExiting] = useState(false);
  const [isFinished, setIsFinished] = useState(hasStartupFinishedGlobally);

  useEffect(() => {
    if (hasStartupFinishedGlobally) {
      setIsFinished(true);
      return;
    }

    if (isInitialized) {
      // Disappear as soon as initialization is complete with a subtle 200ms fade-out
      setIsExiting(true);
      const timer = setTimeout(() => {
        hasStartupFinishedGlobally = true;
        setIsFinished(true);
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [isInitialized]);

  if (isFinished) {
    return null;
  }

  return (
    <div
      id="tasktrack-startup-loader"
      role="status"
      aria-live="polite"
      aria-label="Loading TaskTrack application"
      className={`fixed inset-0 z-[9999] flex select-none flex-col items-center justify-center bg-slate-50 transition-opacity duration-200 ease-out ${
        isExiting ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center">
        {/* Centered TaskTrack logo */}
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200/90 bg-white p-2.5 shadow-xs">
          <img
            src="/tasktrack-logo.png"
            alt="TaskTrack Logo"
            className="h-9 w-9 object-contain"
            draggable={false}
          />
        </div>

        {/* Brand name */}
        <div className="mt-3.5 flex items-center gap-1.5">
          <span className="text-lg font-bold tracking-tight text-slate-900">
            TaskTrack
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
        </div>

        {/* Small pink spinner and status text */}
        <div className="mt-3 flex items-center gap-2 text-xs font-medium text-slate-500">
          <div
            className="h-4 w-4 shrink-0 rounded-full startup-spinner"
            aria-hidden="true"
          />
          <span>Loading TaskTrack...</span>
        </div>
      </div>
    </div>
  );
}
