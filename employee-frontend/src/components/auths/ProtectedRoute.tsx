// src/components/auth/ProtectedRoute.tsx
import Cookies from "js-cookie";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const token = Cookies.get("access_token");

  // If a token exists, render the child component (via Outlet).
  // Otherwise, redirect to the login page.
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
