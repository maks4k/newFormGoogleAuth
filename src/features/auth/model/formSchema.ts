import { z } from "zod";

export const BaseFormSchemaConst = {
  emailMin: 6,
  passwordMin: 4,
  passwordMax: 20,
};

const passwordSchema = z
  .string()
  .min(
    BaseFormSchemaConst.passwordMin,
    `Password must not be less than ${BaseFormSchemaConst.passwordMin} characters.`,
  )
  .max(
    BaseFormSchemaConst.passwordMax,
    `Password must not be more than ${BaseFormSchemaConst.passwordMax} characters.`,
  )
  .regex(/[A-Z]/, "Password must contain capital characters.")
  .regex(/[a-z]/, "Password must contain small characters.")
  .regex(/[0-9]/, "Password must contain numeric characters.");

const emailSchema = z
  .string()
  .email()
  .min(
    BaseFormSchemaConst.emailMin,
    `Email must be least ${BaseFormSchemaConst.emailMin} characters.`,
  );

export const emailFormSchema = z.object({email:emailSchema});
export const passordFormSchema=z.object({password:passwordSchema})

const BaseFormSchema = z.object({
  email:emailSchema,
  password: passwordSchema,
});

export const signinFormSchema = BaseFormSchema;

export const signUpFormSchema = BaseFormSchema.extend({
  confirmPassword: passwordSchema.optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});
