import { useAuth } from "@/store/useAuth";
import Cookies from "js-cookie";
import { useEffect } from "react";

export const AppInitializer = () => {
  const setIsLoggedIn = useAuth((state) => state.setIsLoggedin);

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, [setIsLoggedIn]);

  return null;
};
