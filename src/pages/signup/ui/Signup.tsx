
import { SignupForm, withCheckAuth } from "@/features/auth";
import { FormPageLayout } from "@/shared/ui/layouts/FormPageLayout";


export const Signup = withCheckAuth(() => {


  return <FormPageLayout title="Sign up" form={<SignupForm />} />;
});
