import http from "../../../utils/http";
import type { ApiResponse } from "../../../entity/response";
import type {
  WithdrawRequest,
  UpdateWithdrawRequestStatusRequest,
  GenerateQRCodeRequest,
} from "./request.type";

export const GetPendingWithdrawRequests = ({
  page = 0,
  limit = 100,
  sortBy = "created_at:desc",
}: {
  page?: number;
  limit?: number;
  sortBy?: string;
}) =>
  http.privateHttp.get<ApiResponse<WithdrawRequest[]>>("/transactions", {
    params: { Type: 1, page, limit, sortBy },
  });

export const UpdateWithdrawRequestStatus = (
  requestId: string,
  request: UpdateWithdrawRequestStatusRequest
) =>
  http.privateHttp.put<ApiResponse<WithdrawRequest>>(
    `/transactions/withdraws/${requestId}/process`,
    request
  );

export const GenerateQRCode = (request: GenerateQRCodeRequest) =>
  http.privateHttp.post<ApiResponse<string>>("/banks/qr", request);
