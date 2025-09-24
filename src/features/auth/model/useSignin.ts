
import { signinFormSchema } from "./formSchema";
import type { AxiosError } from "axios";
import type { z } from "zod";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/shared/router/constants";
import { toast } from "sonner";
import * as Cookies from "js-cookie";
import { useState } from "react";
import type { ValidationFormfieldsTypes } from "../types";
import { authApi } from "@/entites/user";

export const useSignin = () => {
  const navigate = useNavigate();
  const [serverValidationErrors, setServerValidationErrors] =
    useState<ValidationFormfieldsTypes | null>(null);

  const signinHandler = async (data: z.infer<typeof signinFormSchema>) => {
    try {
      const resp = await authApi.signin(data);
      if (!resp.data.token) throw new Error("Token not found");
      Cookies.default.set("token", resp.data.token, {
        expires: 1 / 24,
      });
      navigate(ROUTES.HOME);
    } catch (err) {
      const error = err as AxiosError<{
        error: string | ValidationFormfieldsTypes;
      }>;

      if (error.response?.data.error instanceof Object) {
        setServerValidationErrors(error.response?.data.error);
      } else {
        toast.error(error.response?.data.error);
      }
    }
  };

  return { signinHandler, serverValidationErrors };
};