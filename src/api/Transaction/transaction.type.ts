import type { ApiResponse } from "../../entity/response";

export type RechargeRequest = {
  coinAmount: number;
};

export type RechargeResponse = {
  checkoutUrl: string;
};

export type TransactionItem = {
  paymentMethod: string;
  id: string;
  type: number;
  amount: number;
  status: number;
  completedAt: number;
  createdAt: number;
};

export type TransactionResponse = {
  items: TransactionItem[];
  totalPage: number;
  totalResult: number;
};

export type GetUserHistoryParams = {
  type?: number;
  page?: number;
  limit?: number;
  sortBy?: string;
};

const statusMap: Record<number, string> = {
  0: "Đang xử lý",
  1: "Hoàn thành",
  2: "Bị hủy",
  3: "Thất bại",
  4: "Bị từ chối",
};

export const getStatusLabel = (status: number) =>
  statusMap[status] ?? "Unknown";

const typeMap: Record<number, string> = {
  0: "Nạp coin",
  1: "Rút coin",
  2: "Mua tiểu thuyết",
  3: "Mua chương truyện",
};

export const getTypeLabel = (status: number) => typeMap[status] ?? "Unknown";

export type TransactionApiResponse = ApiResponse<TransactionResponse>;
