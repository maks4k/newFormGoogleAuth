import { create } from 'zustand';
import type { IUserPublick } from "../types";
interface IUserStore {
  user: IUserPublick | null;
  setUser: (user: IUserPublick) => void;
  signoutUser:()=>void;
}
export const useUserStore = create<IUserStore>((set) => ({
  user: null,
  setUser: (user) =>{ set({ user: { id: user.id, email: user.email } })},
  signoutUser:()=>set({user:null})
}));
