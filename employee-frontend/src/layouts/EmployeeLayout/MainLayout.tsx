// src/layouts/MainLayout.tsx
import Header from "@/layouts/EmployeeLayout/components/Header";
import React from "react";
import { Outlet } from "react-router-dom";

const MainLayout: React.FC<{}> = () => {
  return (
    <div className="container mx-auto p-4 ">
      <Header />
      <main className="min-h-full">
        {/* Child routes defined in the router will render here */}
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
