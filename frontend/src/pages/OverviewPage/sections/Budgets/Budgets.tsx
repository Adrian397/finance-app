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
import { ErrorMessage } from "@/components/ErrorMessage/ErrorMessage.tsx";
import { EmptyMessage } from "@/components/EmptyMessage/EmptyMessage.tsx";

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

  return (
    <section className="overview-page__budgets">
      <div
        className="overview-page__budgets--header"
        style={{
          marginBottom:
            isLoading || isError || (budgetsData && budgetsData.length === 0)
              ? 0
              : "2rem",
        }}
      >
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
      {isError && (
        <ErrorMessage
          message="Error fetching budgets"
          error={error?.message || "Unknown error"}
        />
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
            <div className="overview-page__budgets--chart-legend">
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
          <EmptyMessage message="You haven't set up any budgets yet." />
        ))}
    </section>
  );
};
