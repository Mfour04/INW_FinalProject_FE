import type { NoneDataApiResponse } from "../../entity/response";
import http from "../../utils/http";
import type {
  ForgotPasswordParams,
  LoginParams,
  LoginResponse,
  RegisterParams,
  RegisterResponse,
  ResetPasswordParams,
} from "./auth.type";

export const Login = (params?: LoginParams) =>
  http.http.post<LoginResponse>("Users/login", params);

export const Register = (params?: RegisterParams) =>
  http.http.post<RegisterResponse>("Users/register", params);

export const ForgotPassword = (params: ForgotPasswordParams) =>
  http.http.post<NoneDataApiResponse>(`Users/forgot-password`, params);

export const ResetPassword = (params: ResetPasswordParams) =>
  http.http.post<NoneDataApiResponse>(`Users/reset-password`, params);
