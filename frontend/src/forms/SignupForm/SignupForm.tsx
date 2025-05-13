import React, { type ReactElement, useState } from "react";
import { Input } from "@/components/Input/Input";
import { useMutation } from "@tanstack/react-query";
import {
  authService,
  type SignupApiResponse,
  type UserSignupData,
} from "@/services/authService.ts";
import type { ApiServiceError } from "@/utils/apiUtils.ts";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";

type Props = {
  onModeChange: () => void;
};

export const SignupForm = ({ onModeChange }: Props): ReactElement => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof UserSignupData | "general", string>>
  >({});

  const clearErrors = () => {
    setFieldErrors({});
  };

  const signupMutation = useMutation<
    SignupApiResponse,
    ApiServiceError,
    UserSignupData
  >({
    mutationKey: ["signupUser"],
    mutationFn: authService.signup,
    onSuccess: (data) => {
      toast.success(data.message);
      onModeChange();
      clearErrors();
    },
    onError: (error: ApiServiceError) => {
      const newErrors: Partial<
        Record<keyof UserSignupData | "general", string>
      > = {};
      let hasKnownFieldErrors = false;

      if (error.data && error.data.errors) {
        const knownFields: (keyof UserSignupData)[] = [
          "name",
          "email",
          "password",
        ];
        for (const field of knownFields) {
          if (error.data.errors[field]) {
            const messages = error.data.errors[field];
            newErrors[field] = Array.isArray(messages) ? messages[0] : messages;
            hasKnownFieldErrors = true;
          }
        }
      }

      if (!hasKnownFieldErrors) {
        newErrors.general = error.message || "An unknown error has occurred.";
      }

      setFieldErrors(newErrors);
      toast.error("Signup failed");
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearErrors();
    signupMutation.mutate({ name, email, password });
  };

  const isFormValid =
    name.trim() !== "" && email.trim() !== "" && password.trim() !== "";

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h1 className="text-preset-1">Sign Up</h1>
      <div
        className={`auth-form__inputs ${Object.keys(fieldErrors).length > 0 ? "error" : ""}`}
      >
        <Input
          type="text"
          name="name"
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={fieldErrors.name}
        />
        <Input
          type="email"
          name="email"
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={fieldErrors.email}
        />
        <Input
          type="password"
          name="password"
          label="Create Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          helper="Passwords must be at least 8 characters"
          error={fieldErrors.password}
        />
      </div>
      {Object.keys(fieldErrors).length > 0 && (
        <div className="auth-form__errors-container text-preset-4b">
          {fieldErrors.general && <p>{fieldErrors.general}</p>}
          {Object.entries(fieldErrors).map(([field, message]) => {
            if (!message || field === "general") return null;
            return <p key={field}>{message}</p>;
          })}
        </div>
      )}
      <button
        type="submit"
        className={`btn btn-primary auth-form__submit  ${signupMutation.isPending ? "is-pending" : ""}`}
        disabled={!isFormValid || signupMutation.isPending}
      >
        {signupMutation.isPending ? (
          <ClipLoader
            color={"#ffffff"}
            loading={true}
            size={26}
            aria-label="Creating account..."
          />
        ) : (
          "Create Account"
        )}
      </button>
      <p className="text-preset-4 auth-form__option">
        Already have an account?
        <button type="button" className="text-preset-4b" onClick={onModeChange}>
          Login
        </button>
      </p>
    </form>
  );
};
