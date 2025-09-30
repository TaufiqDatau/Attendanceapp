import type { Coordinates } from "@/pages/attendance/interface/coordinates";
// A helper type for coordinates

export const fetchLocation = (retriesLeft: number): Promise<Coordinates> => {
  return new Promise((resolve, reject) => {
    if (!("geolocation" in navigator)) {
      return reject(new Error("Geolocation is not supported by your browser."));
    }

    const attemptFetch = (attemptsLeft: number) => {
      navigator.geolocation.getCurrentPosition(
        // Success callback
        (position: GeolocationPosition) => {
          resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        // Error callback
        (error: GeolocationPositionError) => {
          if (error.code === error.PERMISSION_DENIED) {
            return reject(
              new Error(
                "Permission denied. Please allow location access in your browser settings."
              )
            );
          }

          if (attemptsLeft > 0) {
            console.log(
              `Failed to get location, retrying... (${attemptsLeft} attempts left)`
            );
            setTimeout(() => attemptFetch(attemptsLeft - 1), 2000);
          } else {
            let errorMessage =
              "An unknown error occurred while fetching location.";
            switch (error.code) {
              case error.POSITION_UNAVAILABLE:
                errorMessage =
                  "Location information is unavailable after multiple attempts.";
                break;
              case error.TIMEOUT:
                errorMessage =
                  "The request to get user location timed out after multiple attempts.";
                break;
            }
            reject(new Error(errorMessage));
          }
        }
      );
    };

    attemptFetch(retriesLeft);
  });
};
