import React, { type ReactElement, useMemo } from "react";
import { BudgetsChart } from "@/components/BudgetsChart/BudgetsChart.tsx";
import type { BudgetDetails } from "@/services/budgetService.ts";
import { calculateChartData } from "@/utils/budgetUtils.ts";

type Props = {
  budgets: BudgetDetails[];
};

export const SpendingSummary = ({ budgets }: Props): ReactElement => {
  const { totalSpent, totalBudget, chartData } = useMemo(
    () => calculateChartData(budgets),
    [budgets],
  );

  return (
    <div className="budgets-page__main--spending-summary-wrapper">
      <div className="budgets-page__main--chart-container">
        <BudgetsChart
          data={chartData}
          totalSpent={totalSpent}
          totalBudget={totalBudget}
        />
      </div>
      <div className="budgets-page__main--spending-summary">
        <p className="text-preset-2">Spending Summary</p>
        <ul className="spending-summary-list">
          {budgets.map((budget, index) => (
            <li className="spending-summary-item" key={budget.id || index}>
              <div>
                <div
                  className="spending-summary-item__decoration"
                  style={{
                    backgroundColor: budget.theme || "#ccc",
                  }}
                ></div>
                <span className="text-preset-4">{budget.category}</span>
              </div>
              <div>
                <span className="text-preset-3">
                  ${budget.spentAmount.toFixed(2)}
                </span>
                <span className="text-preset-5">
                  of ${budget.maximumAmount.toFixed(2)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
