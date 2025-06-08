import React, { type ReactElement, useState } from "react";
import "./BudgetsPage.scss";
import { SpendingSummary } from "@/pages/BudgetsPage/SpendingSummary/SpendingSummary.tsx";
import { AddBudgetModal } from "@/pages/BudgetsPage/AddBudgetModal/AddBudgetModal.tsx";
import { useQuery } from "@tanstack/react-query";
import { type BudgetDetails, budgetService } from "@/services/budgetService.ts";
import type { ApiServiceError } from "@/utils/apiUtils.ts";
import { DotLoader } from "react-spinners";
import { BudgetList } from "@/pages/BudgetsPage/BudgetList/BudgetList.tsx";

const BudgetsPage = (): ReactElement => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const {
    data: budgetsData,
    isLoading,
    isError,
    error,
  } = useQuery<BudgetDetails[], ApiServiceError>({
    queryKey: ["budgets"],
    queryFn: budgetService.getBudgets,
  });

  return (
    <>
      <div className="budgets-page">
        <div className="budgets-page__heading">
          <h1 className="text-preset-1">Budgets</h1>
          <button
            className="btn btn-primary"
            onClick={() => setIsAddModalOpen(true)}
          >
            + Add New Budget
          </button>
        </div>
        <div className="budgets-page__main">
          {isLoading && (
            <div className="loading">
              <DotLoader color="#201F24" size={50} />
            </div>
          )}
          {isError && (
            <div className="error">
              Error fetching budgets: {error?.message}
            </div>
          )}
          {!isLoading &&
            !isError &&
            budgetsData &&
            (budgetsData.length > 0 ? (
              <>
                <SpendingSummary budgets={budgetsData} />
                <BudgetList budgets={budgetsData} />
              </>
            ) : (
              <p className="no-budgets-message text-preset-3">
                You haven't created any budgets yet.
              </p>
            ))}
        </div>
      </div>
      <AddBudgetModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        allBudgets={budgetsData || []}
      />
    </>
  );
};

export default BudgetsPage;
