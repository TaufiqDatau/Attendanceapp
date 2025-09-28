import type { DesignatedArea } from "@/pages/attendance/interface/area";
import type { Coordinates } from "@/pages/attendance/interface/coordinates";

/**
 * Checks if a user's coordinates are within a designated circular area.
 *
 * @param userCoordinates The user's latitude and longitude.
 * @param area The designated area with a center and a radius in meters.
 * @returns {boolean} True if the user is inside the area, false otherwise.
 */
export function isUserInArea(
  userCoordinates: Coordinates,
  area: DesignatedArea
): boolean {
  const R = 6371e3; // Earth's radius in meters

  const centerLat = area.center[0];
  const centerLon = area.center[1];
  const userLat = userCoordinates.lat;
  const userLon = userCoordinates.lon;

  // Convert degrees to radians
  const toRadians = (deg: number) => deg * (Math.PI / 180);

  const dLat = toRadians(userLat - centerLat);
  const dLon = toRadians(userLon - centerLon);

  const lat1Rad = toRadians(centerLat);
  const lat2Rad = toRadians(userLat);

  // Haversine formula calculation
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) *
      Math.sin(dLon / 2) *
      Math.cos(lat1Rad) *
      Math.cos(lat2Rad);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in meters

  return distance <= area.radius;
}
