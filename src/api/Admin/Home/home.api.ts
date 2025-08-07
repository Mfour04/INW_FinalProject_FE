import http from "../../../utils/http";
import type { DashboardApiResponse } from "./home.type";

export const GetHomeDashboard = () =>
  http.privateHttp.get<DashboardApiResponse>(`Admin/admin-dashboard`);
