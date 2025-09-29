import AttendanceConfirmationModal from "@/pages/attendance/component/AttendanceConfirmation";
import CameraComponent from "@/pages/attendance/component/CameraComponent";
import LocationSelectorModal from "@/pages/attendance/component/LocationSelectorModal";
import MapComponent from "@/pages/attendance/component/MapComponent";
import type { DesignatedArea } from "@/pages/attendance/interface/area";
import type { Coordinates } from "@/pages/attendance/interface/coordinates";
import { apiFetch } from "@/utils/FetchHelper";
import React, { useEffect, useState } from "react";

interface UpdateLocationPayload {
  latitude: number;
  longitude: number;
}

// Define the expected success response structure
interface UpdateLocationResponse {
  message: string;
  data: UpdateLocationPayload;
}

const MAX_LOCATION_RETRIES = 3;
export default function Attendance(): React.ReactElement {
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [locationError, setLocationError] = useState<string>("");
  const [locationRefreshTrigger, setLocationRefreshTrigger] = useState(0);
  const [area, setArea] = useState<DesignatedArea | null>(null);
  const [openResponsive, setOpenResponsive] = useState(true);
  const [loadingArea, setLoadingArea] = useState(true);

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
    //Get user home location
    apiFetch("/user/home-location").then((res: any) => {
      if (res) {
        setArea({
          center: [res.home_latitude, res.home_longitude],
          radius: 50,
        });
        setLoadingArea(false);
        return;
      }
      setLoadingArea(false);
      setArea(null);
    });
  }, []);

  /**
   * Updates the user's home location.
   * @param coordinates - An object containing the latitude and longitude.
   * @returns The success response from the API.
   */
  async function updateUserLocation(
    coordinates: UpdateLocationPayload
  ): Promise<UpdateLocationResponse> {
    try {
      const response = await apiFetch<UpdateLocationResponse>(
        "/user/update-home-location",
        {
          method: "PUT",
          payload: coordinates,
        }
      );

      console.log(response.message); // "User location updated successfully"
      return response;
    } catch (error) {
      console.error("Failed to update location:", error);
      throw error; // Re-throw the error to be handled by the calling component
    }
  }

  /**
   * This new handler receives the confirmed coordinates from the modal.
   * It contains the logic that used to be in the onOk prop.
   */
  const handleLocationConfirm = async (selectedCoords: {
    latitude: number;
    longitude: number;
  }) => {
    if (!selectedCoords) return;

    const res = await updateUserLocation(selectedCoords);
    if (res.data) {
      setArea({
        center: [res.data.latitude, res.data.longitude],
        radius: 50,
      });
    }
    // Close the modal after the operation is complete
    setOpenResponsive(false);
  };
  return (
    <div className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
      <CameraComponent
        locationError={locationError}
        coords={coords}
        handleRetry={handleRetryLocation}
        area={area}
      />
      <MapComponent designatedArea={area} userLocation={coords} />

      {!area && (
        <LocationSelectorModal
          open={openResponsive}
          userLocation={coords}
          onConfirm={handleLocationConfirm}
          onCancel={() => setOpenResponsive(false)}
        />
      )}
    </div>
  );
}
