import { authApi } from "@/entites/user";
import { ROUTES } from "@/shared/router/constants";
import { Spinner } from "@/shared/ui/spiner";

import {
  useEffect,
  useState,
  type PropsWithChildren,
  type ReactElement,
} from "react";
import { useNavigate } from "react-router-dom";

export const withCheckAuth = <T,>(Component: (props: T) => ReactElement) => {
  return (props: PropsWithChildren<T>) => {
    const [loading, setloading] = useState(true);
    const navigate = useNavigate();
    useEffect(() => {
      (async () => {
        try {
          await new Promise<void>((res) => {
            setTimeout(() => res(), 2000);
          });
          const resp = await authApi.protected();
          navigate(ROUTES.HOME);
         
        } catch (error) {
          console.error("Ошибка при вызове authApi.protected:", error);
          
        }finally{
 setloading(false);
        }
      })();
    }, []);
    if (loading) {
      return (
        <div className="min-h-screen flex justify-center">
          (<Spinner />)
        </div>
      );
    }
    return <Component {...props} />;
  };
};

// типизация hoc потом надо вынести//
