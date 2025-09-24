import { z } from "zod";
import type { signinFormSchema, signUpFormSchema } from "./model/formSchema";

type FormfieldsKeys=keyof z.infer<typeof signUpFormSchema>

export type ValidationFormfieldsTypes={
  [key in FormfieldsKeys]?:string[]|undefined

}
export interface BaseFormLayoutProps{
schema: typeof signinFormSchema | typeof signUpFormSchema;
confirmField?: boolean;
serverValidationErrors: ValidationFormfieldsTypes | null;
}