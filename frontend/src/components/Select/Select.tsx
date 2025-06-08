import React, {
  type KeyboardEvent,
  type ReactElement,
  useEffect,
  useRef,
  useState,
} from "react";
import "./Select.scss";
import arrowIcon from "@/assets/images/common/icon-caret-down.svg";

export type SelectOption = {
  value: string | number;
  label: string;
  disabled?: boolean;
};

type Props = {
  label?: string;
  name?: string;
  id?: string;
  options: SelectOption[];
  value?: string | number | null;
  onChange: (selectedValue: string | number | undefined) => void;
  placeholder?: string;
  helper?: string;
  error?: string | null | boolean;
  showColorThemes?: boolean;
};

export const Select = ({
  label,
  id,
  value,
  onChange,
  options,
  helper,
  error,
  showColorThemes,
}: Props): ReactElement => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((option) => option.value === value);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (optionValue: string | number) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const handleKeyDownControl = (event: KeyboardEvent<HTMLButtonElement>) => {
    switch (event.key) {
      case "Enter":
      case " ":
        event.preventDefault();
        toggleDropdown();
        break;
      case "Escape":
        if (isOpen) setIsOpen(false);
        break;
      case "ArrowDown":
        event.preventDefault();
        if (!isOpen) setIsOpen(true);
        break;
    }
  };

  const handleOptionKeyDown = (
    event: KeyboardEvent<HTMLLIElement>,
    optionValue: string | number,
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleOptionClick(optionValue);
    } else if (event.key === "Escape") {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="select-group" ref={selectRef}>
      {label && (
        <label
          className={`text-preset-5b ${error ? "error" : ""}`}
          htmlFor={id}
        >
          {label}
        </label>
      )}
      <div className={`dropdown-wrapper ${isOpen ? "is-open" : ""}`}>
        <button
          type="button"
          id={id}
          className={`select-group__control text-preset-4 ${showColorThemes && selectedOption ? "theme-color" : ""} ${error ? "error" : ""}`}
          onClick={toggleDropdown}
          onKeyDown={handleKeyDownControl}
        >
          <div>
            {showColorThemes && selectedOption && (
              <div
                className="theme-color"
                style={{ backgroundColor: String(selectedOption.value) }}
              ></div>
            )}
            <span className="select-group__control-label text-preset-4">
              {selectedOption ? selectedOption.label : ""}
            </span>
          </div>
          <img
            src={arrowIcon}
            className={`select-group__control-arrow ${isOpen ? "open" : ""}`}
            alt=""
          />
        </button>
        {isOpen && (
          <ul className="dropdown-options-list">
            {options.map((option) => (
              <li
                key={option.value}
                className={`dropdown-options-item  text-preset-4 ${showColorThemes && option.value ? "theme-color" : ""} ${option.disabled ? "disabled" : ""}`}
                onClick={() => handleOptionClick(option.value)}
                onKeyDown={(e) => handleOptionKeyDown(e, option.value)}
                role="option"
                aria-selected={option.value === value}
                tabIndex={0}
              >
                <div>
                  {showColorThemes && (
                    <div
                      className="theme-color"
                      style={{ backgroundColor: String(option.value) }}
                    ></div>
                  )}
                  {option.label}
                </div>
                {option.disabled && (
                  <span className="text-preset-5 used-badge">Already Used</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
      {helper && <p className="text-preset-5 select-group__helper">{helper}</p>}
    </div>
  );
};
