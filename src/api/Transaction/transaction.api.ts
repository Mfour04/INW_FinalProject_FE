import http from "../../utils/http";
import type {
  GetUserHistoryParams,
  RechargeRequest,
  RechargeResponse,
  TransactionApiResponse,
  WithdrawApiResponse,
  WithdrawRequest,
} from "./transaction.type";

export const QRCheckIn = (data: RechargeRequest) =>
  http.privateHttp.post<RechargeResponse>(`transactions/recharges`, data);

export const GetUserHistory = (params?: GetUserHistoryParams) =>
  http.privateHttp.get<TransactionApiResponse>(`transactions/user`, { params });

export const WithdrawCoin = (data: WithdrawRequest) =>
  http.privateHttp.post<WithdrawApiResponse>(`transactions/withdraws`, data);
