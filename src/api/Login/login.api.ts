import http from "../../utils/http";
import type { LoginParams, LoginResponse } from "./login.type";

export const Login = (params?: LoginParams) => http.http.post<LoginResponse>('Users/login', params);