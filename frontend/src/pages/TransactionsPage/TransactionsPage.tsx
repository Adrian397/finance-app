import React, { type ReactElement, useEffect, useMemo, useState } from "react";
import "./TransactionsPage.scss";
import { Input } from "@/components/Input/Input.tsx";
import { Select, type SelectOption } from "@/components/Select/Select.tsx";
import { Pagination } from "@/components/Pagination/Pagination.tsx";
import {
  type GetTransactionsParams,
  type PaginatedTransactionsResponse,
  transactionService,
} from "@/services/transactionService.ts";
import type { ApiServiceError } from "@/utils/apiUtils.ts";
import { useQuery } from "@tanstack/react-query";
import { DotLoader } from "react-spinners";

const sortByOptions: SelectOption[] = [
  { value: "latest", label: "Latest" },
  { value: "oldest", label: "Oldest" },
  { value: "name_asc", label: "A to Z" },
  { value: "name_desc", label: "Z to A" },
  { value: "amount_desc", label: "Highest" },
  { value: "amount_asc", label: "Lowest" },
];

const categoryOptions: SelectOption[] = [
  { value: "", label: "All Transactions" },
  { value: "Entertainment", label: "Entertainment" },
  { value: "Bills", label: "Bills" },
  { value: "Groceries", label: "Groceries" },
  { value: "Dining Out", label: "Dining Out" },
  { value: "Transportation", label: "Transportation" },
  { value: "Personal Care", label: "Personal Care" },
  { value: "Education", label: "Education" },
  { value: "Lifestyle", label: "Lifestyle" },
  { value: "Shopping", label: "Shopping" },
  { value: "General", label: "General" },
];

const ITEMS_PER_PAGE = 10;

const TransactionsPage = (): ReactElement => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState(sortByOptions[0].value as string);
  const [selectedCategory, setSelectedCategory] = useState(
    categoryOptions[0].value as string,
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [sortBy, selectedCategory]);

  const queryParams: GetTransactionsParams = useMemo(
    () => ({
      search:
        debouncedSearchTerm.trim() === ""
          ? undefined
          : debouncedSearchTerm.trim(),
      category: selectedCategory === "" ? undefined : selectedCategory,
      sort_by: sortBy,
      page: currentPage,
      limit: ITEMS_PER_PAGE,
    }),
    [debouncedSearchTerm, selectedCategory, sortBy, currentPage],
  );

  const {
    data: paginatedData,
    isLoading,
    isError,
    error,
    isFetching,
  } = useQuery<PaginatedTransactionsResponse, ApiServiceError>({
    queryKey: ["transactions", queryParams],
    queryFn: () => transactionService.getTransactions(queryParams),
  });

  const transactionsToDisplay = paginatedData?.items || [];
  const paginationInfo = paginatedData?.pagination;

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const isTableFullHeight =
    (isLoading && !paginatedData) ||
    isError ||
    (!isLoading &&
      !isError &&
      transactionsToDisplay.length === 0 &&
      !isFetching);

  return (
    <div className="transactions-page">
      <h1 className="transactions-page__heading text-preset-1">Transactions</h1>
      <div className="transactions-page__container">
        <div className="transactions-page__filters">
          <Input
            type="text"
            placeholder="Search transaction..."
            onChange={(e) => setSearchTerm(e.target.value)}
            name="transactionSearch"
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
            </div>
            <div>
              <span className="text-preset-4">Category</span>
              <Select
                name="category"
                onChange={(newValue) => setSelectedCategory(String(newValue))}
                value={selectedCategory}
                options={categoryOptions}
              />
            </div>
          </div>
        </div>
        <div className="transactions-page__table-wrapper">
          <table
            className="transactions-page__table"
            style={{
              height: isTableFullHeight ? "100%" : "",
            }}
          >
            <thead>
              <tr>
                <th className="text-preset-5">Recipient / Sender</th>
                <th className="text-preset-5">Category</th>
                <th className="text-preset-5">Transaction Date</th>
                <th className="text-preset-5">Amount</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && !paginatedData && (
                <tr className="loading">
                  <td colSpan={4}>
                    <DotLoader color="#201F24" size={50} />
                  </td>
                </tr>
              )}
              {isError && error && (
                <tr className="error">
                  <td colSpan={4} className="text-preset-3">
                    Error fetching transactions: {error.message}
                  </td>
                </tr>
              )}
              {!isLoading &&
                !isError &&
                transactionsToDisplay.length > 0 &&
                transactionsToDisplay.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="recipient-sender">
                      {transaction.avatar && (
                        <img src={transaction.avatar} alt="" />
                      )}
                      <span className="text-preset-4b">{transaction.name}</span>
                    </td>
                    <td className="text-preset-5 category">
                      {transaction.category}
                    </td>
                    <td className="text-preset-5 date">
                      {new Date(transaction.date).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td
                      className={` text-preset-4b
                        ${
                          transaction.type === "income"
                            ? "amount-income"
                            : "amount-expense"
                        } `}
                    >
                      {transaction.amount < 0
                        ? "-"
                        : transaction.type === "income" &&
                            transaction.amount > 0
                          ? "+"
                          : ""}
                      ${Math.abs(transaction.amount).toFixed(2)}
                    </td>
                  </tr>
                ))}
              {!isLoading &&
                !isError &&
                transactionsToDisplay.length === 0 &&
                !isFetching && (
                  <tr>
                    <td
                      colSpan={4}
                      className="no-transactions-message text-preset-3"
                    >
                      No transactions found.
                    </td>
                  </tr>
                )}
            </tbody>
          </table>
        </div>
        {paginationInfo && paginationInfo.totalPages > 1 && (
          <Pagination
            currentPage={paginationInfo.currentPage}
            totalPages={paginationInfo.totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

export default TransactionsPage;
