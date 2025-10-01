import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import Icon from "@/components/common/Icon";
import { LogOutIcon } from "lucide-react";
import type { MenuProps } from "antd";
import { Dropdown, Space } from "antd";

// 1. Update the DecodedToken interface to include the 'name' property
interface DecodedToken {
  name: string;
  email: string;
}

const Header: React.FC<{}> = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const token = Cookies.get("access_token");
    if (token) {
      try {
        const decodedToken = jwtDecode<DecodedToken>(token);
        // 2. Directly use the 'name' field from the token
        setUserName(decodedToken.name);
      } catch (error) {
        console.error("Failed to decode token:", error);
      }
    }
  }, []);

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
    <header className="flex justify-between items-center mb-8">
      <div className="flex items-center gap-4">
        <Dropdown menu={{ items }} arrow={{ pointAtCenter: true }}>
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              <img
                alt="Employee profile picture"
                className="pointer-events-auto w-12 h-12 rounded-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBVD3NcTbPOIGTpJornSoAPhl4ZUpfCYJYD_W63X23iAu8nSSDzUhlMXuaGDNoQagdV9Qme0ATs3PWYh64fGVtv_K3_O-uXHeOrh5a_Ov6B0xlOZQs8Z4ZJLHvzQGyl0N7rjqKpCDZ9XaSF5qYVJjdYY-WPMEVRNTmh9FV370NOaQXte_Sua3D-IqDRcsuiGov9mpE4XZe1eErpn08x3noEYtcI1bkc6eAi7NsNfz4UTdd8-OW6G1EukUfPl0vmaAMcSE4Km9I1j8jj"
              />
            </Space>
          </a>
        </Dropdown>
        <div>
          <h1 className="text-xl font-bold text-text-light dark:text-text-dark">
            Hi, {userName || "User"}
          </h1>
          <p className="text-sm text-subtext-light dark:text-subtext-dark">
            Welcome back!
          </p>
        </div>
      </div>
      <button className="text-text-light dark:text-text-dark">
        <Icon name="bell"></Icon>
      </button>
    </header>
  );
};

export default Header;
