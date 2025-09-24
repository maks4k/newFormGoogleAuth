
import { SigninForm, withCheckAuth } from "@/features/auth";
import { FormPageLayout } from "@/shared/ui/layouts/FormPageLayout";
import { useAuthFail } from "../model/useAuthFail";

export const Signin = withCheckAuth(() => {
useAuthFail();
  return <FormPageLayout title="Sign in" form={<SigninForm />} />;
});
