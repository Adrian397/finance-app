export const API_BASE_URL = "http://localhost:8000/api";

export type ApiErrorDetail = {
  [key: string]: string[] | string;
};

export type ApiErrorResponse = {
  error?: string;
  errors?: ApiErrorDetail;
  message?: string;
  code?: number;
};

export class ApiServiceError extends Error {
  status: number;
  data: ApiErrorResponse;

  constructor(message: string, status: number, data: ApiErrorResponse) {
    super(message);
    this.name = "ApiServiceError";
    this.status = status;
    this.data = data;
    Object.setPrototypeOf(this, ApiServiceError.prototype);
  }
}

export const handleApiResponse = async <T = unknown>(
  response: Response,
): Promise<T> => {
  if (response.status === 204) {
    return undefined as T;
  }

  const responseData: ApiErrorResponse | T = await response.json();

  if (!response.ok) {
    console.error("API Error Response:", response.status, responseData);

    const errorPayload = responseData as ApiErrorResponse;
    const errorMessage =
      errorPayload?.message ||
      errorPayload?.error ||
      (errorPayload?.errors && typeof errorPayload.errors === "object"
        ? Object.values(errorPayload.errors).flat().join(" ")
        : `API request failed with status ${response.status}`);

    throw new ApiServiceError(errorMessage, response.status, errorPayload);
  }
  return responseData as T;
};
