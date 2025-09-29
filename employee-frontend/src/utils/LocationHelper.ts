import type { Coordinates } from "@/pages/attendance/interface/coordinates";

export const fetchLocation = (
  retriesLeft: number,
  setCoords: React.Dispatch<React.SetStateAction<Coordinates | null>>,
  setLocationError: React.Dispatch<React.SetStateAction<string>>
) => {
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
        setTimeout(
          () => fetchLocation(retriesLeft - 1, setCoords, setLocationError),
          2000
        ); // 2-second delay
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
