import React, { type ReactElement } from "react";
import paidIcon from "@/assets/images/pages/bills/icon-bill-paid.svg";
import dueIcon from "@/assets/images/pages/bills/icon-bill-due.svg";
import type { Bill } from "@/services/billsService.ts";
import { getDaySuffix } from "@/utils/general.ts";
import { DotLoader } from "react-spinners";
import type { ApiServiceError } from "@/utils/apiUtils.ts";

type Props = {
  billsToDisplay: Bill[];
  isLoading: boolean;
  isError: boolean;
  error: ApiServiceError | null;
};

export const BillsTable = ({
  billsToDisplay,
  isLoading,
  isError,
  error,
}: Props): ReactElement => {
  const isTableFullHeight = isLoading || isError || billsToDisplay.length === 0;

  return (
    <div className="bills-page__table-wrapper">
      <table
        className="table"
        style={{
          height: isTableFullHeight ? "100%" : "",
        }}
      >
        <thead>
          <tr>
            <th className="text-preset-5">Bill Title</th>
            <th className="text-preset-5">Due Date</th>
            <th className="text-preset-5">Amount</th>
          </tr>
        </thead>
        <tbody>
          {isLoading && (
            <tr className="loading">
              <td colSpan={3}>
                <DotLoader color="#201F24" size={50} />
              </td>
            </tr>
          )}
          {isError && error && (
            <tr className="error-desktop">
              <td colSpan={3} className="text-preset-3">
                Error fetching bills: {error.message}
              </td>
            </tr>
          )}
          {billsToDisplay.map((bill, index) => (
            <tr key={index}>
              <td className="bill-title">
                {bill.avatar && <img src={bill.avatar} alt={bill.name} />}
                <span className="text-preset-4b">{bill.name}</span>
              </td>
              <td
                className={`due-date ${bill.status === "paid" ? "paid" : ""}`}
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
              </td>
              <td
                className={`amount ${bill.isDueSoon && bill.status !== "paid" ? "upcomming" : ""} text-preset-4b`}
              >
                ${bill.amount.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
