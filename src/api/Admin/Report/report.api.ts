import http from "../../../utils/http";
import type {
  ReportApiResponse,
  ReportActionApiResponse,
  ReportParams,
  UpdateActionRequest,
} from "./report.type";

export const GetReports = (params?: ReportParams) =>
  http.privateHttp.get<ReportApiResponse>(`/Reports`, { params });

export const GetReportById = (id: string) =>
  http.privateHttp.get<ReportActionApiResponse>(`/Reports/${id}`);

export const UpdateReportStatus = (
  reportId: string,
  request: UpdateActionRequest
) =>
  http.privateHttp.put<ReportActionApiResponse>(
    `/Reports/${reportId}/moderate`,
    request
  );
