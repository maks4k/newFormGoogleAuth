import { Signin } from "@/pages/signin";
import { Signup } from "@/pages/signup";
import { Home } from "@/pages/home";
import { AppLayout } from "./AppLayout";
import { ROUTES } from "@/shared/router/constants";
import {
  createBrowserRouter,
  redirect,
  RouterProvider,
} from "react-router-dom";
import { authApi } from "@/entites/user";
import { ForgotPassword } from "@/pages/forgotPassword";
import { ResetPassword } from "@/pages/resetPassword";

const router = createBrowserRouter([
  {
    // path: ROUTES.HOME,
    element: <AppLayout />,
    children: [
      {
        path: ROUTES.HOME,
        element: <Home />,
        loader: async () => {
          try {
            const resp = await authApi.protected();
            return { user: resp.data.user };
          } catch (error) {
            console.log(error);
            throw redirect(ROUTES.SIGNIN);
          }
        },
      },
    ],
  },
  {
    path: ROUTES.SIGNIN,
    element: <Signin />,
  },
  {
    path: ROUTES.SIGNUP,
    element: <Signup />,
  },
  {
    path: ROUTES.FORGOT_PASSWORD,
    element: <ForgotPassword />,
  },
  {
    path: ROUTES.RESET_PASSWORD,
    element: <ResetPassword />,
  }
]);
export const AppRouter = () => <RouterProvider router={router} />;
