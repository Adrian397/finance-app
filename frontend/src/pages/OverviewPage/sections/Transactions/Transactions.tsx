import React, { type ReactElement } from "react";
import { Link } from "react-router-dom";
import { ROUTE_PATHS } from "@/utils/routePaths.ts";
import arrowIcon from "@/assets/images/common/icon-caret-right.svg";
import {
  type GetTransactionsParams,
  type PaginatedTransactionsResponse,
  transactionService,
} from "@/services/transactionService.ts";
import type { ApiServiceError } from "@/utils/apiUtils.ts";
import { useQuery } from "@tanstack/react-query";
import { DotLoader } from "react-spinners";

const ITEMS_TO_SHOW = 4;
export const Transactions = (): ReactElement => {
  const queryParams: GetTransactionsParams = {
    sort_by: "latest",
    page: 1,
    limit: ITEMS_TO_SHOW,
  };

  const {
    data: paginatedData,
    isLoading,
    isError,
    error,
  } = useQuery<PaginatedTransactionsResponse, ApiServiceError>({
    queryKey: ["transactions", "overviewTransactions", queryParams],
    queryFn: () => transactionService.getTransactions(queryParams),
  });

  const transactionsToShow = paginatedData?.items || [];

  const zeroHeaderMargin =
    isLoading ||
    isError ||
    (!isLoading && !isError && transactionsToShow.length === 0);

  return (
    <section className="overview-page__transactions">
      <div
        className="overview-page__transactions--header"
        style={{ marginBottom: zeroHeaderMargin ? 0 : undefined }}
      >
        <h2 className="text-preset-2">Transactions</h2>
        <Link to={ROUTE_PATHS.TRANSACTIONS} className="btn-tertiary">
          View All
          <img src={arrowIcon} alt="View all transactions" />
        </Link>
      </div>
      {isLoading && (
        <div className="loading">
          <DotLoader color="#201F24" size={40} />
        </div>
      )}
      {isError && error && (
        <div className="error text-preset-3">
          <p>Error loading transactions: {error.message}</p>
        </div>
      )}
      {!isLoading && !isError && (
        <ul className="overview-page__transactions--list">
          {transactionsToShow.length > 0 ? (
            transactionsToShow.map((transaction) => (
              <li
                key={transaction.id}
                className="overview-page__transactions--list__item"
              >
                <div className="overview-page__transactions--list__item-avatar">
                  {transaction.avatar && (
                    <img src={transaction.avatar} alt={transaction.name} />
                  )}
                  <span className="text-preset-4b">{transaction.name}</span>
                </div>
                <div className="overview-page__transactions--list__item-transaction">
                  <span
                    className={`text-preset-4b ${
                      transaction.type === "income"
                        ? "amount-income"
                        : "amount-expense"
                    }`}
                  >
                    {transaction.amount < 0
                      ? "-"
                      : transaction.type === "income" && transaction.amount > 0
                        ? "+"
                        : ""}
                    ${Math.abs(transaction.amount).toFixed(2)}
                  </span>
                  <p className="text-preset-5">
                    {new Date(transaction.date).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </li>
            ))
          ) : (
            <div className="no-transactions-message text-preset-3">
              No recent transactions.
            </div>
          )}
        </ul>
      )}
    </section>
  );
};
