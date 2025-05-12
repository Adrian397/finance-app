import { type ReactElement, useState } from "react";
import { Input } from "@/components/Input/Input";
import { useMutation } from "@tanstack/react-query";
import {
  authService,
  type SignupApiResponse,
  type UserSignupData,
} from "@/services/authService.ts";
import type { ApiServiceError } from "@/utils/apiUtils.ts";

type Props = {
  onModeChange: () => void;
};

export const SignupForm = ({ onModeChange }: Props): ReactElement => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signupMutation = useMutation<
    SignupApiResponse,
    ApiServiceError,
    UserSignupData
  >({
    mutationKey: ["signupUser"],
    mutationFn: authService.signup,
    onSuccess: (data) => {
      console.log("Signup successful!", data.message, data.user);
      alert(data.message + " Please log in.");
      onModeChange();
    },
    onError: (error) => {
      console.error(
        "Signup failed (React Query):",
        error.message,
        error.status,
        error.data,
      );
      alert(`Signup Failed: ${error.message}`);
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    signupMutation.mutate({ name, email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h1 className="text-preset-1">Sign Up</h1>
      {signupMutation.isError && (
        <p style={{ color: "red" }}>Error: {signupMutation.error?.message}</p>
      )}
      <div className="auth-form__inputs">
        <Input
          type="text"
          name="name"
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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
          label="Create Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          helper="Passwords must be at least 8 characters"
        />
      </div>
      <button
        type="submit"
        className="btn btn-primary auth-form__submit"
        disabled={signupMutation.isPending}
      >
        {signupMutation.isPending ? "Creating Account..." : "Create Account"}
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
