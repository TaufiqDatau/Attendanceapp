import {
  Bell,
  Calendar,
  CalendarDays,
  ChevronRight,
  Flame,
  ListFilter,
  ReceiptText,
  RefreshCcw,
} from "lucide-react";
import React from "react";

interface IconProps {
  name: string;
  className?: string;
}

const Icon: React.FC<IconProps> = ({ name, className }) => {
  switch (name) {
    case "flame":
      return <Flame className={className} />;
    case "filter_list":
      return <ListFilter color="#000000" />;
    case "bell":
      return <Bell color="#000000" />;
    case "calendar":
      return <Calendar color="#f04343" />;
    case "receipt_long":
      return <ReceiptText color="#f04343" />;
    case "chevron_right":
      return <ChevronRight color="#f04343" />;
    case "calendar_days":
      return <CalendarDays color="#f04343" />;
    case "refresh":
      return <RefreshCcw color="#e0e0e0" strokeWidth={3} />;
    default:
      return <span>Icon not found</span>;
  }
};

export default Icon;
