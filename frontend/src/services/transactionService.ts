import { API_BASE_URL, handleApiResponse } from "@/utils/apiUtils";
import { getAuthToken } from "@/utils/authUtils";

export type TransactionView = {
  id: string | number;
  name: string;
  category: string;
  date: string;
  amount: number;
  type: "income" | "expense";
  avatar: string | null;
  isRecurring?: boolean;
};

export type PaginatedTransactionsResponse = {
  items: TransactionView[];
  pagination: {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
  };
};

export type GetTransactionsParams = {
  search?: string;
  category?: string;
  sort_by?: string;
  page?: number;
  limit?: number;
};

const serviceDef = () => {
  const getTransactions = async (
    params: GetTransactionsParams = {},
  ): Promise<PaginatedTransactionsResponse> => {
    const token = getAuthToken();

    const queryParams = new URLSearchParams();
    if (params.search && params.search.trim() !== "") {
      queryParams.append("search", params.search.trim());
    }
    if (params.category && params.category.trim() !== "") {
      queryParams.append("category", params.category);
    }
    if (params.sort_by) {
      queryParams.append("sort_by", params.sort_by);
    }
    if (params.page) {
      queryParams.append("page", params.page.toString());
    }
    if (params.limit) {
      queryParams.append("limit", params.limit.toString());
    }

    const url = `${API_BASE_URL}/transactions?${queryParams.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return handleApiResponse<PaginatedTransactionsResponse>(response);
  };

  return { getTransactions };
};

export const transactionService = serviceDef();
