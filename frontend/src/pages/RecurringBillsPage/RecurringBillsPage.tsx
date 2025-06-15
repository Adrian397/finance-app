import React, { type ReactElement, useEffect, useMemo, useState } from "react";
import "./RecurringBills.scss";
import { BillsOverview } from "@/pages/RecurringBillsPage/BillsOverview/BillsOverview.tsx";
import { BillsFilters } from "@/pages/RecurringBillsPage/BillsFilters/BillsFilters.tsx";
import { BillsTable } from "@/pages/RecurringBillsPage/BillsTable/BillsTable.tsx";
import { BillsTableMobileView } from "@/pages/RecurringBillsPage/BillsTableMobileView/BillsTableMobileView.tsx";
import { sortByOptions } from "@/utils/general.ts";
import { useDebounce } from "@/hooks/useDebounce.ts";
import { type GetTransactionsParams } from "@/services/transactionService.ts";
import { useQuery } from "@tanstack/react-query";
import {
  type BillsApiResponse,
  billsService,
} from "@/services/billsService.ts";
import type { ApiServiceError } from "@/utils/apiUtils.ts";

const TRANSACTIONS_MOBILE_BREAKPOINT = 768;

const RecurringBillsPage = (): ReactElement => {
  const [sortBy, setSortBy] = useState(sortByOptions[0].value as string);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobileView, setIsMobileView] = useState(
    window.innerWidth <= TRANSACTIONS_MOBILE_BREAKPOINT,
  );

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= TRANSACTIONS_MOBILE_BREAKPOINT);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const queryParams: GetTransactionsParams = useMemo(
    () => ({
      search:
        debouncedSearchTerm.trim() === ""
          ? undefined
          : debouncedSearchTerm.trim(),
      sort_by: sortBy,
    }),
    [debouncedSearchTerm, sortBy],
  );

  const { data, isLoading, isError, error } = useQuery<
    BillsApiResponse,
    ApiServiceError
  >({
    queryKey: ["recurringBills", queryParams],
    queryFn: () => billsService.getBills(queryParams),
  });

  const billsToDisplay = data?.bills || [];
  const summaryToDisplay = data?.summary;

  const viewProps = {
    billsToDisplay,
    isLoading,
    isError,
    error,
  };

  return (
    <div className="bills-page">
      <h1 className="bills-page__heading text-preset-1">Recurring Bills</h1>
      <div className="bills-page__main">
        <BillsOverview
          summary={summaryToDisplay}
          isLoading={isLoading}
          isError={isError}
          error={error}
        />
        <div className="bills-page__list">
          <BillsFilters
            sortBy={sortBy}
            setSortBy={setSortBy}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
          {isMobileView ? (
            <BillsTableMobileView {...viewProps} />
          ) : (
            <BillsTable {...viewProps} />
          )}
        </div>
      </div>
    </div>
  );
};

export default RecurringBillsPage;
