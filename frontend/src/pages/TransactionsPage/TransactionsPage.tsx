import React, { type ReactElement, useEffect, useMemo, useState } from "react";
import "./TransactionsPage.scss";
import { Pagination } from "@/components/Pagination/Pagination.tsx";
import {
  type GetTransactionsParams,
  type PaginatedTransactionsResponse,
  transactionService,
} from "@/services/transactionService.ts";
import type { ApiServiceError } from "@/utils/apiUtils.ts";
import { useQuery } from "@tanstack/react-query";
import { Table } from "@/pages/TransactionsPage/Table/Table.tsx";
import type { SelectOption } from "@/components/Select/Select.tsx";
import { Filters } from "@/pages/TransactionsPage/Filters/Filters.tsx";
import { MobileView } from "@/pages/TransactionsPage/MobileView/MobileView.tsx";

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
const TRANSACTIONS_MOBILE_BREAKPOINT = 768;

const TransactionsPage = (): ReactElement => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState(sortByOptions[0].value as string);
  const [selectedCategory, setSelectedCategory] = useState(
    categoryOptions[0].value as string,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  const [isMobileView, setIsMobileView] = useState(
    window.innerWidth <= TRANSACTIONS_MOBILE_BREAKPOINT,
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= TRANSACTIONS_MOBILE_BREAKPOINT);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  const paginationInfo = paginatedData?.pagination;

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const viewProps = {
    isLoading,
    isFetching,
    paginatedData,
    isError,
    error,
  };

  return (
    <div className="transactions-page">
      <h1 className="transactions-page__heading text-preset-1">Transactions</h1>
      <div className="transactions-page__container">
        <Filters
          sortBy={sortBy}
          searchTerm={searchTerm}
          setSelectedCategory={setSelectedCategory}
          setSortBy={setSortBy}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          sortByOptions={sortByOptions}
          categoryOptions={categoryOptions}
        />
        {isMobileView ? (
          <MobileView {...viewProps} />
        ) : (
          <Table {...viewProps} />
        )}
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
