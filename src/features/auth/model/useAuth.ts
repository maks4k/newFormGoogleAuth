import type { RouteNames } from "@/shared/types";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { ValidationFormfieldsTypes } from "../types";
import type { z } from "zod";
import type { signinFormSchema, signUpFormSchema } from "./formSchema";
import { authApi } from "@/entites/user";
import { ROUTES } from "@/shared/router/constants";
import type { AxiosError } from "axios";
import { toast } from "sonner";

export const useAuth = (ROUTES_VALUE: `${RouteNames}`) => {
  const navigate = useNavigate();
  const [serverValidationErrors, setServerValidationErrors] =
    useState<ValidationFormfieldsTypes | null>(null);
  const location = useLocation();
  useEffect(() => {
    if (
      location.state?.isPasswordReset &&
      location.state.isPasswordReset === true
    ) {
      toast.success("password is updated,sign in ,is new password");
    const newState={...location.state};
    delete newState.isPasswordReset;
    navigate(location.pathname,{
      replace:true,
      state:Object.keys(newState).length>0?newState:undefined
    })
    }
  }, []);
  const authHandler = async (
    data: z.infer<typeof signinFormSchema> | z.infer<typeof signUpFormSchema>,
  ) => {
    try {
      await authApi[ROUTES_VALUE](data);
      // if (!resp.data.token) {
      //   throw new Error("Token not found");
      // }
      // Cookies.set("token", resp.data.token, {
      //   expires: 1 / 24,
      // });куки на клиенте ,от них избавились ,что бы сервер устанавливал куки
      // console.log("nav");

      navigate(ROUTES.HOME);
      // location.replace("/")
    } catch (err) {
      const error = err as AxiosError<{
        error: string | ValidationFormfieldsTypes;
      }>;
      if (error.response?.data.error instanceof Object) {
        setServerValidationErrors(error.response?.data.error);
      } else {
        toast.error(error.response?.data.error);
        // toast.error("Ошибка авторизации ,попробуйте еще раз")
      }
    }
  };
  return { authHandler, serverValidationErrors };
};
