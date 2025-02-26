import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";

export const Protected = () => {
  const token = Cookies.get("token");

  return token ? <Outlet /> : <Navigate to={"/signin"} />;
};
