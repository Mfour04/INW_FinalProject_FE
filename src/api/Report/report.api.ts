import type { NoneDataApiResponse } from "../../entity/response";
import http from "../../utils/http";
import type { ReportRequest } from "./report.type";

export const Report = (request: ReportRequest) =>
  http.privateHttp.post<NoneDataApiResponse>(`reports`, request);
