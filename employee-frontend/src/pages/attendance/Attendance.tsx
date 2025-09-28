import CameraComponent from "@/pages/attendance/component/CameraComponent";
import MapComponent from "@/pages/attendance/component/MapComponent";
import type { DesignatedArea } from "@/pages/attendance/interface/area";
import type { Coordinates } from "@/pages/attendance/interface/coordinates";
import { Modal } from "antd";
import React, { useEffect, useState } from "react";

const MAX_LOCATION_RETRIES = 3;
export default function Attendance(): React.ReactElement {
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [locationError, setLocationError] = useState<string>("");
  const [locationRefreshTrigger, setLocationRefreshTrigger] = useState(0);
  const [area, setArea] = useState<DesignatedArea | null>(null);
  const [openResponsive, setOpenResponsive] = useState(true);
  const handleRetryLocation = () => {
    setLocationRefreshTrigger((count) => count + 1); // Trigger the useEffect
  };
  const fetchLocation = (retriesLeft: number) => {
    if (!("geolocation" in navigator)) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }

    // Clear previous error on a new attempt
    setLocationError("");

    navigator.geolocation.getCurrentPosition(
      (position: GeolocationPosition) => {
        setCoords({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
        setLocationError(""); // Clear any previous errors
      },
      (error: GeolocationPositionError) => {
        // PERMISSION_DENIED is a permanent error, so we don't retry.
        if (error.code === error.PERMISSION_DENIED) {
          setLocationError(
            "Permission denied. Please allow location access in your browser settings."
          );
          return;
        }

        // If we still have retries left, try again after a short delay.
        if (retriesLeft > 0) {
          console.log(
            `Failed to get location, retrying... (${retriesLeft} attempts left)`
          );
          setTimeout(() => fetchLocation(retriesLeft - 1), 2000); // 2-second delay
          return;
        }

        // If we've run out of retries, set the final error message.
        switch (error.code) {
          case error.POSITION_UNAVAILABLE:
            setLocationError(
              "Location information is unavailable after multiple attempts."
            );
            break;
          case error.TIMEOUT:
            setLocationError(
              "The request to get user location timed out after multiple attempts."
            );
            break;
          default:
            setLocationError(
              "An unknown error occurred while fetching location."
            );
            break;
        }
      }
    );
  };
  useEffect(() => {
    fetchLocation(MAX_LOCATION_RETRIES);
  }, [locationRefreshTrigger]);
  useEffect(() => {
    // setArea({
    //   center: [-6.170203173308093, 106.79145559651656],
    //   radius: 500,
    // });
    setArea(null);
  }, []);
  return (
    <div className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
      <CameraComponent
        locationError={locationError}
        coords={coords}
        handleRetry={handleRetryLocation}
        area={area}
      />
      <MapComponent designatedArea={area} userLocation={coords} />

      <Modal
        title="Modal responsive width"
        centered
        open={openResponsive}
        onOk={() => setOpenResponsive(false)}
        onCancel={() => setOpenResponsive(false)}
        width={{
          xs: "90%",
          sm: "80%",
          md: "70%",
          lg: "60%",
          xl: "50%",
          xxl: "40%",
        }}
      >
        <MapComponent
          userLocation={coords}
          designatedArea={area}
          onLocationSelect={(coords) => console.log(coords)}
        />
      </Modal>
    </div>
  );
}
