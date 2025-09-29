import Button from "@/components/common/Button";
import type { Coordinates } from "@/pages/attendance/interface/coordinates";
import AttendanceInfo from "@/pages/homepage/Components/AttendanceInfo";
import QuickActionsSection from "@/pages/homepage/Components/QuickActions";
import { apiFetch } from "@/utils/FetchHelper";
import { fetchLocation } from "@/utils/LocationHelper";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const MAX_LOCATION_RETRIES = 3;

interface AttedanceStatus {
  checkIn: string | null;
  checkOut: string | null;
}

const CheckInOutButtons: React.FC<{}> = () => {
  const navigate = useNavigate();
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [attendanceStatus, setAttendanceStatus] = useState<AttedanceStatus>({
    checkIn: null,
    checkOut: null,
  });
  const [isAttendanceStatusLoading, setIsAttendanceStatusLoading] =
    useState(false);
  const [_, setLocationError] = useState<string>("");

  useEffect(() => {
    setIsAttendanceStatusLoading(true);
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // getMonth() is 0-indexed, so we add 1
    const day = String(today.getDate()).padStart(2, "0");
    const dateNow = `${year}-${month}-${day}`; // Formats to "YYYY-MM-DD"

    setIsAttendanceStatusLoading(true);

    apiFetch(`/attendance-status/${dateNow}`, {
      method: "GET",
      auth: true,
    })
      .then((res: any) => {
        setAttendanceStatus({
          checkIn: res.attendanceHistory.checkIn,
          checkOut: res.attendanceHistory.checkOut,
        });
      })
      .finally(() => setIsAttendanceStatusLoading(false));
  }, []);

  const handleCheckIn = () => {
    if (isAttendanceStatusLoading || attendanceStatus.checkIn) {
      return;
    }
    navigate("/attendance");
  };

  const handleCheckOut = async () => {
    if (isAttendanceStatusLoading || attendanceStatus.checkOut) {
      return;
    }
    await fetchLocation(MAX_LOCATION_RETRIES, setCoordinates, setLocationError);

    apiFetch("/checkout", {
      method: "POST",
      auth: true,
      payload: {
        latitude: coordinates?.lat.toString(),
        longitude: coordinates?.lon.toString(),
      },
    })
      .then((res: any) => {
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      <Button
        disabled={isAttendanceStatusLoading || !!attendanceStatus.checkIn}
        onClick={handleCheckIn}
        className={`
          bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500
          disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed
        `}
      >
        {attendanceStatus.checkIn
          ? `Checked in: ${new Date(
              attendanceStatus.checkIn
            ).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })}`
          : "Check-in"}
      </Button>

      <Button
        disabled={
          isAttendanceStatusLoading ||
          !attendanceStatus.checkIn ||
          !!attendanceStatus.checkOut
        }
        onClick={handleCheckOut}
        className={`
          bg-rose-600 hover:bg-rose-700 focus:ring-rose-500
          disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed
        `}
      >
        {attendanceStatus.checkOut
          ? `Checked out: ${new Date(
              attendanceStatus.checkOut
            ).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })}`
          : "Check-Out"}
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
      </div>
    </div>
  );
};

export default HomePage;
