import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { passordFormSchema } from "./formSchema";
import { authApi } from "@/entites/user";
import { toast } from "sonner";
import { ROUTES } from "@/shared/router/constants";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";

export const useResetPassword = () => {
  type FormData = z.infer<typeof passordFormSchema>;

  const form = useForm<FormData>({
    resolver: zodResolver(passordFormSchema),
    mode: "onChange",
    defaultValues: {
      password: "",
    },
  });
  //  const navigate=useNavigate()
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const {
    formState: { isValid, isDirty, isSubmitting },
  } = form;
  const onSubmit = async (data: FormData) => {
    const token = searchParams.get("token");

    try {
      if (!data.password || !token) throw new Error("do no acces this page");
      await authApi.resetPassword({ password: data.password, token });
      navigate(ROUTES.SIGNIN, { state: { isPasswordReset: true } });
    } catch (err) {
      toast.error("Can not reset password.Try again later");
    }
  };
  return {
    form,
    onSubmit,
    isDirty,
    isValid,
    isSubmitting,
    showPassword,
    setShowPassword,
  };
};
