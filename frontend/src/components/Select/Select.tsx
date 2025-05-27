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
  disabled?: boolean;
};

export const Select = ({
  label,
  id,
  value,
  onChange,
  options,
  helper,
  disabled,
}: Props): ReactElement => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((option) => option.value === value);

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleOptionClick = (optionValue: string | number) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const handleKeyDownControl = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;
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
        <label className="text-preset-5b" htmlFor={id}>
          {label}
        </label>
      )}
      <div className={`select-group__wrapper ${isOpen ? "is-open" : ""}`}>
        <button
          type="button"
          id={id}
          className="select-group__control text-preset-4"
          onClick={toggleDropdown}
          onKeyDown={handleKeyDownControl}
        >
          <span className="select-group__control-label">
            {selectedOption ? selectedOption.label : ""}
          </span>
          <img
            src={arrowIcon}
            className={`select-group__control-arrow ${isOpen ? "open" : ""}`}
            alt=""
          />
        </button>
        {isOpen && (
          <ul className="select-group__options-list">
            {options.map((option) => (
              <li
                key={option.value}
                className={`select-group__options-item  text-preset-4 ${option.value === value ? "selected" : ""}`}
                onClick={() => handleOptionClick(option.value)}
                onKeyDown={(e) => handleOptionKeyDown(e, option.value)}
                role="option"
                aria-selected={option.value === value}
                tabIndex={0}
              >
                {option.label}
              </li>
            ))}
          </ul>
        )}
      </div>
      {helper && <p className="text-preset-5 select-group__helper">{helper}</p>}
    </div>
  );
};
