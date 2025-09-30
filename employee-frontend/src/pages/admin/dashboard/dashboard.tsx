import React from "react";
import { DatePicker } from "antd";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;
// --- Type Definitions ---

interface StatCardData {
  title: string;
  value: string;
  footer: string;
  trend?: string;
  trendColor?: string;
}

interface AttendanceOverviewItem {
  label: string;
  height: string;
  color: string;
}

interface DailyLateItem {
  day: string;
  height: string;
}

interface LateEmployee {
  name: string;
  lates: number;
  avgLateness: string;
  trend: number;
}

// --- Data (In a real app, this would come from an API) ---

const statsCardsData: StatCardData[] = [
  { title: "Total Employees", value: "1,250", footer: "Company-wide" },
  {
    title: "On-Time Employees",
    value: "1,180",
    footer: "Today",
    trend: "94.4%",
    trendColor: "text-green-500",
  },
];

const attendanceOverviewData: AttendanceOverviewItem[] = [
  { label: "On Time", height: "60%", color: "bg-primary/20" },
  { label: "Late", height: "30%", color: "bg-primary" },
  { label: "Absent", height: "10%", color: "bg-red-500/50" },
];

const dailyLateData: DailyLateItem[] = [
  { day: "Mon", height: "20%" },
  { day: "Tue", height: "30%" },
  { day: "Wed", height: "60%" },
  { day: "Thu", height: "40%" },
  { day: "Fri", height: "70%" },
];

const lateEmployeesData: LateEmployee[] = [
  { name: "Olivia", lates: 8, avgLateness: "12 min", trend: -2 },
  { name: "Noah", lates: 6, avgLateness: "8 min", trend: 1 },
  { name: "Ethan", lates: 5, avgLateness: "15 min", trend: 0 },
  { name: "Ava", lates: 4, avgLateness: "5 min", trend: 2 },
  { name: "Liam", lates: 2, avgLateness: "7 min", trend: -1 },
];

// --- UI Components ---

const endDate = dayjs();
const startDate = dayjs().subtract(7, "days");

const StatCard: React.FC<StatCardData> = ({
  title,
  value,
  footer,
  trend,
  trendColor,
}) => (
  <div className="rounded-lg border border-primary/20 bg-background-light p-6 dark:bg-background-dark">
    <p className="text-base font-medium text-slate-900 dark:text-white">
      {title}
    </p>
    <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">
      {value}
    </p>
    <div className="mt-1 flex items-center gap-1">
      <p className="text-sm text-slate-500 dark:text-slate-400">{footer}</p>
      {trend && <p className={`text-sm font-medium ${trendColor}`}>{trend}</p>}
    </div>
  </div>
);

const AttendanceOverviewChart: React.FC = () => (
  <div className="rounded-lg border border-primary/20 bg-background-light p-6 dark:bg-background-dark">
    <h3 className="text-base font-medium text-slate-900 dark:text-white">
      Daily Attendance Overview
    </h3>
    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
      Today's attendance trends
    </p>
    <div className="mt-6 flex h-48 items-end justify-center gap-4">
      {attendanceOverviewData.map((item, index) => (
        <div key={index} className="flex flex-col items-center gap-2">
          <div
            className={`w-8 rounded-t-lg ${item.color}`}
            style={{ height: item.height }}
          ></div>
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  </div>
);

const LateAttendanceChart: React.FC = () => (
  <div className="rounded-lg border border-primary/20 bg-background-light p-6 dark:bg-background-dark">
    <p className="text-base font-medium text-slate-900 dark:text-white">
      Daily Late Attendance
    </p>
    <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">15</p>
    <div className="mt-1 flex items-center gap-1">
      <p className="text-sm text-slate-500 dark:text-slate-400">Today</p>
      <p className="text-sm font-medium text-green-500">+10%</p>
    </div>
    <div className="mt-6 grid h-48 grid-flow-col items-end justify-items-center gap-6 px-3">
      {dailyLateData.map((item, index) => (
        <div
          key={index}
          className={`w-full rounded-t ${
            index === 2 ? "bg-primary" : "bg-primary/20"
          }`}
          style={{ height: item.height }}
        ></div>
      ))}
    </div>
    <div className="mt-2 grid grid-flow-col justify-items-center gap-6 px-3">
      {dailyLateData.map((item) => (
        <p
          key={item.day}
          className="text-xs font-bold text-slate-500 dark:text-slate-400"
        >
          {item.day}
        </p>
      ))}
    </div>
  </div>
);

const LateEmployeesTable: React.FC = () => {
  const getTrendColor = (trend: number): string => {
    if (trend > 0) return "text-green-500";
    if (trend < 0) return "text-red-500";
    return "text-slate-500";
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-primary/20 bg-background-light dark:bg-background-dark">
      <div className="p-6">
        <h3 className="text-base font-medium text-slate-900 dark:text-white">
          Top Late Employees
        </h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Employees with the most late arrivals this month.
        </p>
      </div>
      <table className="min-w-full divide-y divide-primary/20 text-sm">
        <thead className="bg-primary/5 dark:bg-primary/10">
          <tr>
            <th className="px-6 py-3 text-left font-medium text-slate-600 dark:text-slate-300">
              Employee
            </th>
            <th className="px-6 py-3 text-left font-medium text-slate-600 dark:text-slate-300">
              Lates (Oct)
            </th>
            <th className="px-6 py-3 text-left font-medium text-slate-600 dark:text-slate-300">
              Avg. Lateness
            </th>
            <th className="px-6 py-3 text-left font-medium text-slate-600 dark:text-slate-300">
              Trend (vs. Sep)
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-primary/20 bg-background-light dark:bg-background-dark">
          {lateEmployeesData.map((employee, index) => (
            <tr key={index}>
              <td className="whitespace-nowrap px-6 py-4 font-medium text-slate-900 dark:text-white">
                {employee.name}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-slate-700 dark:text-slate-300">
                {employee.lates}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-slate-700 dark:text-slate-300">
                {employee.avgLateness}
              </td>
              <td
                className={`whitespace-nowrap px-6 py-4 ${getTrendColor(
                  employee.trend
                )}`}
              >
                {employee.trend > 0 ? `+${employee.trend}` : employee.trend}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// --- Main App Component ---

const AttendanceTracker: React.FC = () => {
  return (
    <div className="mx-auto max-w-screen-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 ">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500 ">
          Monitor employee attendance and identify trends.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Left Column */}
        <div className="col-span-1 flex flex-col gap-8">
          {/* Group for the label and date picker */}
          <div className="flex flex-col gap-2">
            <label className="font-medium text-gray-700">
              Select Date Range
            </label>
            <RangePicker defaultValue={[startDate, endDate]} />
          </div>

          {statsCardsData.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
          <AttendanceOverviewChart />
        </div>

        {/* Right Column */}
        <div className="col-span-1 grid grid-cols-1 gap-8 lg:col-span-3">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="col-span-1 grid grid-cols-1 gap-8 lg:col-span-3">
              <LateAttendanceChart />
            </div>
          </div>
          <LateEmployeesTable />
        </div>
      </div>
    </div>
  );
};

export default AttendanceTracker;
