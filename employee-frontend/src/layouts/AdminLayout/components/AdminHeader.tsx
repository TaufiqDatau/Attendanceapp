import { Dropdown, Space, type MenuProps } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import { LogOutIcon } from "lucide-react";
import Cookies from "js-cookie";


const AdminHeader: React.FC = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    Cookies.remove("access_token");
    navigate("/login");
  };
  const items: MenuProps["items"] = [
    { key: "1", label: "My Account", disabled: true },
    { type: "divider" },
    {
      key: "logout",
      label: "Logout",
      icon: <LogOutIcon size={16} />,
      danger: true,
      onClick: handleLogout,
    },
  ];
  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-primary/20 px-10 py-3">
      <div className="flex items-center gap-4 text-slate-900 dark:text-white">
        <Dropdown menu={{ items }} arrow={{ pointAtCenter: true }}>
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              <div
                className="h-10 w-10 rounded-full bg-cover bg-center"
                style={{
                  backgroundImage:
                    'url("https://i.pravatar.cc/150?u=a042581f4e29026704d")',
                }}
              ></div>
            </Space>
          </a>
        </Dropdown>
        <h2 className="text-lg font-bold">Attendance Tracker</h2>
      </div>
      <div className="flex flex-1 items-center justify-end gap-6">
        <nav className="flex items-center gap-6">
          <a
            className="text-sm pointer-events-auto cursor-pointer font-medium text-slate-600 hover:text-primary "
            onClick={() => navigate("/admin")}
          >
            Attendance
          </a>
          <a
            className="text-sm pointer-events-auto cursor-pointer  font-medium text-slate-600 hover:text-primary "
            onClick={() => navigate("/admin/employee")}
          >
            Employees
          </a>
        </nav>
        <div className="h-6 w-px bg-primary/20"></div>
        <div className="flex items-center gap-4">
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
