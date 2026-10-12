export interface Account {
  accountId: number;
  fullName: string;
  email: string;
  role: number; // 0 = Staff, 1 = Admin
  createdDate?: string;
}

export interface LoginResponse {
  token: string;
  accessToken?: string;
  expiresAt: string;
  accessTokenExpiry?: string;
  refreshToken: string;
  account: Account;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}
