// src/components/auth/PublicRoute.tsx
import Cookies from "js-cookie";
import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
  const token = Cookies.get("access_token");

  // If a token exists, redirect away from the login page.
  // Otherwise, show the login page.
  return token ? <Navigate to="/" replace /> : <Outlet />;
};

export default PublicRoute;
