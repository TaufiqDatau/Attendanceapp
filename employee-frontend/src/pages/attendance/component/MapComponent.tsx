import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import mapPinIcon from "@/assets/map-pin.svg";
import Icon from "@/components/common/Icon";
import type { Coordinates } from "@/pages/attendance/interface/coordinates";
import type { DesignatedArea } from "@/pages/attendance/interface/area";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet-geosearch/dist/geosearch.css";

// Define custom icon for markers
const customIcon = L.icon({
  iconUrl: mapPinIcon,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

interface MapComponentProps {
  userLocation: Coordinates | null;
  designatedArea: DesignatedArea | null;
  onLocationSelect?: (coords: Coordinates) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({
  userLocation,
  designatedArea,
  onLocationSelect,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const selectionMarkerRef = useRef<L.Marker | null>(null);
  const designatedAreaLayerRef = useRef<L.Circle | null>(null);

  // --- 1. Main Setup Effect (Map Creation & Initial Listeners) ---
  useEffect(() => {
    // This effect runs only once on mount
    if (mapContainerRef.current && !mapInstanceRef.current) {
      const initialCenter: L.LatLngTuple = designatedArea
        ? designatedArea.center
        : [-6.1754, 106.8272]; // Default to Jakarta
      const map = L.map(mapContainerRef.current).setView(initialCenter, 13);
      mapInstanceRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      const provider = new OpenStreetMapProvider();
      // @ts-ignore
      const searchControl = new GeoSearchControl({
        provider,
        style: "bar",
        showMarker: false,
        showPopup: false,
        autoClose: true,
        retainZoomLevel: false,
        animateZoom: true,
        keepResult: false,
      });
      map.addControl(searchControl);

      // --- SETUP LOCATION SELECTION LOGIC (IF PROP IS PROVIDED) ---
      console.log("checking designated area");
      if (onLocationSelect && !designatedArea) {
        console.log("add map on click");
        const updateSelection = (latlng: L.LatLng) => {
          if (selectionMarkerRef.current) {
            selectionMarkerRef.current.remove();
          }

          //@ts-ignore
          selectionMarkerRef.current = L.circle(latlng, {
            color: "blue",
            fillColor: "#3b82f6",
            fillOpacity: 0.2,
            radius: 50,
          })
            .addTo(map)
            .bindPopup("Your designated location");

          onLocationSelect({ lat: latlng.lat, lon: latlng.lng });
        };

        const handleMapClick = (e: L.LeafletMouseEvent) =>
          updateSelection(e.latlng);
        const handleSearchResult = (e: any) =>
          updateSelection(L.latLng(e.location.y, e.location.x));

        map.on("click", handleMapClick);
        map.on("geosearch/showlocation", handleSearchResult);
      }
    }

    // Comprehensive cleanup function when component unmounts
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [onLocationSelect]); // Depend on onLocationSelect

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    if (designatedAreaLayerRef.current) {
      designatedAreaLayerRef.current.remove();
    }
    if (designatedArea) {
      designatedAreaLayerRef.current = L.circle(designatedArea.center, {
        color: "blue",
        fillColor: "#3b82f6",
        fillOpacity: 0.2,
        radius: designatedArea.radius,
      })
        .addTo(map)
        .bindPopup("This is the designated area.");
    }
  }, [designatedArea]);

  // --- 3. Handle Displaying and Updating the User's Location ---
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    if (userLocation) {
      const userLatLng: L.LatLngTuple = [userLocation.lat, userLocation.lon];
      if (!userMarkerRef.current) {
        userMarkerRef.current = L.marker(userLatLng, { icon: customIcon })
          .addTo(map)
          .bindPopup("You are here!");
      } else {
        userMarkerRef.current.setLatLng(userLatLng);
      }
      map.setView(userLatLng, 18);
      userMarkerRef.current.openPopup();
    } else if (userMarkerRef.current) {
      userMarkerRef.current.remove();
      userMarkerRef.current = null;
    }
  }, [userLocation]);

  // --- 4. Refresh Map Function ---
  const refreshMap = () => {
    const map = mapInstanceRef.current;
    if (map && userLocation) {
      map.setView([userLocation.lat, userLocation.lon], 18);
    }
  };

  return (
    <div
      className="relative rounded-lg border"
      style={{ height: "80vh", width: "100%" }}
    >
      <button
        onClick={refreshMap}
        className="absolute top-4 right-4 z-[1000] p-2 bg-white rounded-full shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition active:scale-95"
        aria-label="Center on my location"
      >
        <Icon name="refresh" />
      </button>
      <div ref={mapContainerRef} className="z-0 h-full w-full rounded-lg"></div>
    </div>
  );
};

export default MapComponent;
