import type { Bank } from "../../entity/bank";
import type { ApiResponse } from "../../entity/response";

export type CreateBankRequest = {
  bankBin: number;
  bankCode: string;
  bankShortName: string;
  bankAccountName: string;
  bankAccountNumber: string;
  isDefault: boolean;
};

export type GetUserBanksRes = {
  id: string;
  bankShortName: string;
  bankAccountNumber: number;
  bankAccountName: string;
  isDefault: boolean;
  createdAt: number;
};

export type GetVietQrBanksRes = {
  id: number;
  name: string;
  code: string;
  bin: string;
  shortName: string;
  logo: string;
  transferSupported: number;
  lookupSupported: number;
  short_name: string;
  support: number;
  isTransfer: number;
  swift_code: string;
};

export type GetBanksApiResponse = ApiResponse<Bank[]>;
export type GetUserBanksApiRes = ApiResponse<GetUserBanksRes[]>;
export type GetVietQrBanksApiRes = {
  code: string;
  data: GetVietQrBanksRes[];
  desc: string;
};
