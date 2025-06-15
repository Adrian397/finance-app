import React, { type ReactElement } from "react";
import type { PaginatedTransactionsResponse } from "@/services/transactionService.ts";
import type { ApiServiceError } from "@/utils/apiUtils.ts";
import { DotLoader } from "react-spinners";
import { ErrorMessage } from "@/components/ErrorMessage/ErrorMessage.tsx";
import { EmptyMessage } from "@/components/EmptyMessage/EmptyMessage.tsx";

type Props = {
  isLoading: boolean;
  isFetching: boolean;
  paginatedData: PaginatedTransactionsResponse | undefined;
  isError: boolean;
  error: ApiServiceError | null;
};

export const TransactionsMobileView = ({
  isLoading,
  isError,
  paginatedData,
  isFetching,
  error,
}: Props): ReactElement => {
  const transactionsToDisplay = paginatedData?.items || [];

  if (isLoading && !paginatedData) {
    return (
      <div className="mobile-view__status mobile-view__status--loading">
        <DotLoader color="#201F24" size={35} />
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorMessage
        message="Error fetching transactions"
        error={error?.message || "Unknown error"}
      />
    );
  }

  if (
    !isLoading &&
    !isError &&
    transactionsToDisplay.length === 0 &&
    !isFetching
  ) {
    return <EmptyMessage message="No transactions found." />;
  }

  return (
    <div className="mobile-transactions-list">
      <ul>
        {transactionsToDisplay.map((transaction) => (
          <li key={transaction.id} className="mobile-transaction-item">
            <div className="mobile-transaction-item__details">
              {transaction.avatar && (
                <img
                  src={transaction.avatar}
                  alt=""
                  className="mobile-transaction-item__avatar"
                />
              )}
              <div>
                <span className="mobile-transaction-item__name text-preset-4b">
                  {transaction.name}
                </span>
                <span className="mobile-transaction-item__category text-preset-5">
                  {transaction.category}
                </span>
              </div>
            </div>
            <div className="mobile-transaction-item__amount-details">
              <span
                className={`mobile-transaction-item__amount text-preset-4b ${
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
              <span className="mobile-transaction-item__date text-preset-5">
                {new Date(transaction.date).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
