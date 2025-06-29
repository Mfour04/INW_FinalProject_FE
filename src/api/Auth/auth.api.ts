import http from "../../utils/http";
import type { LoginParams, LoginResponse, RegisterParams, RegisterResponse } from "./auth.type";

export const Login = (params?: LoginParams) => http.http.post<LoginResponse>('Users/login', params);
export const Register = (params?: RegisterParams) => http.http.post<RegisterResponse>('Users/register', params);