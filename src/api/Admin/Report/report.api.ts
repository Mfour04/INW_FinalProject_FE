import http from "../../../utils/http";
import type {
  ReportApiResponse,
  ReportActionApiResponse,
  ReportStatus,
} from "./report.type";

export const GetReports = (page: number, limit: number) =>
  http.privateHttp.get<ReportApiResponse>(
    `/Reports?page=${page}&limit=${limit}`
  );

export const GetReportById = (id: string) =>
  http.privateHttp.get<ReportActionApiResponse>(`/Reports/${id}`);

export const UpdateReportStatus = (reportId: string, status: ReportStatus) =>
  http.privateHttp.put<ReportActionApiResponse>(`/Reports/update`, {
    reportId,
    status,
  });
