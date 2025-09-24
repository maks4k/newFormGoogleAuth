import { useUserStore } from "@/entites/user";
import type { IUserPublick } from "@/entites/user/types";
import { useEffect } from "react";
import { useLoaderData } from "react-router-dom";

export const useUser = () => {
  const { user } = useLoaderData<{ user: IUserPublick }>();
  const setUser = useUserStore((state) => state.setUser);
  useEffect(() => {
    if (user) setUser(user);
  }, [user]);
};
