import type { ApiResponse } from "../../../entity/response";
import http from "../../../utils/http";
import type { User } from "./user.type";

export interface UpdateBanUserRequest {
  userIds: string[];
  isBanned: boolean;
  durationType: string;
}

export interface BanUnbanResult {
  UserId: string;
  SignalRSent: boolean;
  NotificationMessage: string;
}

export const GetUsers = ({
  searchTerm,
  page,
  limit,
  sortBy,
}: {
  searchTerm?: string;
  page: number;
  limit: number;
  sortBy: string;
}) =>
  http.privateHttp.get<
    ApiResponse<{ users: User[]; totalUsers: number; totalPages: number }>
  >(`/Users`, {
    params: { searchTerm, page, limit, sortBy },
  });

export const UpdateBanUser = (request: UpdateBanUserRequest) =>
  http.privateHttp.put<ApiResponse<BanUnbanResult[]>>(
    "/Users/ban-vs-unban",
    request
  );

export const GetUserById = (userId: string) =>
  http.privateHttp.get<User>("/Users/user-infor", {
    params: { userId },
  });

export const GetAllUsers = () =>
  http.privateHttp.get<
    ApiResponse<{ users: User[]; totalUsers: number; totalPages: number }>
  >(`/Users`);
