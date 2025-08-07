import http from "../../utils/http";
import type {
  GetUserHistoryParams,
  RechargeRequest,
  RechargeResponse,
  TransactionApiResponse,
  TransactionChartApiResponse,
  TransactionSummaryApiResponse,
} from "./transaction.type";

export const QRCheckIn = (data: RechargeRequest) =>
  http.privateHttp.post<RechargeResponse>(`transactions/recharges`, data);

export const GetUserHistory = (params?: GetUserHistoryParams) =>
  http.privateHttp.get<TransactionApiResponse>(`transactions/user`, { params });

export const GetTransactionSummary = (startDate: string, endDate: string) =>
  http.privateHttp.get<TransactionSummaryApiResponse>(
    `/transactions/dashboard/summary?StartDate=${startDate}&EndDate=${endDate}`
  );

export const GetTransactionChart = (
  range: "day" | "month",
  startDate: string,
  endDate: string
) =>
  http.privateHttp.get<TransactionChartApiResponse>(
    `/transactions/dashboard/chart?Range=${range}&StartDate=${startDate}&EndDate=${endDate}`
  );
