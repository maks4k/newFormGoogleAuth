import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import type { BaseFormLayoutProps } from "../types";


export const useFormLoyut = ({
    schema,
    confirmField,
    serverValidationErrors
    }:BaseFormLayoutProps) => {
     const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      ...(confirmField ? { confirmPassword: "" } : {}),
    },
  });
  const {
    watch,
    formState: { errors,isValid,isDirty,isSubmitting },
  } = form;
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isPasswordValid = !errors.password && watch("password");

  // useEffect(() => {
  //   if (serverValidationErrors) {
  //     Object.entries(serverValidationErrors).forEach(([field, messages]) => {
  //       form.setError(field as keyof z.infer<typeof schema>, {type:"server",message:messages.join("\n")});
  //     });
  //   }
  // }, [serverValidationErrors]);
useEffect(() => {
  if (serverValidationErrors) {
    Object.entries(serverValidationErrors).forEach(([field, messages]) => {
      // Проверка что messages существует и это массив
      const errorMessage = Array.isArray(messages) 
        ? messages.join("\n") 
        : String(messages || 'Unknown error');
      
      form.setError(field as keyof z.infer<typeof schema>, {
        type: "server",
        message: errorMessage
      });
    });
  }
}, [serverValidationErrors, form]);
  return {
form,showPassword,setShowPassword,isPasswordValid,showConfirmPassword,setShowConfirmPassword,isValid,isDirty,isSubmitting
  }

  
}
