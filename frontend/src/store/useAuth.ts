import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LoggedinType {
  isLoggedin: boolean;
  setIsLoggedin: (value: boolean) => void;

  userName: string | null;
  setUserName: (value: string | null) => void;
}

export const useAuth = create<LoggedinType>()(
  persist(
    (set) => ({
      isLoggedin: false,
      setIsLoggedin: (value) => set({ isLoggedin: value }),

      userName: null,
      setUserName: (value) => set({ userName: value }),
    }),
    {
      name: "username",
      partialize: (state) => ({ userName: state.userName }),
    }
  )
);
