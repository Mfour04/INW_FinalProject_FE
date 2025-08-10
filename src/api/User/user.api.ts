import http from "../../utils/http";

export const UpdateUser = (request: FormData) =>
  http.multipartHttp.put(`Users/update-user-profile`, request);
