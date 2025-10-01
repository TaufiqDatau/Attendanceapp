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
  const [, setCoordinates] = useState<Coordinates | null>(null);
  const [attendanceStatus, setAttendanceStatus] = useState<AttedanceStatus>({
    checkIn: null,
    checkOut: null,
  });
  const [isAttendanceStatusLoading, setIsAttendanceStatusLoading] =
    useState(false);
  const [_, setLocationError] = useState<string>("");
  const fetchAttendanceStatus = async () => {
    setIsAttendanceStatusLoading(true);

    try {
      // Get today's date in YYYY-MM-DD format
      const today = new Date();
      const dateNow = today.toISOString().split("T")[0]; // A simpler way to get "YYYY-MM-DD"

      // Fetch the data and wait for the response
      const res = await apiFetch<{
        attendanceHistory: {
          checkIn: string | null;
          checkOut: string | null;
        };
      }>(`/attendance-status/${dateNow}`, {
        method: "GET",
        auth: true,
      });

      // Update the attendance status state with the fetched data
      setAttendanceStatus({
        checkIn: res.attendanceHistory.checkIn,
        checkOut: res.attendanceHistory.checkOut,
      });
    } catch (error) {
      console.error("Failed to fetch attendance status:", error);
      // You could also set an error state here if needed
    } finally {
      // This block runs whether the fetch succeeded or failed
      setIsAttendanceStatusLoading(false);
    }
  };


  useEffect(() => {
    fetchAttendanceStatus();
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

    try {
      setLocationError(""); // Clear any previous errors

      // 1. Await the promise to get the actual coordinates
      const fetchedCoordinates = await fetchLocation(MAX_LOCATION_RETRIES);

      // 2. (Optional but good practice) Update the component's state
      setCoordinates(fetchedCoordinates);

      setIsAttendanceStatusLoading(true);
      // 3. Use the newly fetched coordinates directly for the API call
      await apiFetch("/checkout", {
        method: "POST",
        auth: true,
        payload: {
          latitude: fetchedCoordinates.lat.toString(),
          longitude: fetchedCoordinates.lon.toString(),
        },
      })
        .then((res: any) => {
          console.log("API Response:", res);
          fetchAttendanceStatus();
        })
        .catch((apiError) => {
          console.log("API Error:", apiError);
          setIsAttendanceStatusLoading(false);
          // Handle API error
        });
    } catch (error) {
      // This will catch any errors from fetchLocation
      console.error(error);
      if (error instanceof Error) {
        setLocationError(error.message);
      } else {
        setLocationError("An unknown error occurred while fetching location.");
      }
    }
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
            {/* <QuickActionsSection /> */}
          </main>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
