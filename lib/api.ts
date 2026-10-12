import { joinUrl } from "./utils";
import { Account, LoginResponse } from "./auth/types";

const API_URL = normalizeApiBaseUrl(process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000");
const TOKEN_KEY = "token";
const REFRESH_TOKEN_KEY = "refreshToken";
const ACCOUNT_KEY = "account";
const ACCESS_TOKEN_EXPIRY_KEY = "accessTokenExpiry";
let refreshPromise: Promise<boolean> | null = null;

export class ApiClientError extends Error {
  errors?: Record<string, string[]>;
  status: number;

  constructor(message: string, status: number, errors?: Record<string, string[]>) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

async function request<T>(path: string, options: RequestInit = {}, retryOnUnauthorized = true): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> ?? {})
  };

  if (typeof window !== "undefined") {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token && !isAuthMutation(path)) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const response = await fetch(joinUrl(API_URL, ensureApiPath(path)), {
    ...options,
    headers,
    cache: "no-store"
  });

  if (response.status === 401 && typeof window !== "undefined") {
    const refreshed = retryOnUnauthorized && shouldAttemptRefresh(path)
      ? await refreshAccessToken()
      : false;

    if (refreshed) {
      return request<T>(path, options, false);
    }

    clearAuthSession();
    window.dispatchEvent(new Event("auth:401"));
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new ApiClientError(data?.message ?? "Request failed.", response.status, data?.errors);
  }

  return data as T;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) => request<T>(path, { method: "POST", body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) => request<T>(path, { method: "PUT", body: JSON.stringify(body) }),
  delete: (path: string) => request<void>(path, { method: "DELETE" })
};

export function saveAuthSession(response: LoginResponse) {
  const accessToken = response.accessToken ?? response.token;
  const accessTokenExpiry = response.accessTokenExpiry ?? response.expiresAt;
  localStorage.setItem(TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, response.refreshToken);
  localStorage.setItem(ACCESS_TOKEN_EXPIRY_KEY, accessTokenExpiry);
  localStorage.setItem(ACCOUNT_KEY, JSON.stringify(response.account));
  window.dispatchEvent(new Event("auth:updated"));
}

export function saveAccountSession(account: Account) {
  localStorage.setItem(ACCOUNT_KEY, JSON.stringify(account));
  window.dispatchEvent(new Event("auth:updated"));
}

export function clearAuthSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(ACCESS_TOKEN_EXPIRY_KEY);
  localStorage.removeItem(ACCOUNT_KEY);
}

export async function revokeStoredRefreshToken() {
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  if (!refreshToken) return;

  await fetch(joinUrl(API_URL, "/api/auth/logout"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
    cache: "no-store"
  }).catch(() => undefined);
}

function normalizeApiBaseUrl(baseUrl: string) {
  return baseUrl.trim().replace(/\/+$/, "").replace(/\/api$/i, "");
}

function ensureApiPath(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return normalizedPath.startsWith("/api/") || normalizedPath === "/api"
    ? normalizedPath
    : `/api${normalizedPath}`;
}

function isAuthMutation(path: string) {
  const normalizedPath = ensureApiPath(path).toLowerCase();
  return normalizedPath === "/api/auth/login"
    || normalizedPath === "/api/auth/register"
    || normalizedPath === "/api/auth/refresh"
    || normalizedPath === "/api/auth/logout";
}

function shouldAttemptRefresh(path: string) {
  const normalizedPath = ensureApiPath(path).toLowerCase();
  return normalizedPath !== "/api/auth/login"
    && normalizedPath !== "/api/auth/register"
    && normalizedPath !== "/api/auth/refresh";
}

async function refreshAccessToken() {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = refreshAccessTokenInternal().finally(() => {
    refreshPromise = null;
  });

  return refreshPromise;
}

async function refreshAccessTokenInternal() {
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  if (!refreshToken) {
    return false;
  }

  const response = await fetch(joinUrl(API_URL, "/api/auth/refresh"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
    cache: "no-store"
  });

  if (!response.ok) {
    clearAuthSession();
    return false;
  }

  const data = await response.json() as LoginResponse;
  saveAuthSession(data);
  return true;
}
