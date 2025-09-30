import Icon from "@/components/common/Icon";
import React from "react";

//============================================================================
// ## Quick Actions Section Component
// Displays a list of quick actions a user can take.
//============================================================================
interface ActionItemProps {
  iconName: string;
  label: string;
  isLastItem?: boolean;
}

const ActionItem: React.FC<ActionItemProps> = ({
  iconName,
  label,
  isLastItem = false,
}) => {
  const borderClass = isLastItem ? "" : "border-b border-gray-200";
  return (
    <a
      href="#"
      className={`flex items-center p-4 hover:bg-gray-500 ${borderClass} `}
    >
      <div className="bg-red-100  p-3 rounded-lg mr-4">
        <Icon name={iconName} className="text-primary" />
      </div>
      <span className="flex-grow font-medium text-text-light dark:text-text-dark">
        {label}
      </span>
      <Icon
        name="chevron_right"
        className="text-subtext-light dark:text-subtext-dark"
      />
    </a>
  );
};

interface ActionType {
  iconName: string;
  label: string;
}

const Action: ActionType[] = [
  // {
  //   iconName: "calendar",
  //   label: "Leave Request",
  // },
  {
    iconName: "calendar_days",
    label: "Attendance History",
  },
];
const QuickActionsSection: React.FC<{}> = () => {
  return (
    <section>
      <h2 className="text-xl font-bold mb-4 text-text-light dark:text-text-dark">
        Quick Actions
      </h2>
      <div className=" overflow-hidden rounded-lg shadow-md">
        {Action.map((action) => (
          <ActionItem iconName={action.iconName} label={action.label} />
        ))}
      </div>
    </section>
  );
};

export default QuickActionsSection;
