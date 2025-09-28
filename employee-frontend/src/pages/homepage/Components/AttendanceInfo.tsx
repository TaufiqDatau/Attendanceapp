import React from "react";

const AttendanceInfo: React.FC<{}> = () => {
  return (
    <div className="bg-card-light dark:bg-card-dark p-6 rounded-lg shadow-md">
      <div className="flex flex-col text-center gap-6 md:flex-row md:justify-between md:gap-4">
        <div>
          <p className="text-sm text-subtext-light dark:text-subtext-dark">
            Total working days so far this month
          </p>
          <p className="text-2xl font-bold text-text-light dark:text-text-dark mt-1">
            22
          </p>
        </div>
        <div>
          <p className="text-sm text-subtext-light dark:text-subtext-dark">
            Leave credit
          </p>
          <p className="text-2xl font-bold text-text-light dark:text-text-dark mt-1">
            5
          </p>
        </div>
        <div>
          <p className="text-sm text-subtext-light dark:text-subtext-dark">
            Total attendance
          </p>
          <p className="text-2xl font-bold text-text-light dark:text-text-dark mt-1">
            95%
          </p>
        </div>
      </div>
    </div>
  );
};

export default AttendanceInfo;
