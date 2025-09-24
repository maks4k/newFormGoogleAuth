import { AxiosError } from "axios";
import type { signUpFormSchema } from "./formSchema";
import { z } from "zod";
import { authApi } from "@/entites/user";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/shared/router/constants";
import { toast } from "sonner";
import * as Cookies from "js-cookie";
import type { ValidationFormfieldsTypes } from "../types";
import { useState } from "react";

export const useSignup = () => {
  const [serverValidationErrors, setServerValidationErrors] =
    useState<ValidationFormfieldsTypes | null>(null);

  const navigate = useNavigate();
  const SingUpHandler = async (data: z.infer<typeof signUpFormSchema>) => {
    try {
      const resp = await authApi.signup(data);
      if (!resp.data.token) {
        throw new Error("Token not found");
      }
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
  return { SingUpHandler, serverValidationErrors };
};
