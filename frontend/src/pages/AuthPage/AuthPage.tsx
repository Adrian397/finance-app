import { type ReactElement, useState } from "react";
import logo from "@/assets/images/common/logo-large.svg";
import "./AuthPage.scss";
import { SignupForm } from "@/forms/SignupForm/SignupForm";
import { LoginForm } from "@/forms/LoginForm/LoginForm";

type Mode = "login" | "signup";

const AuthPage = (): ReactElement => {
  const [mode, setMode] = useState<Mode>("login");

  return (
    <div className="auth-page">
      <div className="auth-page__illustration">
        <img src={logo} alt="logo" />
        <div className="auth-page__illustration--text">
          <h2 className="text-preset-1">
            Keep track of your money and save for your future
          </h2>
          <p className="text-preset-4">
            Personal finance app puts you in control of your spending. Track
            transactions, set budgets, and add to savings pots easily.
          </p>
        </div>
      </div>
      <div className="auth-page__form">
        {mode === "login" ? (
          <LoginForm onModeChange={() => setMode("signup")} />
        ) : (
          <SignupForm onModeChange={() => setMode("login")} />
        )}
      </div>
    </div>
  );
};

export default AuthPage;
