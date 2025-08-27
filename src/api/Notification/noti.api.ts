import http from "../../utils/http";
import type {
  GetUserNotificationApiRes,
  ReadNotificationReq,
} from "./noti.type";

export const GetUserNotifications = () =>
  http.privateHttp.get<GetUserNotificationApiRes>(
    `Notifications/user/notifications`
  );

export const ReadNotification = (request: ReadNotificationReq) =>
  http.privateHttp.post(`Notifications/mark-as-read`, request);
