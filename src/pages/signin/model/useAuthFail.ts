import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

export const useAuthFail=()=>{
    const[searchParams]=useSearchParams();
useEffect(()=>{
if (searchParams.get("google_auth_error")) {
toast.error("Autoriazain google error")
}
},[])
}