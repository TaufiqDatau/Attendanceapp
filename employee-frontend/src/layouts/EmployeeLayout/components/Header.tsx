import Icon from "@/components/common/Icon";
import { SettingsIcon } from "lucide-react";
import type { MenuProps } from "antd";
import { Dropdown, Space } from "antd";
import React from "react";

const Header: React.FC<{}> = () => {
  const items: MenuProps["items"] = [
    {
      key: "1",
      label: "My Account",
      disabled: true,
    },
    {
      type: "divider",
    },
    {
      key: "2",
      label: "Profile",
      extra: "⌘P",
    },
    {
      key: "4",
      label: "Settings",
      icon: <SettingsIcon />,
      extra: "⌘S",
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
            Hi, Sarah
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
