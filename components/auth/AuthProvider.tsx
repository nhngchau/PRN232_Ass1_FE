"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Account } from "@/lib/auth/types";
import { usePathname, useRouter } from "next/navigation";
import { useToast } from "@/components/ui/Toast";
import { clearAuthSession, revokeStoredRefreshToken, saveAccountSession, saveAuthSession } from "@/lib/api";
import { LoginResponse } from "@/lib/auth/types";

interface AuthContextType {
  account: Account | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isInitialized: boolean;
  isManualLogoutInProgress: boolean;
  login: (response: LoginResponse) => void;
  updateAccount: (account: Account) => void;
  logout: (redirectTo?: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<Account | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isManualLogoutInProgress, setIsManualLogoutInProgress] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const addToast = useToast();

  useEffect(() => {
    // Restore session
    const storedToken = localStorage.getItem("token");
    const storedAccountStr = localStorage.getItem("account");
    
    if (storedToken && storedAccountStr) {
      try {
        const storedAccount = JSON.parse(storedAccountStr);
        setToken(storedToken);
        setAccount(storedAccount);
      } catch (e) {
        clearAuthSession();
      }
    }
    setIsInitialized(true);
  }, []);

  const syncFromStorage = () => {
    const storedToken = localStorage.getItem("token");
    const storedAccountStr = localStorage.getItem("account");
    setToken(storedToken);
    setAccount(storedAccountStr ? JSON.parse(storedAccountStr) : null);
  };

  const logout = async (redirectTo: string = "/") => {
    const isManualLogout = redirectTo === "/";
    setIsManualLogoutInProgress(isManualLogout);
    await revokeStoredRefreshToken();
    clearAuthSession();
    setToken(null);
    setAccount(null);
    router.push(redirectTo);
  };

  useEffect(() => {
    if (isManualLogoutInProgress && pathname === "/") {
      setIsManualLogoutInProgress(false);
    }
  }, [isManualLogoutInProgress, pathname]);

  useEffect(() => {
    const handle401 = () => {
      addToast("error", "Session expired. Please log in again.");
      logout("/login");
    };
    const handleAuthUpdated = () => syncFromStorage();
    
    window.addEventListener("auth:401", handle401);
    window.addEventListener("auth:updated", handleAuthUpdated);
    return () => {
      window.removeEventListener("auth:401", handle401);
      window.removeEventListener("auth:updated", handleAuthUpdated);
    };
  }, [addToast, router]);

  const login = (response: LoginResponse) => {
    saveAuthSession(response);
    setToken(response.accessToken ?? response.token);
    setAccount(response.account);
  };

  const updateAccount = (newAccount: Account) => {
    saveAccountSession(newAccount);
    setAccount(newAccount);
  };

  const isAdmin = account?.role === 1;

  return (
    <AuthContext.Provider
      value={{
        account,
        token,
        isAuthenticated: !!token,
        isAdmin,
        isInitialized,
        isManualLogoutInProgress,
        login,
        updateAccount,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
