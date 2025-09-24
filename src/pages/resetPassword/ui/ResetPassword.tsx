import { ResetPasswordForm } from "@/features/auth";
import { FormPageLayout } from "@/shared/ui/layouts/FormPageLayout";
import { useCheckToken } from "../model/useCheckToken";
import { Spinner } from "@/shared/ui/spiner";

export const ResetPassword = () => {
  const { isToken } = useCheckToken();
  if (!isToken)
    return (
      <div className="min-h-screen flex justify-center">
        (<Spinner />)
      </div>
    );

  return <FormPageLayout title="Reset Password" form={<ResetPasswordForm />} />;
};
