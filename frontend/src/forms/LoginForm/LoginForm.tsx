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
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ROUTE_PATHS } from "@/utils/routePaths.ts";

type Props = {
  onModeChange: () => void;
};

export const LoginForm = ({ onModeChange }: Props): ReactElement => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [generalLoginError, setGeneralLoginError] = useState<string | null>(
    null,
  );

  const navigate = useNavigate();
  const setTokens = useAuthStore((state) => state.setTokens);

  const clearError = () => {
    setGeneralLoginError(null);
  };

  const loginMutation = useMutation<
    LoginApiResponse,
    ApiServiceError,
    UserLoginCredentials
  >({
    mutationKey: ["loginUser"],
    mutationFn: authService.login,
    onSuccess: (data) => {
      toast.success("Login successful!");
      setTokens({
        token: data.token,
        refreshToken: data.refresh_token || undefined,
      });
      clearError();
      navigate(ROUTE_PATHS.OVERVIEW);
    },
    onError: (error) => {
      setGeneralLoginError(
        error.message ||
          "Login failed. Please check your credentials and try again.",
      );
      toast.error("Login failed");
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearError();
    loginMutation.mutate({ email, password });
  };

  const hasErrorForInputs = !!generalLoginError;
  const isFormValid = email.trim() !== "" && password.trim() !== "";

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h1 className="text-preset-1">Login</h1>
      <div className={`auth-form__inputs ${generalLoginError ? "error" : ""}`}>
        <Input
          type="email"
          name="email"
          label="Email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={hasErrorForInputs}
          disabled={loginMutation.isPending}
        />
        <Input
          type="password"
          name="password"
          label="Password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={hasErrorForInputs}
          disabled={loginMutation.isPending}
        />
      </div>
      {generalLoginError && (
        <div className="auth-form__errors-container text-preset-4b">
          <p>{generalLoginError}</p>
        </div>
      )}
      <button
        type="submit"
        className={`btn btn-primary auth-form__submit  ${loginMutation.isPending ? "is-pending" : ""}`}
        disabled={!isFormValid || loginMutation.isPending}
      >
        {loginMutation.isPending ? (
          <ClipLoader
            color={"#ffffff"}
            loading={true}
            size={26}
            aria-label="Loading..."
          />
        ) : (
          "Login"
        )}
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
