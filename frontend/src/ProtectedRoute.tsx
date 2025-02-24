import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./store/useAuth";

export const Protected = () => {
  const isLoggedIn = useAuth((state) => state.isLoggedin);

  return isLoggedIn ? <Outlet /> : <Navigate to={"/signin"} />;
};
