import React, { type ReactElement, useEffect, useRef, useState } from "react";
import { Input } from "@/components/Input/Input.tsx";
import { Select } from "@/components/Select/Select.tsx";
import { sortByOptions } from "@/utils/general.ts";
import sortIcon from "@/assets/images/pages/transactions/icon-sort-mobile.svg";

type Props = {
  sortBy: string;
  setSortBy: (value: string) => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
};
export const BillsFilters = ({
  sortBy,
  setSortBy,
  searchTerm,
  setSearchTerm,
}: Props): ReactElement => {
  const [isMobileSortDropdownOpen, setIsMobileSortDropdownOpen] =
    useState(false);
  const mobileSortFilterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isMobileSortDropdownOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMobileSortDropdownOpen &&
        mobileSortFilterRef.current &&
        !mobileSortFilterRef.current.contains(event.target as Node)
      ) {
        setIsMobileSortDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileSortDropdownOpen]);

  return (
    <div className="bills-page__filters">
      <Input
        type="text"
        name="bills-search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search bills..."
        showSearchIcon
      />
      <div className="bills-page__filters--sort-wrapper">
        <span className="text-preset-4">Sort by</span>
        <Select
          name="bills-sortby"
          options={sortByOptions}
          onChange={(newValue) => setSortBy(String(newValue))}
          value={sortBy}
        />
        <div
          className="mobile-filter mobile-sort dropdown-wrapper"
          ref={mobileSortFilterRef}
        >
          <button
            type="button"
            className="mobile-filter__button"
            onClick={() => {
              setIsMobileSortDropdownOpen(!isMobileSortDropdownOpen);
            }}
            aria-haspopup="listbox"
            aria-expanded={isMobileSortDropdownOpen}
          >
            <img src={sortIcon} alt="" />
          </button>
          {isMobileSortDropdownOpen && (
            <ul className="dropdown-options-list" role="listbox">
              {sortByOptions.map((option) => (
                <li
                  key={option.value}
                  className="dropdown-options-item text-preset-4"
                  onClick={() => {
                    setSortBy(String(option.value));
                    setIsMobileSortDropdownOpen(false);
                  }}
                  role="option"
                  aria-selected={option.value === sortBy}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      setSortBy(String(option.value));
                      setIsMobileSortDropdownOpen(false);
                    }
                  }}
                >
                  {option.label}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
