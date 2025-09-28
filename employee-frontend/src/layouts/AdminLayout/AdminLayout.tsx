// src/layouts/MainLayout.tsx
import AdminHeader from "@/layouts/AdminLayout/components/AdminHeader";
import React from "react";
import { Outlet } from "react-router-dom";

const AdminLayout: React.FC<{}> = () => {
  return (
    <div className="flex h-full min-h-screen w-full flex-col">
      <AdminHeader />
      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
        {/* Child routes defined in the router will render here */}
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
