import { Button } from "@/shared/ui/button";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import { Spinner } from "@/shared/ui/spiner";
import { Toaster } from "sonner";
import {useForgotPassword} from "../model/useForgotPassword"



export const ForgotPasswordForm = () => {
const{form,onSubmit,isDirty,isValid,isSubmitting,buttondisabled}=useForgotPassword()
  return (
    <div>
      <Form {...form}>
        <Toaster />
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mb-5">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="group">
                <FormLabel className="text-zinc-500 group-focus-within:text-zinc-50">
          Enter you Email,to reset password
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="Email"
                      {...field}
                      className="border-zinc-500 focus:border-zink-50 text-zinc-50 pl-9"
                    />
                    <span className="w-5 h-4 bg-[url(https://api.iconify.design/ic:outline-mail.svg?color=%23626060)] bg-no-repeat bg-cover absolute top-2/7 left-2 group-focus-within:bg-[url(https://api.iconify.design/ic:outline-mail.svg?color=%23ffffff)]"></span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            className="w-full bg-[#2859FE] py-6 cursor-pointer hover:bg-[#1642d3]"
            type="submit"
            disabled={!isDirty || !isValid || isSubmitting||buttondisabled}
          >
            {isSubmitting ? <Spinner /> : "Submit"}
          </Button>
        </form>
      </Form>
    </div>
  );
};
