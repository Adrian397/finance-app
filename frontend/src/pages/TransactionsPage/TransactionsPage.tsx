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
import { TransactionsTable } from "@/pages/TransactionsPage/TransactionsTable/TransactionsTable.tsx";
import { TransactionsFilters } from "@/pages/TransactionsPage/TransactionsFilters/TransactionsFilters.tsx";
import { TransactionsMobileView } from "@/pages/TransactionsPage/TransactionsMobileView/TransactionsMobileView.tsx";
import { categoryOptions, sortByOptions } from "@/utils/general.ts";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "@/hooks/useDebounce.ts";

const ITEMS_PER_PAGE = 10;
const TRANSACTIONS_MOBILE_BREAKPOINT = 768;

const TransactionsPage = (): ReactElement => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "";

  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState(sortByOptions[0].value as string);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

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
    setCurrentPage(1);
  }, [debouncedSearchTerm, sortBy, selectedCategory]);

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
        <TransactionsFilters
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
          <TransactionsMobileView {...viewProps} />
        ) : (
          <TransactionsTable {...viewProps} />
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
