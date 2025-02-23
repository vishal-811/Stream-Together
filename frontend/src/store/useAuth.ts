import { create } from "zustand";

interface LoggedinType{
    isLoggedin: boolean,
    setIsLoggedin: (value: boolean) => void
}


export const useAuth = create<LoggedinType>((set) => ({
    isLoggedin: false,
    setIsLoggedin: (value: boolean) => set({isLoggedin: value})
}))