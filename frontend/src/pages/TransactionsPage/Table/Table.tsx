import React, { type ReactElement } from "react";
import { DotLoader } from "react-spinners";
import type { PaginatedTransactionsResponse } from "@/services/transactionService.ts";
import type { ApiServiceError } from "@/utils/apiUtils.ts";

type Props = {
  isLoading: boolean;
  isFetching: boolean;
  paginatedData: PaginatedTransactionsResponse | undefined;
  isError: boolean;
  error: ApiServiceError | null;
};

export const Table = ({
  isLoading,
  isError,
  paginatedData,
  isFetching,
  error,
}: Props): ReactElement => {
  const transactionsToDisplay = paginatedData?.items || [];

  const isTableFullHeight =
    (isLoading && !paginatedData) ||
    isError ||
    (!isLoading &&
      !isError &&
      transactionsToDisplay.length === 0 &&
      !isFetching);

  return (
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
                    : transaction.type === "income" && transaction.amount > 0
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
  );
};
