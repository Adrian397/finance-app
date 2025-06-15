import React, { type ReactElement } from "react";
import billsIcon from "@/assets/images/pages/bills/icon-recurring-bills.svg";
import type { BillsSummary } from "@/services/billsService.ts";
import type { ApiServiceError } from "@/utils/apiUtils.ts";
import { ErrorMessage } from "@/components/ErrorMessage/ErrorMessage.tsx";
import { DotLoader } from "react-spinners";
import { formatCurrency } from "@/utils/general.ts";

type Props = {
  summary: BillsSummary | undefined;
  isLoading: boolean;
  error: ApiServiceError | null;
  isError: boolean;
};

export const BillsOverview = ({
  summary,
  error,
  isError,
  isLoading,
}: Props): ReactElement => {
  const paidText = `${summary?.paidCount ?? 0} (${formatCurrency(summary?.paidTotal ?? 0)})`;
  const upcomingText = `${summary?.upcomingCount ?? 0} (${formatCurrency(summary?.upcomingTotal ?? 0)})`;
  const dueSoonText = `${summary?.dueSoonCount ?? 0} (${formatCurrency(summary?.dueSoonTotal ?? 0)})`;

  if (isError) {
    return (
      <div className="bills-page__overview">
        <ErrorMessage
          message="Error fetching summary"
          error={error?.message || "Unknown error"}
        />
      </div>
    );
  }

  return (
    <div className="bills-page__overview">
      <div className="bills-page__total-bills">
        <img src={billsIcon} alt="" />
        <div>
          <h2
            className="text-preset-4"
            style={{ marginBottom: isLoading ? 0 : "1.25rem" }}
          >
            Total Bills
          </h2>
          {isLoading && !summary ? (
            <div className="loading">
              <DotLoader color="#fff" size={30} />
            </div>
          ) : (
            <p className="text-preset-1">
              {summary && formatCurrency(summary.totalBills)}
            </p>
          )}
        </div>
      </div>
      <div className="bills-page__summary">
        <h2 className="text-preset-3">Summary</h2>
        {isLoading && !summary ? (
          <div className="loading">
            <DotLoader color="#201F24" size={30} />
          </div>
        ) : (
          <ul>
            <li>
              <span className="text-preset-5">Paid Bills</span>
              <span className="text-preset-5b">{paidText}</span>
            </li>
            <li>
              <span className="text-preset-5">Total Upcoming</span>
              <span className="text-preset-5b">{upcomingText}</span>
            </li>
            <li>
              <span className="text-preset-5">Due Soon</span>
              <span className="text-preset-5b">{dueSoonText}</span>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};
