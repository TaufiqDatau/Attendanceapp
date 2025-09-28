import Button from "@/components/common/Button";
import Icon from "@/components/common/Icon";
import AttendanceInfo from "@/pages/homepage/Components/AttendanceInfo";
import QuickActionsSection from "@/pages/homepage/Components/QuickActions";
import React from "react";
import { useNavigate } from "react-router-dom";

const CheckInOutButtons: React.FC<{}> = () => {
  const navigate = useNavigate();

  const handleCheckIn = () => {
    navigate("/attendance");
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      <Button onClick={handleCheckIn}>Check-in</Button>

      <Button
        onClick={() => {
          console.log("checkout");
        }}
        className="bg-red-200 text-red-500"
      >
        Check-Out
      </Button>
    </div>
  );
};

// ProgressSection: The main container for the progress cards.
const ProgressSection: React.FC<{}> = () => {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold mb-4 text-text-light dark:text-text-dark">
        Your Progress
      </h2>
      <AttendanceInfo />
    </section>
  );
};

//============================================================================
// ## Footer Navigation Component
// The main navigation bar at the bottom of the screen.
//============================================================================
interface NavItemProps {
  iconName: string;
  label: string;
  isActive?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({
  iconName,
  label,
  isActive = false,
}) => {
  const activeClass = isActive
    ? "text-primary"
    : "text-subtext-light dark:text-subtext-dark";
  return (
    <a href="#" className={`text-center ${activeClass}`}>
      <Icon name={iconName} />
      <span className="block text-xs font-medium">{label}</span>
    </a>
  );
};

const FooterNav: React.FC<{}> = () => {
  return (
    <footer className="bg-card-light dark:bg-card-dark shadow-t-lg fixed bottom-0 w-full md:relative">
      <nav className="flex justify-around p-4">
        <NavItem iconName="home" label="Home" isActive={true} />
        <NavItem iconName="email" label="Requests" />
        <NavItem iconName="person" label="Profile" />
      </nav>
    </footer>
  );
};

//============================================================================
// ## Main Home Page Component
// This component assembles all the smaller components into the final page.
//============================================================================
const HomePage: React.FC<{}> = () => {
  return (
    <div className="bg-background-light  font-display text-text-light dark:text-text-dark">
      <div className="flex flex-col min-h-screen">
        <div className="flex-grow p-6">
          <main>
            <CheckInOutButtons />
            <ProgressSection />
            <QuickActionsSection />
          </main>
        </div>
        <FooterNav />
      </div>
    </div>
  );
};

export default HomePage;
