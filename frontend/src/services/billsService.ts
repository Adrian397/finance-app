import { API_BASE_URL, handleApiResponse } from "@/utils/apiUtils";
import { getAuthToken } from "@/utils/authUtils";

export type Bill = {
  name: string;
  category: string;
  amount: number;
  avatar: string | null;
  dueDateDay: number;
  status: "paid" | "upcoming";
  isDueSoon: boolean;
};

export type BillsSummary = {
  totalBills: number;
  paidCount: number;
  paidTotal: number;
  upcomingCount: number;
  upcomingTotal: number;
  dueSoonCount: number;
  dueSoonTotal: number;
};

export type BillsApiResponse = {
  bills: Bill[];
  summary: BillsSummary;
};

export type GetBillsParams = {
  search?: string;
  sort_by?: string;
};

const serviceDef = () => {
  const getBills = async (
    params: GetBillsParams = {},
  ): Promise<BillsApiResponse> => {
    const token = getAuthToken();

    const queryParams = new URLSearchParams();
    if (params.search && params.search.trim() !== "") {
      queryParams.append("search", params.search.trim());
    }
    if (params.sort_by) {
      queryParams.append("sort_by", params.sort_by);
    }

    const url = `${API_BASE_URL}/bills?${queryParams.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return handleApiResponse<BillsApiResponse>(response);
  };

  return { getBills };
};

export const billsService = serviceDef();
