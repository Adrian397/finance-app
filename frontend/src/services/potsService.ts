import { API_BASE_URL, handleApiResponse } from "@/utils/apiUtils";
import { getAuthToken } from "@/utils/authUtils";

export type Pot = {
  id: number;
  name: string;
  currentAmount: number;
  targetAmount: number;
  theme: string | null;
};

export type PotPayload = {
  name: string;
  targetAmount: number | string;
  theme: string | null;
};

const serviceDef = () => {
  const getPots = async (): Promise<Pot[]> => {
    const token = getAuthToken();

    const response = await fetch(`${API_BASE_URL}/pots`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return handleApiResponse<Pot[]>(response);
  };

  const addPot = async (potData: PotPayload): Promise<Pot> => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/pots`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(potData),
    });
    return handleApiResponse<Pot>(response);
  };

  const deletePot = async (id: number): Promise<void> => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/pots/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return handleApiResponse<void>(response);
  };

  const updatePot = async (id: number, payload: PotPayload): Promise<Pot> => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/pots/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    return handleApiResponse<Pot>(response);
  };

  const addMoneyToPot = async (id: number, amount: number): Promise<Pot> => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/pots/${id}/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ amount }),
    });
    return handleApiResponse<Pot>(response);
  };

  const withdrawMoneyFromPot = async (
    id: number,
    amount: number,
  ): Promise<Pot> => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/pots/${id}/withdraw`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ amount }),
    });
    return handleApiResponse<Pot>(response);
  };

  return {
    getPots,
    addPot,
    deletePot,
    updatePot,
    addMoneyToPot,
    withdrawMoneyFromPot,
  };
};

export const potService = serviceDef();
