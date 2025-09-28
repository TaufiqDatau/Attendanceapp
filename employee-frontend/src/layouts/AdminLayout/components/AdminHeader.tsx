import React from "react";

const LogoIcon: React.FC = () => (
  <div className="h-6 w-6 text-primary">
    <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <path
        clipRule="evenodd"
        d="M12.0799 24L4 19.2479L9.95537 8.75216L18.04 13.4961L18.0446 4H29.9554L29.96 13.4961L38.0446 8.75216L44 19.2479L35.92 24L44 28.7521L38.0446 39.2479L29.96 34.5039L29.9554 44H18.0446L18.04 34.5039L9.95537 39.2479L4 28.7521L12.0799 24Z"
        fill="currentColor"
        fillRule="evenodd"
      ></path>
    </svg>
  </div>
);

const AdminHeader: React.FC = () => (
  <header className="flex items-center justify-between whitespace-nowrap border-b border-primary/20 px-10 py-3">
    <div className="flex items-center gap-4 text-slate-900 dark:text-white">
      <LogoIcon />
      <h2 className="text-lg font-bold">Attendance Tracker</h2>
    </div>
    <div className="flex flex-1 items-center justify-end gap-6">
      <nav className="flex items-center gap-6">
        <a
          className="text-sm font-medium text-slate-600 hover:text-primary dark:text-slate-300 dark:hover:text-primary"
          href="#"
        >
          Dashboard
        </a>
        <a
          className="text-sm font-medium text-slate-600 hover:text-primary dark:text-slate-300 dark:hover:text-primary"
          href="#"
        >
          Employees
        </a>
        <a
          className="text-sm font-medium text-slate-600 hover:text-primary dark:text-slate-300 dark:hover:text-primary"
          href="#"
        >
          Reports
        </a>
      </nav>
      <div className="h-6 w-px bg-primary/20"></div>
      <div className="flex items-center gap-4">
        <button className="flex h-10 items-center justify-center rounded bg-primary px-4 text-sm font-bold text-white">
          Add Employee
        </button>
        <button className="flex h-10 items-center justify-center rounded border border-primary/30 bg-primary/10 px-4 text-sm font-bold text-primary dark:bg-primary/20">
          Edit Attendance
        </button>
        <div
          className="h-10 w-10 rounded-full bg-cover bg-center"
          style={{
            backgroundImage:
              'url("https://i.pravatar.cc/150?u=a042581f4e29026704d")',
          }}
        ></div>
      </div>
    </div>
  </header>
);

export default AdminHeader;
