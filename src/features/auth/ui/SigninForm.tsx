import { FormLayout } from "./layouts/FormLayout";
import { ROUTES } from "@/shared/router/constants";
import { ROUTES as ROUTES_VALUES } from "@/shared/api/constants";
import { signinFormSchema } from "../model/formSchema";
import { useAuth } from "../model/useAuth";

export const SigninForm = () => {
  // const {SignInHandler,serverValidationErrors}=useSignin();

  const { authHandler, serverValidationErrors } = useAuth(ROUTES_VALUES.SIGNIN);

  return (
    <FormLayout
      ButtonTitle="Sign In"
      onSubmit={authHandler}
      link={{ to: ROUTES.SIGNUP, title: "Sing up" }}
      schema={signinFormSchema}
      serverValidationErrors={serverValidationErrors}
      forgotPassword={true}
    />
  );
};
