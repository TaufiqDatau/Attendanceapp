// src/components/auth/AdminRoute.tsx
import Cookies from "js-cookie";
import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

// Define the structure of the decoded token
interface DecodedToken {
  id: number;
  email: string;
  roles: { name: string }[];
  exp: number;
  iat: number;
}

const AdminRoute = () => {
  const token = Cookies.get("access_token");

  // 1. If there's no token, redirect to login immediately.
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decodedToken = jwtDecode<DecodedToken>(token);
    // 2. Check if the roles array includes an 'Admin' role.
    const isAdmin = decodedToken.roles.some((role) => role.name === "Admin");

    // 3. If they are an admin, show the page. Otherwise, redirect to the homepage.
    return isAdmin ? <Outlet /> : <Navigate to="/" replace />;
  } catch (error) {
    console.error("Invalid token:", error);
    // If token is invalid or expired, force logout/redirect to login
    return <Navigate to="/login" replace />;
  }
};

export default AdminRoute;
