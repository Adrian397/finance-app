import React, { type ReactElement } from "react";
import paidIcon from "@/assets/images/pages/bills/icon-bill-paid.svg";
import type { Bill } from "@/services/billsService.ts";
import { getDaySuffix } from "@/utils/general.ts";
import dueIcon from "@/assets/images/pages/bills/icon-bill-due.svg";
import type { ApiServiceError } from "@/utils/apiUtils.ts";
import { DotLoader } from "react-spinners";
import { ErrorMessage } from "@/components/ErrorMessage/ErrorMessage.tsx";
import { EmptyMessage } from "@/components/EmptyMessage/EmptyMessage.tsx";

type Props = {
  billsToDisplay: Bill[];
  isLoading: boolean;
  isError: boolean;
  error: ApiServiceError | null;
};
export const BillsTableMobileView = ({
  billsToDisplay,
  isLoading,
  isError,
  error,
}: Props): ReactElement => {
  if (isLoading) {
    return (
      <div className="mobile-loading">
        <DotLoader color="#201F24" size={35} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mobile-error">
        <ErrorMessage
          message="Error fetching bills"
          error={error?.message || "Unknown error"}
        />
      </div>
    );
  }

  if (!isLoading && !isError && billsToDisplay.length === 0) {
    return <EmptyMessage message="No recurring bills found." />;
  }

  return (
    <div className="mobile-bills-list">
      <ul>
        {billsToDisplay.map((bill) => (
          <li key={bill.name} className="mobile-bills-list__item">
            <div className="mobile-bills-list__item--name">
              {bill.avatar && <img src={bill.avatar} alt={bill.name} />}
              <span className="text-preset-4b">{bill.name}</span>
            </div>
            <div
              className={`mobile-bills-list__item--date-amount ${bill.status === "paid" ? "paid" : ""}`}
            >
              <div>
                <span className="text-preset-5">
                  Monthly - {bill.dueDateDay}
                  {getDaySuffix(bill.dueDateDay)}
                </span>
                {bill.status === "paid" && <img src={paidIcon} alt="Paid" />}
                {bill.isDueSoon && bill.status !== "paid" && (
                  <img src={dueIcon} alt="Due Soon" />
                )}
              </div>
              <span
                className={`mobile-bills__item--amount text-preset-4b ${bill.isDueSoon && bill.status !== "paid" ? "upcomming" : ""}`}
              >
                ${bill.amount.toFixed(2)}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
