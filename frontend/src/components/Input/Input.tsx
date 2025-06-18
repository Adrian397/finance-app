import { type ChangeEvent, type ReactElement, useState } from "react";
import "./Input.scss";
import showIcon from "@/assets/images/auth/icon-show-password.svg";
import hideIcon from "@/assets/images/auth/icon-hide-password.svg";
import searchIcon from "@/assets/images/common/icon-search.svg";
import dollarIcon from "@/assets/images/common/icon-dollar.svg";

type Props = {
  type: "text" | "email" | "password" | "number";
  name: string;
  label?: string;
  id?: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  helper?: string;
  placeholder?: string;
  error?: string | null | boolean;
  showDollarIcon?: boolean;
  showSearchIcon?: boolean;
  disabled?: boolean;
};

export const Input = ({
  type,
  name,
  id,
  label,
  value,
  helper,
  onChange,
  placeholder,
  error,
  disabled,
  showSearchIcon,
  showDollarIcon,
}: Props): ReactElement => {
  const [visible, setVisible] = useState(false);
  const isPassword = type === "password";
  const hasError = !!error;
  const togglePasswordVisibility = () => {
    setVisible((v) => !v);
  };

  return (
    <div className="input-group">
      {label && (
        <label
          className={`text-preset-5b ${error ? "input-error" : ""}`}
          htmlFor={id}
        >
          {label}
        </label>
      )}
      <div className="input-group__wrapper">
        {showDollarIcon && (
          <img
            className="input-group__wrapper--prefix"
            src={dollarIcon}
            alt=""
          />
        )}
        <input
          type={isPassword ? (visible ? "text" : "password") : type}
          name={name}
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`input-group__wrapper--control text-preset-4 ${isPassword || showSearchIcon ? "is-suffix" : ""} ${showDollarIcon ? "is-prefix" : ""} ${hasError ? "input-error" : ""}`}
          aria-invalid={hasError}
          disabled={disabled}
          autoComplete="off"
        />
        {isPassword && (
          <button
            type="button"
            className="input-group__wrapper--suffix password"
            onClick={togglePasswordVisibility}
            aria-label={visible ? "Hide password" : "Show password"}
          >
            <img src={visible ? hideIcon : showIcon} alt="" />
          </button>
        )}
        {showSearchIcon && (
          <img
            className="input-group__wrapper--suffix"
            src={searchIcon}
            alt=""
          />
        )}
      </div>
      {helper && <p className="text-preset-5 input-group__helper">{helper}</p>}
    </div>
  );
};
