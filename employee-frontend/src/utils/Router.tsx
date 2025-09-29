import { createBrowserRouter } from "react-router-dom";
import AdminLayout from "@/layouts/AdminLayout/AdminLayout";
import MainLayout from "@/layouts/EmployeeLayout/MainLayout";
import AttendanceTracker from "@/pages/admin/dashboard/dashboard";
import Attendance from "@/pages/attendance/Attendance";
import HomePage from "@/pages/homepage/homepage";
import Login from "@/pages/login/login";
import ProtectedRoute from "@/components/auths/ProtectedRoute";
import AdminRoute from "@/components/auths/AdminRoute";
import PublicRoute from "@/components/auths/PublicRoute";
import Employee from "@/pages/admin/employee/Employee";

// Import your new guard components

export const router = createBrowserRouter([
  // 1. Routes for logged-in users (but not admins)
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: <HomePage />,
          },
          {
            path: "attendance",
            element: <Attendance />,
          },
        ],
      },
    ],
  },

  // 2. Routes specifically for admins
  {
    element: <AdminRoute />,
    children: [
      {
        path: "/admin",
        element: <AdminLayout />,
        children: [
          {
            index: true,
            element: <AttendanceTracker />,
          },
          {
            path: "employee",
            element: <Employee />,
          },
        ],
      },
    ],
  },

  // 3. Public route for the login page
  {
    element: <PublicRoute />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },
]);
