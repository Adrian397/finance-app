import { type ChangeEvent, type ReactElement, useState } from "react";
import showIcon from "@/assets/images/auth/icon-show-password.svg";
import hideIcon from "@/assets/images/auth/icon-hide-password.svg";
import "./Input.scss";

type Props = {
  type: "text" | "email" | "password";
  name: string;
  label: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  helper?: string;
  placeholder?: string;
};

export const Input = ({
  type,
  name,
  label,
  value,
  helper,
  onChange,
  placeholder,
}: Props): ReactElement => {
  const [visible, setVisible] = useState(false);
  const isPassword = type === "password";

  const togglePasswordVisibility = () => {
    setVisible((v) => !v);
  };

  return (
    <div className="input-group">
      <label className="text-preset-5b" htmlFor={name}>
        {label}
      </label>
      <div className="input-group__wrapper">
        <input
          type={isPassword ? (visible ? "text" : "password") : type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`input-group__wrapper--control ${isPassword ? "is-password" : ""}`}
        />
        {isPassword && (
          <button
            type="button"
            className="input-group__wrapper--toggle"
            onClick={togglePasswordVisibility}
            aria-label={visible ? "Hide password" : "Show password"}
          >
            <img src={visible ? hideIcon : showIcon} alt="" />
          </button>
        )}
      </div>
      {helper && (
        <p className="text-preset-5 input-group__wrapper--helper">{helper}</p>
      )}
    </div>
  );
};
