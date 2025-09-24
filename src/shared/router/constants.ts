import { RouteNames } from "../types";

export const ROUTES={
    HOME:'/',
    SIGNIN:`/${RouteNames["Signin"]}`,
    SIGNUP:`/${RouteNames["Signup"]}`,
    FORGOT_PASSWORD:`/${RouteNames["ForgotPassword"]}`,
    RESET_PASSWORD:`/${RouteNames["ResetPassword"]}`
}as const;//роуты для страниц
