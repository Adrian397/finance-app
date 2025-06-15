import React, { type ReactElement } from "react";
import { Link } from "react-router-dom";
import { ROUTE_PATHS } from "@/utils/routePaths.ts";
import arrowIcon from "@/assets/images/common/icon-caret-right.svg";
import { useQuery } from "@tanstack/react-query";
import {
  type BillsApiResponse,
  billsService,
} from "@/services/billsService.ts";
import type { ApiServiceError } from "@/utils/apiUtils.ts";
import { ErrorMessage } from "@/components/ErrorMessage/ErrorMessage.tsx";
import { DotLoader } from "react-spinners";
import { EmptyMessage } from "@/components/EmptyMessage/EmptyMessage.tsx";
import { formatCurrency } from "@/utils/general.ts";

export const Bills = (): ReactElement => {
  const { data, isLoading, isError, error } = useQuery<
    BillsApiResponse,
    ApiServiceError
  >({
    queryKey: ["recurringBills"],
    queryFn: () => billsService.getBills({ sort_by: "latest" }),
  });

  const summary = data?.summary;

  return (
    <section className="overview-page__bills">
      <div
        className="overview-page__bills--header"
        style={{
          marginBottom: isLoading || isError ? 0 : "2rem",
        }}
      >
        <h2 className="text-preset-2">Recurring Bills</h2>
        <Link to={ROUTE_PATHS.RECURRING_BILLS} className="btn-tertiary">
          See Details
          <img src={arrowIcon} alt="" />
        </Link>
      </div>
      {isLoading && (
        <div className="loading">
          <DotLoader color="#201F24" size={40} />
        </div>
      )}
      {isError && (
        <ErrorMessage
          message="Error fetching recurring bills"
          error={error?.message || "Unknown error"}
        />
      )}
      {!isLoading &&
        !isError &&
        (summary ? (
          <ul className="overview-page__bills--list">
            <li className="overview-page__bills--list-item">
              <span className="text-preset-4">Paid Bills</span>
              <span className="text-preset-4b">
                {formatCurrency(summary.paidTotal)}
              </span>
            </li>
            <li className="overview-page__bills--list-item">
              <span className="text-preset-4">Total Upcoming</span>
              <span className="text-preset-4b">
                {formatCurrency(summary.upcomingTotal)}
              </span>
            </li>
            <li className="overview-page__bills--list-item">
              <span className="text-preset-4">Due Soon</span>
              <span className="text-preset-4b">
                {formatCurrency(summary.dueSoonTotal)}
              </span>
            </li>
          </ul>
        ) : (
          <EmptyMessage message="You have no recurring bills set up." />
        ))}
    </section>
  );
};
