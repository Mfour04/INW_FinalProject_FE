import type { ApiResponse } from "../../entity/response";

export type GetUserNotificationRes = {
  notificationId: string;
  userId: string;
  type: number;
  message: string;
  isRead: boolean;
  createAt: number;
  updateAt: number;
};

export type GetUserNotificationApiRes = ApiResponse<GetUserNotificationRes[]>;
