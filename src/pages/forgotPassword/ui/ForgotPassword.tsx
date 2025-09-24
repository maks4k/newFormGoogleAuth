import { ForgotPasswordForm } from "@/features/auth"
import { FormPageLayout } from "@/shared/ui/layouts/FormPageLayout"


export const ForgotPassword = () => {
  return (
<FormPageLayout title="Forgot Password" form={<ForgotPasswordForm/>} />
  )
}
