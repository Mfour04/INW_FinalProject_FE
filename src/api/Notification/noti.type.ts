import type { ApiResponse } from "../../entity/response";

export type GetUserNotificationRes = {
  notificationId: string;
  userId: string;
  type: number;
  message: string;
  isRead: boolean;
  novelSlug?: string;
  novelId?: string;
  forumPostId?: string;
  createAt: number;
  updateAt: number;
  avatarUrl: string;
};

export type ReadNotificationReq = {
  notificationIds: string[];
};

export type GetUserNotificationApiRes = ApiResponse<GetUserNotificationRes[]>;
