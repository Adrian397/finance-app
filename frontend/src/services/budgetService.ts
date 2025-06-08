import { API_BASE_URL, handleApiResponse } from "@/utils/apiUtils";
import { getAuthToken } from "@/utils/authUtils";
import type { TransactionView } from "./transactionService";

export type BudgetDetails = {
  id: number;
  category: string;
  maximumAmount: number;
  theme: string | null;
  spentAmount: number;
  latestTransactions: TransactionView[];
};

export type BudgetPayload = {
  category: string;
  maximumAmount: number | string;
  theme: string | null;
};

const serviceDef = () => {
  const getBudgets = async (): Promise<BudgetDetails[]> => {
    const token = getAuthToken();

    const response = await fetch(`${API_BASE_URL}/budgets`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return handleApiResponse<BudgetDetails[]>(response);
  };

  const addBudget = async (
    budgetData: BudgetPayload,
  ): Promise<BudgetDetails> => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/budgets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(budgetData),
    });
    return handleApiResponse<BudgetDetails>(response);
  };

  const updateBudget = async (
    id: number,
    budgetData: BudgetPayload,
  ): Promise<BudgetDetails> => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/budgets/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(budgetData),
    });
    return handleApiResponse<BudgetDetails>(response);
  };

  const deleteBudget = async (id: number): Promise<void> => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/budgets/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return handleApiResponse<void>(response);
  };

  return { getBudgets, addBudget, updateBudget, deleteBudget };
};

export const budgetService = serviceDef();
