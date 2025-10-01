import { apiFetch } from "@/utils/FetchHelper";
import React, { useEffect, useState } from "react";

interface AttendanceStats {
  total_attendance_days: number;
  total_leaves: number;
  total_incomplete_days: number;
}

const getAttendanceStats = async (): Promise<{ attendanceStats: AttendanceStats }> => {
  // Get the current date and the first day of the current month
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  // Format dates into "YYYY-MM-DD" strings, which is a common API format.
  const formatDate = (date: Date): string => date.toISOString().split("T")[0];

  const startDate = formatDate(firstDayOfMonth);
  const endDate = formatDate(today);

  // Call the API endpoint with the calculated date range as query parameters
  const stats = await apiFetch<{ attendanceStats: AttendanceStats }>("/user/attendance-stats", {
    method: "GET",
    params: {
      startDate,
      endDate,
    },
  });

  return stats;
};

const AttendanceInfo: React.FC<{}> = () => {
  const [stats, setStats] = useState<AttendanceStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getAttendanceStats();
        setStats(data.attendanceStats);
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []); // Added empty dependency array to run the effect only once on mount

  // --- Loading State ---
  // Shows a skeleton placeholder that mimics the final layout.
  if (isLoading) {
    return (
      <div className="bg-card-light dark:bg-card-dark p-6 rounded-lg shadow-md">
        <div className="animate-pulse flex flex-col text-center gap-6 md:flex-row md:justify-between md:gap-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="flex-1">
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mx-auto md:w-full"></div>
              <div className="h-8 bg-gray-400 dark:bg-gray-600 rounded w-1/4 mx-auto md:w-1/2 mt-2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // --- Error State ---
  // Displays a clear error message to the user.
  if (error) {
    return (
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-md"
        role="alert"
      >
        <strong className="font-bold">Oops! </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  // --- Success State ---
  // Renders the data once it has been successfully fetched.
  return (
    <div className="bg-card-light dark:bg-card-dark p-6 rounded-lg shadow-md">
      <div className="flex flex-col text-center gap-6 md:flex-row md:justify-between md:gap-4">
        <div>
          <p className="text-sm text-subtext-light dark:text-subtext-dark">
            Total working days so far this month
          </p>
          <p className="text-2xl font-bold text-text-light dark:text-text-dark mt-1">
            {stats?.total_attendance_days ?? "N/A"}
          </p>
        </div>
        <div>
          <p className="text-sm text-subtext-light dark:text-subtext-dark">
            Total Leaves this Month
          </p>
          <p className="text-2xl font-bold text-text-light dark:text-text-dark mt-1">
            {stats?.total_leaves ?? "N/A"}
          </p>
        </div>
        <div>
          <p className="text-sm text-subtext-light dark:text-subtext-dark">
            Total Incomplete Days
          </p>
          <p className="text-2xl font-bold text-text-light dark:text-text-dark mt-1">
            {stats?.total_incomplete_days ?? "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AttendanceInfo;
