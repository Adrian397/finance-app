import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { ROUTE_PATHS } from "@/utils/routePaths.ts";
import arrowIcon from "@/assets/images/common/icon-caret-right.svg";
import { BudgetsChart } from "@/components/BudgetsChart/BudgetsChart.tsx";
import { type BudgetDetails, budgetService } from "@/services/budgetService.ts";
import { useQuery } from "@tanstack/react-query";
import type { ApiServiceError } from "@/utils/apiUtils.ts";
import { DotLoader } from "react-spinners";
import { calculateChartData } from "@/utils/budgetUtils.ts";

export const Budgets = () => {
  const {
    data: budgetsData,
    isLoading,
    isError,
    error,
  } = useQuery<BudgetDetails[], ApiServiceError>({
    queryKey: ["budgets"],
    queryFn: budgetService.getBudgets,
  });

  const { chartData, totalSpent, totalBudget } = useMemo(
    () => calculateChartData(budgetsData),
    [budgetsData],
  );

  const maxRowsPerColumn = 4;
  const numberOfItems = budgetsData?.length || 0;
  const numberOfColumns = Math.ceil(numberOfItems / maxRowsPerColumn);
  const gridTemplateColumns = `repeat(${numberOfColumns}, 1fr)`;

  return (
    <section className="overview-page__budgets">
      <div className="overview-page__budgets--header">
        <h2 className="text-preset-2">Budgets</h2>
        <Link to={ROUTE_PATHS.BUDGETS} className="btn-tertiary">
          See Details
          <img src={arrowIcon} alt="" />
        </Link>
      </div>
      {isLoading && (
        <div className="loading">
          <DotLoader color="#201F24" size={40} />
        </div>
      )}
      {isError && error && (
        <div className="error text-preset-3">
          <p>Error loading budgets: {error.message}</p>
        </div>
      )}
      {!isLoading &&
        !isError &&
        (budgetsData && budgetsData.length > 0 ? (
          <div className="overview-page__budgets--chart-wrapper">
            <div className="overview-page__budgets--chart-container">
              <BudgetsChart
                data={chartData}
                totalSpent={totalSpent}
                totalBudget={totalBudget}
              />
            </div>
            <div
              className="overview-page__budgets--chart-legend"
              style={{
                gridTemplateColumns,
                gridAutoFlow: "column",
                gridTemplateRows: `repeat(${maxRowsPerColumn}, auto)`,
              }}
            >
              {budgetsData.map((budget, index) => (
                <div
                  className="overview-page__budgets--chart-legend-pot"
                  key={budget.id || index}
                >
                  <div
                    className="decoration"
                    style={{
                      backgroundColor: budget.theme || "#cccccc",
                    }}
                  ></div>
                  <div>
                    <span className="text-preset-5">{budget.category}</span>
                    <p className="text-preset-4b">
                      ${budget.spentAmount.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="no-budgets-message text-preset-3">
            You haven't set up any budgets yet.
          </div>
        ))}
    </section>
  );
};
