import http from "../../utils/http";

export const GetUserById = (userId: string) =>
    http.privateHttp.get(`/Users/${userId}`);
