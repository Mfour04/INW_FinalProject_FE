import type { NoneDataApiResponse } from "../../entity/response";
import http from "../../utils/http";
import type {
  CreateBankRequest,
  GetBanksApiResponse,
  GetUserBanksApiRes,
} from "./bank.type";

export const GetBanks = () =>
  http.privateHttp.get<GetBanksApiResponse>(`banks`);

export const GetUserBanks = () =>
  http.privateHttp.get<GetUserBanksApiRes>(`banks/user`);

export const CreateBank = (request: CreateBankRequest) =>
  http.privateHttp.post(`banks/user`, request);

export const SetDefaultBank = (bankAccountId: string) =>
  http.privateHttp.put<NoneDataApiResponse>(
    `banks/user/${bankAccountId}/default`
  );

export const DeleteBank = (bankAccountId: string) =>
  http.privateHttp.delete<NoneDataApiResponse>(`banks/user/${bankAccountId}`)