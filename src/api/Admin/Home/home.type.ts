import type { ApiResponse } from "../../../entity/response";

interface DailyCount {
  day: string;
  weekday:
    | "Thứ 2"
    | "Thứ 3"
    | "Thứ 4"
    | "Thứ 5"
    | "Thứ 6"
    | "Thứ 7"
    | "Chủ nhật";
  count: number;
}

export interface DashboardResponse {
  totalUsers: number;
  newUsersToday: number;
  newUsersPerDay: DailyCount[];
  totalNovels: number;
  newNovelsPerDay: DailyCount[];
}

export type DashboardApiResponse = ApiResponse<DashboardResponse>;
