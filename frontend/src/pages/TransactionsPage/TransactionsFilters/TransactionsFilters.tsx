import React, { type ReactElement, useEffect, useRef, useState } from "react";
import { Input } from "@/components/Input/Input.tsx";
import { Select, type SelectOption } from "@/components/Select/Select.tsx";
import sortIcon from "@/assets/images/pages/transactions/icon-sort-mobile.svg";
import filterIcon from "@/assets/images/pages/transactions/icon-filter-mobile.svg";

type Props = {
  setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
  setSortBy: React.Dispatch<React.SetStateAction<string>>;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  searchTerm: string;
  sortBy: string;
  selectedCategory: string;
  sortByOptions: SelectOption[];
  categoryOptions: SelectOption[];
};

export const TransactionsFilters = ({
  setSelectedCategory,
  setSortBy,
  setSearchTerm,
  searchTerm,
  sortBy,
  selectedCategory,
  sortByOptions,
  categoryOptions,
}: Props): ReactElement => {
  const mobileSortFilterRef = useRef<HTMLDivElement>(null);
  const mobileCategoryFilterRef = useRef<HTMLDivElement>(null);

  const [isMobileSortDropdownOpen, setIsMobileSortDropdownOpen] =
    useState(false);
  const [isMobileCategoryDropdownOpen, setIsMobileCategoryDropdownOpen] =
    useState(false);

  useEffect(() => {
    if (!isMobileSortDropdownOpen && !isMobileCategoryDropdownOpen) {
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
      if (
        isMobileCategoryDropdownOpen &&
        mobileCategoryFilterRef.current &&
        !mobileCategoryFilterRef.current.contains(event.target as Node)
      ) {
        setIsMobileCategoryDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileSortDropdownOpen, isMobileCategoryDropdownOpen]);

  return (
    <div className="transactions-page__filters">
      <Input
        type="text"
        placeholder="Search transactions..."
        onChange={(e) => setSearchTerm(e.target.value)}
        name="search-transactions"
        value={searchTerm}
        showSearchIcon
      />
      <div className="transactions-page__filters--selects">
        <div>
          <span className="text-preset-4">Sort by</span>
          <Select
            name="sortby"
            onChange={(newValue) => setSortBy(String(newValue))}
            value={sortBy}
            options={sortByOptions}
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
                setIsMobileCategoryDropdownOpen(false);
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
        <div>
          <span className="text-preset-4">Category</span>
          <Select
            name="category"
            onChange={(newValue) => setSelectedCategory(String(newValue))}
            value={selectedCategory}
            options={categoryOptions}
          />
          <div
            className="mobile-filter mobile-category dropdown-wrapper"
            ref={mobileCategoryFilterRef}
          >
            <button
              type="button"
              className="mobile-filter__button"
              onClick={() => {
                setIsMobileCategoryDropdownOpen(!isMobileCategoryDropdownOpen);
                setIsMobileSortDropdownOpen(false);
              }}
              aria-haspopup="listbox"
              aria-expanded={isMobileCategoryDropdownOpen}
            >
              <img src={filterIcon} alt="" />
            </button>
            {isMobileCategoryDropdownOpen && (
              <ul className="dropdown-options-list" role="listbox">
                {categoryOptions.map((option) => (
                  <li
                    key={option.value}
                    className="dropdown-options-item text-preset-4"
                    onClick={() => {
                      setSelectedCategory(String(option.value));
                      setIsMobileCategoryDropdownOpen(false);
                    }}
                    role="option"
                    aria-selected={option.value === selectedCategory}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        setSelectedCategory(String(option.value));
                        setIsMobileCategoryDropdownOpen(false);
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
    </div>
  );
};
