import AdminLayout from "@/layouts/AdminLayout/AdminLayout";
import MainLayout from "@/layouts/EmployeeLayout/MainLayout";
import AttendanceTracker from "@/pages/admin/dashboard/dashboard";
import Attendance from "@/pages/attendance/Attendance";
import HomePage from "@/pages/homepage/homepage";
import Login from "@/pages/login/login";
import { createBrowserRouter } from "react-router-dom";
export const router = createBrowserRouter([
  // 1. Route for the login page (no header)
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <AttendanceTracker />,
      },
    ],
  },
  // 2. Layout route that includes the header
  {
    path: "/",
    element: <MainLayout />,
    // 3. Child routes that will render inside the MainLayout's <Outlet />
    children: [
      {
        index: true, // This matches the parent path "/"
        element: <HomePage />,
      },
      {
        path: "attendance",
        element: <Attendance />,
      },
      // {
      //   path: "profile",
      //   element: <ProfilePage />,
      // },
      // ...add other pages that need the header here
    ],
  },
]);
