import { API_BASE_URL, handleApiResponse } from "@/utils/apiUtils.ts";
import type { AuthUser } from "@/stores/authStore.ts";
import { getAuthToken } from "@/utils/authUtils.ts";

export type UserSignupData = {
  name: string;
  email: string;
  password: string;
};

export type UserLoginCredentials = {
  email: string;
  password: string;
};

export type SignupApiResponse = {
  message: string;
  user?: AuthUser;
};

export type UserSummary = {
  currentBalance: number;
  income: number;
  expenses: number;
};

export type LoginApiResponse = {
  token: string;
  refresh_token?: string;
};

const serviceDef = () => {
  const signup = async (
    userData: UserSignupData,
  ): Promise<SignupApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(userData),
    });

    return handleApiResponse<SignupApiResponse>(response);
  };

  const login = async (
    credentials: UserLoginCredentials,
  ): Promise<LoginApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(credentials),
    });

    return handleApiResponse<LoginApiResponse>(response);
  };

  const getMe = async (token: string): Promise<AuthUser> => {
    if (!token) {
      throw new Error("No token provided for getMe request.");
    }
    const response = await fetch(`${API_BASE_URL}/me`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return handleApiResponse<AuthUser>(response);
  };

  const getUserSummary = async (): Promise<UserSummary> => {
    const token = getAuthToken();

    const response = await fetch(`${API_BASE_URL}/user/summary`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return handleApiResponse<UserSummary>(response);
  };

  return { signup, login, getMe, getUserSummary };
};

export const authService = serviceDef();
