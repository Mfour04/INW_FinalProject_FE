import type { User } from "../../entity/user";
import http from "../../utils/http";
import type { ChangePasswordRequest, ApiResponse } from "./user-settings.type";

export const GetCurrentUserInfo = () =>
  http.privateHttp.get<User>("Users/my-infor");

export const UpdateUserProfile = (data: FormData) =>
  http.multipartHttp.put<ApiResponse>("Users/update-user-profile", data);

export const ChangePassword = (data: ChangePasswordRequest) =>
  http.privateHttp.post<ApiResponse>("Users/change-password", data);
