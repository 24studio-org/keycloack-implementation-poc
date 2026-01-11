const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export interface LoginRequest {
  username: string;
  password: string;
  client_id: string;
  grant_type: string;
}

export interface LoginResponse {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  refresh_token: string;
  token_type: string;
  session_state: string;
  scope: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  enabled: boolean;
  firstName: string;
  lastName: string;
  credentials: Array<{
    type: string;
    value: string;
    temporary: boolean;
  }>;
}

export interface RegisterResponse {
  message: string;
  status: number;
  userId: string;
  user: any;
}

export interface ApiError {
  statusCode: number;
  message: string;
  details?: any;
}

class AuthApi {
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/keycloack/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.message || "Login failed");
    }

    return response.json();
  }

  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const response = await fetch(`${API_BASE_URL}/keycloack/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.message || "Registration failed");
    }

    return response.json();
  }
}

export const authApi = new AuthApi();
