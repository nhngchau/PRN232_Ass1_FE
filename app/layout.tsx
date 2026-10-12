import type { Metadata } from "next";
import { Shell } from "@/components/layout/Shell";
import { ToastProvider } from "@/components/ui/Toast";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { AppStartupLoader } from "@/components/ui/AppStartupLoader";
import "./globals.css";

export const metadata: Metadata = {
  title: "TaskTrack",
  description: "PRN232 task and team management app"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="bg-slate-50">
      <body className="font-sans antialiased bg-background">
        <ToastProvider>
          <AuthProvider>
            <AppStartupLoader />
            <Shell>{children}</Shell>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
