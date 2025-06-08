import React, { type ReactElement } from "react";
import type { BudgetDetails } from "@/services/budgetService.ts";
import { BudgetItem } from "@/pages/BudgetsPage/BudgetList/BudgetItem/BudgetItem.tsx";

type Props = {
  budgets: BudgetDetails[];
};

export const BudgetList = ({ budgets }: Props): ReactElement => {
  return (
    <div className="budgets-page__main--budget-list">
      {budgets.map((budget) => (
        <BudgetItem key={budget.id} budget={budget} allBudgets={budgets} />
      ))}
    </div>
  );
};
