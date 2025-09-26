import { api } from "@/shared/api/axios-instance";
import type { IUserPrivate, IUserPublick } from "../types";
import { ROUTES } from "@/shared/api/constants";

interface IUserRequest extends Pick<IUserPrivate, "email" | "password"> {}

interface IUserResponse {
  token?: string;
  user: IUserPublick;
}

export const authApi = {
  signin: (data: IUserRequest) => api.post<IUserResponse>(ROUTES.SIGNIN, data),
  signup: (data: IUserRequest) => api.post<IUserResponse>(ROUTES.SIGNUP, data),
  signout: (data: { id: IUserPublick["id"] }) =>
    api.post<{ message: string }>(ROUTES.SIGNOUT, data),
  protected: () => api.get<IUserResponse>(ROUTES.PROTECTED),
  authGoogle: () => {
    window.location.href = "http://localhost:4000/api/auth-google";
  },
  forgotPassword: (data: { email: IUserPublick["email"] }) =>
    api.post<{ message: string }>(ROUTES.FORGOT_PASSWORD, data),
  resetPassword: (data: { password: IUserPrivate["password"];token:string|null}) =>
    api.post<{ message: string }>(ROUTES.RESET_PASSWORD, data),
};
