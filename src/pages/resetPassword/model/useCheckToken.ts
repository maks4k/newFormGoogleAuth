import { ROUTES } from "@/shared/router/constants";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export const useCheckToken = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isToken, setIsToken] = useState(false);

  useEffect(() => {
    if (!searchParams.has("token")) {
      navigate(ROUTES.SIGNIN);
    } else {
      setIsToken(true);
    }
  }, [searchParams,navigate]);
  return {isToken,};
};
