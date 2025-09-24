
import { FormLayout } from "./layouts/FormLayout";
import { ROUTES } from "@/shared/router/constants";
import { signUpFormSchema } from "../model/formSchema";
import { ROUTES as ROUTES_VALUES} from "@/shared/api/constants";
import { useAuth } from "../model/useAuth";


export const SignupForm = () => {
// const {SingUpHandler,serverValidationErrors}=useSignup();
const{authHandler,serverValidationErrors}=useAuth(ROUTES_VALUES.SIGNUP);
  return (
    <FormLayout
      ButtonTitle="Sign Up"
      onSubmit={authHandler}
      confirmField={true}
      link={{ to: ROUTES.SIGNIN, title: "Sing in" }}
      schema={signUpFormSchema}
      serverValidationErrors={serverValidationErrors}
    />
  );
};
