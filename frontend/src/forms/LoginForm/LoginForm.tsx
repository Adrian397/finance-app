import React, { type ReactElement, useState } from "react";
import { Input } from "@/components/Input/Input";
import { useMutation } from "@tanstack/react-query";
import {
  authService,
  type LoginApiResponse,
  type UserLoginCredentials,
} from "@/services/authService.ts";
import type { ApiServiceError } from "@/utils/apiUtils.ts";
import { useAuthStore } from "@/stores/authStore.ts";

type Props = {
  onModeChange: () => void;
};

export const LoginForm = ({ onModeChange }: Props): ReactElement => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const setToken = useAuthStore((state) => state.setToken);

  const loginMutation = useMutation<
    LoginApiResponse,
    ApiServiceError,
    UserLoginCredentials
  >({
    mutationKey: ["loginUser"],
    mutationFn: authService.login,
    onSuccess: (data) => {
      console.log("Login successful! Token:", data.token);
      setToken(data.token);
    },
    onError: (error) => {
      console.error("Login failed:", error.message, error.status, error.data);
      alert(`Login Failed: ${error.message}`);
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    loginMutation.mutate({ email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h1 className="text-preset-1">Login</h1>
      {loginMutation.isError && (
        <p style={{ color: "red" }}>Error: {loginMutation.error?.message}</p>
      )}
      <div className="auth-form__inputs">
        <Input
          type="email"
          name="email"
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          name="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button
        type="submit"
        className="btn btn-primary auth-form__submit"
        disabled={loginMutation.isPending}
      >
        {loginMutation.isPending ? "Logging in..." : "Login"}
      </button>
      <p className="text-preset-4 auth-form__option">
        Need to create an account?
        <button type="button" className="text-preset-4b" onClick={onModeChange}>
          Sign Up
        </button>
      </p>
    </form>
  );
};
