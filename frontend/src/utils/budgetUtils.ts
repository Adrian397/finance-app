import type { BudgetDetails } from "@/services/budgetService.ts";

type ChartDataItem = {
  name: string;
  value: number;
  color: string;
};

type CalculatedBudgetData = {
  totalSpent: number;
  totalBudget: number;
  chartData: ChartDataItem[];
};

export const calculateChartData = (
  budgets: BudgetDetails[] | undefined,
): CalculatedBudgetData => {
  if (!budgets || budgets.length === 0) {
    return { chartData: [], totalSpent: 0, totalBudget: 0 };
  }

  let spent = 0;
  let total = 0;

  const chartItems: ChartDataItem[] = budgets.map((budget) => {
    spent += budget.spentAmount;
    total += budget.maximumAmount;
    return {
      name: budget.category,
      value: budget.spentAmount,
      color: budget.theme || "#cccccc",
    };
  });

  return {
    totalSpent: spent,
    totalBudget: total,
    chartData: chartItems,
  };
};
