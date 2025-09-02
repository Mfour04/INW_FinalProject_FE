import type { ApiResponse } from "../../../entity/response";
import http from "../../../utils/http";
import type { Analysis } from "./analysis.type";

export const GetAnalysis = () =>
  http.privateHttp.get<ApiResponse<Analysis>>(`Admin/analysis`);
