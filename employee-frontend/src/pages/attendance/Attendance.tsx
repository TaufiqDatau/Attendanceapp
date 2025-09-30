import CameraComponent from "@/pages/attendance/component/CameraComponent";
import LocationSelectorModal from "@/pages/attendance/component/LocationSelectorModal";
import MapComponent from "@/pages/attendance/component/MapComponent";
import type { DesignatedArea } from "@/pages/attendance/interface/area";
import type { Coordinates } from "@/pages/attendance/interface/coordinates";
import { apiFetch } from "@/utils/FetchHelper";
import { fetchLocation } from "@/utils/LocationHelper";
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

  const handleRetryLocation = () => {
    setLocationRefreshTrigger((count) => count + 1); // Trigger the useEffect
  };

  useEffect(() => {
    fetchLocation(MAX_LOCATION_RETRIES, setCoords, setLocationError);
    console.log(coords);
  }, [locationRefreshTrigger]);

  useEffect(() => {
    //Get user home location
    apiFetch("/user/home-location").then((res: any) => {
      if (res.home_latitude && res.home_longitude) {
        setArea({
          center: [res.home_latitude, res.home_longitude],
          radius: 50,
        });
        return;
      }
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
    if (res.data.latitude && res.data.longitude) {
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
