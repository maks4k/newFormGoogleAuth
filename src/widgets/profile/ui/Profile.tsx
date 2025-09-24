import { useUserStore } from "@/entites/user"
import { Button } from "@/shared/ui/button";
import { useSignout } from "../model/useSignout";
import { Toaster } from "sonner";




export const Profile = () => {
const user=useUserStore((state)=>state.user);
const { signoutHandler } = useSignout();
  return (
    <div>
      <Toaster/>
      <label className="text-emerald-500">{user?.email}</label>
 <Button onClick={signoutHandler} variant={"outline"} className="text-black cursor-pointer ml-3">
Exit
 </Button>
    </div>
  )
}
