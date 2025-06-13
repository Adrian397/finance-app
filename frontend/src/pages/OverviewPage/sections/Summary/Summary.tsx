import React, { type ReactElement } from "react";
import { authService, type UserSummary } from "@/services/authService.ts";
import { useQuery } from "@tanstack/react-query";
import type { ApiServiceError } from "@/utils/apiUtils.ts";
import { DotLoader } from "react-spinners";
import { ErrorMessage } from "@/components/ErrorMessage/ErrorMessage.tsx";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
};

export const Summary = (): ReactElement => {
  const { data, isLoading, isError, error } = useQuery<
    UserSummary,
    ApiServiceError
  >({
    queryKey: ["userSummary"],
    queryFn: authService.getUserSummary,
  });

  const balance = data?.currentBalance ?? 0;
  const income = data?.income ?? 0;
  const expenses = data?.expenses ?? 0;

  if (isError) {
    return (
      <div className="overview-page__summary">
        <ErrorMessage
          message="Could not load summary data"
          error={error?.message || "Unknown error"}
        />
      </div>
    );
  }

  return (
    <section className="overview-page__summary">
      <div className="overview-page__summary--balance">
        <h2 className="text-preset-4">Current Balance</h2>
        {isLoading ? (
          <div className="loading">
            <DotLoader color="#fff" size={32} />
          </div>
        ) : (
          <p className="text-preset-1">{formatCurrency(balance)}</p>
        )}
      </div>
      <div className="overview-page__summary--income">
        <h2 className="text-preset-4">Income</h2>
        {isLoading ? (
          <div className="loading">
            <DotLoader color="#000" size={32} />
          </div>
        ) : (
          <p className="text-preset-1">{formatCurrency(income)}</p>
        )}
      </div>
      <div className="overview-page__summary--expenses">
        <h2 className="text-preset-4">Expenses</h2>
        {isLoading ? (
          <div className="loading">
            <DotLoader color="#000" size={32} />
          </div>
        ) : (
          <p className="text-preset-1">{formatCurrency(expenses)}</p>
        )}
      </div>
    </section>
  );
};
