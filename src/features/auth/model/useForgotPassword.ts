import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { emailFormSchema } from "./formSchema";
import { authApi } from "@/entites/user";
import { toast } from "sonner";
import { ROUTES } from "@/shared/router/constants";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export const useForgotPassword = () => {
  type FormData = z.infer<typeof emailFormSchema>;

  const form = useForm<FormData>({
    resolver: zodResolver(emailFormSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
    },
  });
 const navigate=useNavigate()
 const [buttondisabled,setbuttondisabled]=useState(false)
  const {
    formState: { isValid, isDirty, isSubmitting },
  } = form;
  const onSubmit = async (data: FormData) => {
    try {
        if (!data.email) throw new Error("Can not find email")
      await authApi.forgotPassword(data);
      setbuttondisabled(true)
      toast.success("we send link to ,on your email,to reset password");
      setTimeout(()=>{
        navigate(ROUTES.SIGNIN)
      },4000)
    } catch (err) {
   toast.error("Can not find ,your email");
    }
  };
  return {
    form,
    onSubmit,
    isDirty,
    isValid,
    isSubmitting,
    buttondisabled
  };
};
