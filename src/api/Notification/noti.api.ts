import http from "../../utils/http";
import type { GetUserNotificationApiRes } from "./noti.type";

export const GetUserNotifications = () =>
  http.privateHttp.get<GetUserNotificationApiRes>(
    `Notifications/user/notifications`
  );
