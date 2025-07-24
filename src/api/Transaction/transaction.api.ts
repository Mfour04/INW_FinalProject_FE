import http from "../../utils/http";
import type { RechargeRequest, RechargeResponse } from "./transaction.type";

export const QRCheckIn = (data: RechargeRequest) =>
  http.privateHttp.post<RechargeResponse>(`transactions/recharges`, data);
